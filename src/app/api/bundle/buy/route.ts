import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";
import {
  FlashbotsBundleProvider,
  FlashbotsBundleRawTransaction,
  FlashbotsBundleResolution,
  FlashbotsBundleTransaction,
  SimulationResponse,
  SimulationResponseSuccess,
} from "@flashbots/ethers-provider-bundle";
import {uniswapRouterABI, uniswapV2RouterAddress, wethAddress} from '@/constants/routerABI.json'
import { ethers, Wallet } from "ethers";
import { Wallet as WalletT } from "@/types/wallet";


export async function POST(request: NextRequest) {

  const session = await getServerSession(authOptions);
  const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_ALCHEMY_RPC);

  const data = await request.json();

  const { privateKey, tokenAddress, wallets  }: { privateKey: string, tokenAddress: string, wallets: WalletT[] } = data;

  const bundleWallet = new Wallet(privateKey, provider);
  const flashbotsProvider = await FlashbotsBundleProvider.create(
    provider,
    bundleWallet,
    "https://relay-sepolia.flashbots.net",
    "sepolia"
  );

  const gas = { 
    maxFeePerGas: ethers.parseUnits("100", "gwei").toString(),
    maxPriorityFeePerGas: ethers.parseUnits("100", "gwei").toString()
  }
  //await provider.getFeeData();
  const uniswapV2Router = new ethers.Contract(uniswapV2RouterAddress, uniswapRouterABI, provider);

  //TODO: loop over the wallets to create buy tx
  const buyTransactions = await Promise.all(wallets.map(async (wallet, index) => {
    const nonce = await provider.getTransactionCount(wallet.address);
    const walletSigner = new ethers.Wallet(wallet.privateKey, provider);
    const path = [wethAddress, tokenAddress];
    const deadline = Math.floor(Date.now() / 1000) + 60 * 2; // 2 minutes

    const data = uniswapV2Router.interface.encodeFunctionData("swapExactETHForTokens", [
      BigInt(wallet.TokenAmount || 0),
      path,
      wallet.address,
      deadline
    ]);

    return {
      signer: walletSigner,
      transaction: {
        to: uniswapV2RouterAddress,
        data: data,
        value: ethers.parseUnits(wallet?.requiredETH || "0"),
        gasLimit: 150000,
        chainId: 11155111,
        maxFeePerGas: gas.maxFeePerGas, 
        maxPriorityFeePerGas: gas.maxPriorityFeePerGas, 
        nonce: nonce, 
        type: 2,
      },
    };
  }));

  const nonce = await provider.getTransactionCount(bundleWallet.address);
  
  const signedEnableTradingTx = await flashbotsProvider.signBundle([
    {
      signer: bundleWallet,
      transaction: 
      {
        to: tokenAddress,
        data: new ethers.Interface(["function setEnableTrading(bool)"]).encodeFunctionData("setEnableTrading", [true]),
        gasLimit: 45000,
        chainId: 11155111, // Sepolia
        maxFeePerGas: gas.maxFeePerGas,
        maxPriorityFeePerGas: gas.maxPriorityFeePerGas,
        nonce: nonce,
        type: 2,
    },
    },
    {
        signer: bundleWallet,
        transaction: {
          to: "0x0000000000000000000000000000000000000000",
          value: ethers.parseEther("0.01337"), // pay miner
          gasLimit: 35000,
          chainId: 11155111,
          maxFeePerGas: gas.maxFeePerGas,
          maxPriorityFeePerGas: gas.maxPriorityFeePerGas,
          nonce: nonce + + 1,
          type: 2,
        },
    },
    ...buyTransactions
  ]);

  const blockNumber = await provider.getBlockNumber();
  console.log(new Date());
  const simulation = await flashbotsProvider.simulate(
    signedEnableTradingTx,
    blockNumber + 1
  );
  console.log(new Date());
  if ('firstRevert' in simulation && simulation.firstRevert) {
    console.log(
        `Simulation Reverted: ${blockNumber} ${JSON.stringify(
            simulation?.firstRevert,
          (key, value) => (typeof value === "bigint" ? value.toString() : value),
          2
        )}`
      );
    return NextResponse.json({ success: false, bundleReceipt: simulation?.firstRevert });
    } else {
    console.log(
      `Simulation Success: ${blockNumber} ${JSON.stringify(
        simulation,
        (key, value) => (typeof value === "bigint" ? value.toString() : value),
        2
      )}`
    );
  }
  console.log(signedEnableTradingTx);

  // Send the bundle to Flashbots WE DONT SEND YET
  const bundleReceipt = await flashbotsProvider.sendRawBundle(
    signedEnableTradingTx,
    blockNumber + 1
  );
  console.log("Bundle Receipt:", bundleReceipt);
  // @ts-ignore: Ignore TypeScript error about 'wait' method
  const success = (await bundleReceipt.wait()) === FlashbotsBundleResolution.BundleIncluded;

  return NextResponse.json({ success: success, bundleReceipt: bundleReceipt });
}
