import { ethers } from "ethers";
import { abi, bytecode } from "@/constants/tokenABI.json";
import {
  FlashbotsBundleProvider,
  FlashbotsBundleRawTransaction,
  FlashbotsBundleResolution,
  FlashbotsBundleTransaction,
} from "@flashbots/ethers-provider-bundle";
import { Transaction } from "@/components//Projects/simulateBuyTx";
import { NextRequest, NextResponse } from "next/server";
import { Wallet } from "@/types/wallet";

export async function POST(request: NextRequest) {
  const data = await request.json();

  const { wallets, sellTransactions } = data;

  const rpc = process.env.NEXT_PUBLIC_ALCHEMY_RPC;
  const pkey =
    "b62692c615c7a80b84dd8d082570ba78c6a4b4f0af15189caa4547f893f6ccf5";
  const provider = new ethers.JsonRpcProvider(rpc);
  const bundleWallet = new ethers.Wallet(pkey, provider);
  const bundleWalletNonce = await provider.getTransactionCount(
    bundleWallet.address
  );

  const flashbotsProvider = await FlashbotsBundleProvider.create(
    provider,
    bundleWallet,
    "https://relay-sepolia.flashbots.net",
    "sepolia"
  );

  const getTransactions = async () => {
    const nonceMap = new Map<string, number>();

    for (const wallet of wallets) {
      const nonce = await provider.getTransactionCount(wallet.address);
      nonceMap.set(wallet.address.toLowerCase(), nonce);
    }
    const block = await provider.getBlock("latest");
    const maxFeePerGas = ethers.parseUnits("100", "gwei").toString();
    const PRIORITY_FEE = BigInt(block?.baseFeePerGas || 0);

    const transactions: FlashbotsBundleTransaction[] = await Promise.all(
      sellTransactions.map(async (tx: Transaction) => {
        const wallet = wallets.find(
          (wallet: Wallet) =>
            wallet.address.toLowerCase() === tx.from.toLowerCase()
        );
        if (!wallet) {
          throw new Error(`Wallet not found for address ${tx.from}`);
        }

        const signer = new ethers.Wallet(wallet.privateKey, provider);

        const currentNonce = nonceMap.get(signer.address.toLowerCase())!;
        nonceMap.set(signer.address.toLowerCase(), currentNonce + 1);
        return {
          signer: signer,
          transaction: {
            to: tx.to,
            data: tx.input,
            chainId: 11155111,
            maxFeePerGas: parseFloat(maxFeePerGas),
            maxPriorityFeePerGas: parseFloat(maxFeePerGas),
            nonce: currentNonce,
            gasLimit: 150000,
            type: 2,
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
    console.log("blockNumber:", blockNumber);
    console.log(new Date());

    const simulation = await flashbotsProvider.simulate(
      signedEnableTradingTx,
      blockNumber + 1
    );
    if ("error" in simulation) {
      console.log(`Simulation Error: ${simulation.error.message}`);
      return NextResponse.json({
        success: false,
        simulationError: simulation.error.message,
      });
    }
    console.log(simulation);
    const bundleReceipt = await flashbotsProvider.sendRawBundle(
      signedEnableTradingTx,
      blockNumber + 1
    );
    const success =
      (await bundleReceipt.wait()) === FlashbotsBundleResolution.BundleIncluded;
    console.log(success);

    if (success) {
      return NextResponse.json({
        success: true,
        bundleReceipt: bundleReceipt,
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      bundleReceipt: error,
    });
  }
}
