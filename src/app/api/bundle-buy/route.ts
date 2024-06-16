import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";
import { FlashbotsBundleProvider } from "@flashbots/ethers-provider-bundle";
import {uniswapRouterabi, uniswapV2RouterAddress, wethAddress} from '@/constants/routerABI.json'
import { ethers, Wallet } from "ethers";

const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_ALCHEMY_RPC);

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  const data = await request.json();

  interface Wallet {
    privateKey: string;
    address: string;
    tokenAmount: number;
    ethAmount: number;
  }
  const { privateKey, tokenAddress, wallets  }: { privateKey: string, tokenAddress: string, wallets: Wallet[] } = data;

  const bundleWallet = new Wallet(privateKey, provider);
  const flashbotsProvider = await FlashbotsBundleProvider.create(
    provider,
    bundleWallet,
    "https://relay-sepolia.flashbots.net",
    "sepolia"
  );

  const maxFeePerGas = ethers.parseUnits("100", "gwei").toString();
  const uniswapV2Router = new ethers.Contract(uniswapV2RouterAddress, uniswapRouterabi, provider);

  //TODO: loop over the wallets to create buy tx
  const buyTransactions = await Promise.all(wallets.map(async (wallet, index) => {
    const nonce = await provider.getTransactionCount(wallet.address);
    const walletSigner = new ethers.Wallet(wallet.privateKey, provider);
    const path = [wethAddress, tokenAddress];
    const deadline = Math.floor(Date.now() / 1000) + 60 * 2; // 2 minutes

    const data = uniswapV2Router.interface.encodeFunctionData("swapExactETHForTokens", [
      wallet.tokenAmount,
      path,
      wallet.address,
      deadline
    ]);

    return {
      signer: walletSigner,
      transaction: {
        to: uniswapV2RouterAddress,
        data: data,
        value: ethers.parseEther(wallet.ethAmount.toString()),
        gasLimit: 150000,
        chainId: 11155111,
        maxFeePerGas: maxFeePerGas, 
        maxPriorityFeePerGas: maxFeePerGas, 
        nonce: nonce + index, 
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
        maxFeePerGas: maxFeePerGas,
        maxPriorityFeePerGas: maxFeePerGas,
        nonce: nonce,
        type: 2,
    },
    },
    {
        signer: bundleWallet,
        transaction: {
          to: "0x0000000000000000000000000000000000000000",
          value: ethers.parseEther("0.1"), // pay miner
          gasLimit: 35000,
          chainId: 11155111,
          maxFeePerGas: maxFeePerGas,
          maxPriorityFeePerGas: maxFeePerGas,
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
  if (simulation?.firstRevert) {
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

  // Send the bundle to Flashbots
  const bundleReceipt = await flashbotsProvider.sendRawBundle(
    signedEnableTradingTx,
    blockNumber + 1
  );
  console.log("Bundle Receipt:", bundleReceipt);

  return NextResponse.json({ success: true, bundleReceipt: bundleReceipt });
}
