import { BrowserProvider, JsonRpcSigner, ethers } from "ethers";
import { abi, bytecode } from "@/constants/tokenABI.json";
import PuffLoader from "react-spinners/PuffLoader";
import { useState } from "react";
import Image from "next/image";
import { useWalletClient, usePublicClient } from "wagmi";
import { WalletClient, getWalletClient } from "@wagmi/core";
import { UpdateProject } from "@/utils/update-project";
import { useSession } from "next-auth/react";
import { ExtendedUser } from "@/types/user";
import { FlashbotsBundleProvider } from "@flashbots/ethers-provider-bundle";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Transaction } from "../simulateBuyTx";

interface SellBundleProps {
  sellTransactions: Transaction[];
}

const transactions = [
  {
    from: "0x20FEE153B13d8f0A83bd9B9C2B627f830Ff957FB",
    to: "0x694a967A60b61Cb23dAA46571A137e4Fb0656076",
    value: "250000000000000",
  },
  {
    from: "0x20FEE153B13d8f0A83bd9B9C2B627f830Ff957FB",
    to: "0xf4C4795c309a8e4a1AD548D82a875193980E82ff",
    value: "250000000000000",
  },
  {
    from: "0x20FEE153B13d8f0A83bd9B9C2B627f830Ff957FB",
    to: "0x99299DF679b8dd3AB7650A14F9F334C4649B7f55",
    input:
      "0x095ea7b3000000000000000000000000c532a74256d3db42d0bf7a0400fefdbad76940080000000000000000000000000000000000000000000000008ac7230489e80000",
  },
  {
    from: "0x20FEE153B13d8f0A83bd9B9C2B627f830Ff957FB",
    to: "0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008",
    input:
      "0x18cbafe50000000000000000000000000000000000000000000000008ac7230489e80000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000020fee153b13d8f0a83bd9b9c2b627f830ff957fb00000000000000000000000000000000000000000000000000000000666ca0e3000000000000000000000000000000000000000000000000000000000000000200000000000000000000000099299df679b8dd3ab7650a14f9f334c4649b7f550000000000000000000000007b79995e5f793a07bc00c21412e50ecae098e7f9",
  },
];

export const SellBundle = ({ sellTransactions }: SellBundleProps) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployState, setDeployState] = useState(false);
  const session = useSession();
  const userId = (session?.data?.user as ExtendedUser)?.id;
  const rpc = process.env.NEXT_PUBLIC_ALCHEMY_RPC;
  const pkey =
    "b62692c615c7a80b84dd8d082570ba78c6a4b4f0af15189caa4547f893f6ccf5";
  const provider = new ethers.JsonRpcProvider(rpc);
  const signer = new ethers.Wallet(pkey, provider);
  const router = useRouter();

  const handleBundle = async () => {
    const flashbotsProvider = await FlashbotsBundleProvider.create(
      provider,
      signer,
      "https://relay-sepolia.flashbots.net",
      "sepolia"
    );
    let nonce = await provider.getTransactionCount(signer.address);
    const populatedTransactions = transactions.map((tx) => ({
      signer: signer,
      transaction: {
        ...tx,
        nonce: nonce++,
        gasLimit: 21000,
      },
    }));
    console.log(populatedTransactions);
    const signedEnableTradingTx = await flashbotsProvider.signBundle(
      populatedTransactions
    );

    try {
      const blockNumber = await provider.getBlockNumber();
      console.log("blockNumber:", blockNumber);
      console.log(new Date());
      const simulation = await flashbotsProvider.simulate(
        signedEnableTradingTx,
        blockNumber + 1
      );
      console.log(simulation);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Button
        onClick={handleBundle}
        className="bg-[#27272A] hover:bg-[#F57C00] px-4 py-2 text-[12px] flex gap-2 items-center justify-center rounded-md text-[#000000] text-sm font-bold leading-6 tracking-[0.032px]"
      >
        <p>Sell</p>
      </Button>
    </div>
  );
};
