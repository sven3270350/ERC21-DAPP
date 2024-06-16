import { ethers, parseEther } from "ethers";
import {
  FlashbotsBundleProvider,
  FlashbotsBundleResolution,
  FlashbotsBundleTransaction,
} from "@flashbots/ethers-provider-bundle";
import { NextRequest, NextResponse } from "next/server";
import { Wallet } from "@/types/wallet";

export async function POST(request: NextRequest) {
  const data = await request.json();

  const { connectedWallet, wallets } = data;

  const rpc = process.env.NEXT_PUBLIC_ALCHEMY_RPC;
  const pkey =
    "b62692c615c7a80b84dd8d082570ba78c6a4b4f0af15189caa4547f893f6ccf5";
  const provider = new ethers.JsonRpcProvider(rpc);
  const bundleWallet = new ethers.Wallet(pkey, provider);
  const bundleNonce = await provider.getTransactionCount(bundleWallet.address);

  const flashbotsProvider = await FlashbotsBundleProvider.create(
    provider,
    bundleWallet,
    "https://relay-sepolia.flashbots.net",
    "sepolia"
  );

  const getTransactions = async () => {
    const feeData = await provider.getFeeData();
    console.log(feeData);
    const maxFeePerGas = ethers.parseUnits("100", "gwei").toString();
    const transactions: FlashbotsBundleTransaction[] = await Promise.all(
      wallets.map(async (wallet: Wallet) => {
        const signer = new ethers.Wallet(wallet.privateKey, provider);
        const nonce = await provider.getTransactionCount(wallet.address);
        const ethBalance = await provider.getBalance(wallet.address);
        console.log(feeData.maxFeePerGas! * BigInt(21000));
        return {
          signer: signer,
          transaction: {
            to: connectedWallet,
            chainId: 11155111,
            maxFeePerGas: maxFeePerGas,
            maxPriorityFeePerGas: maxFeePerGas,
            nonce: nonce,
            gasLimit: 21000,
            type: 2,
            value: ethBalance - BigInt(maxFeePerGas) * BigInt(21000),
          },
        };
      })
    );
    return transactions;
  };

  const populatedTransactions = await getTransactions();

  try {
    const signedEnableTradingTx = await flashbotsProvider.signBundle(
      populatedTransactions
    );
    const blockNumber = await provider.getBlockNumber();

    const simulation = await flashbotsProvider.simulate(
      signedEnableTradingTx,
      blockNumber + 1
    );
    console.log(simulation);
    if ("error" in simulation) {
      console.log(`Simulation Error: ${simulation.error.message}`);
      return NextResponse.json({
        success: false,
        simulationError: simulation.error.message,
      });
    }

    const bundleReceipt = await flashbotsProvider.sendRawBundle(
      signedEnableTradingTx,
      blockNumber + 1
    );
    const success =
      (await bundleReceipt.wait()) === FlashbotsBundleResolution.BundleIncluded;
    console.log(success);
    const receipt = await bundleReceipt.receipts();
    console.log(receipt);
    if (success) {
      return NextResponse.json({
        success: true,
        bundleReceipt: receipt,
      });
    } else {
      return NextResponse.json({
        success: false,
        bundleReceipt: receipt,
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      bundleReceipt: error,
    });
  }
}
