import { ethers } from "ethers";
import {
  FlashbotsBundleProvider,
  FlashbotsBundleResolution,
  FlashbotsBundleTransaction,
} from "@flashbots/ethers-provider-bundle";
import { Transaction } from "@/components//Projects/simulateBuyTx";
import { NextRequest, NextResponse } from "next/server";
import { Wallet } from "@/types/wallet";

export async function POST(request: NextRequest) {
  const data = await request.json();

  const { privateKey, wallets, sellTransactions } = data;

  const rpc = process.env.NEXT_PUBLIC_ALCHEMY_RPC;
  const provider = new ethers.JsonRpcProvider(rpc);
  const bundleWallet = new ethers.Wallet(privateKey, provider);

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
    const maxFeePerGas = ethers.parseUnits("100", "gwei").toString();

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
    } else if (simulation?.firstRevert) {
      console.log(
        `Simulation Reverted: ${blockNumber} ${JSON.stringify(
          simulation?.firstRevert,
          (key, value) =>
            typeof value === "bigint" ? value.toString() : value,
          2
        )}`
      );
      return NextResponse.json({
        success: false,
        bundleReceipt: simulation?.firstRevert,
      });
    } else {
      console.log(
        `Simulation Success: ${blockNumber} ${JSON.stringify(
          simulation,
          (key, value) =>
            typeof value === "bigint" ? value.toString() : value,
          2
        )}`
      );
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
