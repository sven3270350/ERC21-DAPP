import { Button } from "../ui/button";
import { ethers } from "ethers";
import { abi, bytecode } from "@/constants/tokenABI.json";
import PuffLoader from "react-spinners/PuffLoader";
import { useState } from "react";
import Image from "next/image";
import { useWalletClient } from "wagmi";
import {waitForTransaction} from '@wagmi/core'

interface DeployTokenProps {
  tokenName: string,
  tokenSymbol: string,
  maxSupply: string,
  initialSupply: string
  devBuyTax: string,
  devSellTax: string,
  marketingBuyTax: string,
  marketingSellTax: string,
  devWallet: string,
  marketingWallet: string,
}

export const DeployToken = ({ tokenName, tokenSymbol, maxSupply, initialSupply,devBuyTax,
  devSellTax,
  marketingBuyTax,
  marketingSellTax,
  devWallet,
  marketingWallet }: DeployTokenProps) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployState, setDeployState] = useState(false);

  const { data: walletClient } = useWalletClient();

  const handleDeployment = async () => {
    try {
      setIsDeploying(true);

      const hash = await walletClient?.deployContract({
        abi: abi,
        bytecode: bytecode as `0x${string}`,
        args: [  tokenName,
          tokenSymbol,
          maxSupply,
          initialSupply,
          devBuyTax,
          devSellTax,
          marketingBuyTax,
          marketingSellTax,
          devWallet,
          marketingWallet],
      });

      const transaction = await waitForTransaction({
        hash: hash as `0x${string}`,
      })

      console.log("Contract deployed at address:", transaction.contractAddress);

      // localStorage.setItem("projectData", JSON.stringify(parsedData));

      setIsDeploying(false);
      setDeployState(true);
    } catch (error) {
      setIsDeploying(false);
      console.log(error);
    }
  };

  return (
    <div>
      {isDeploying ? (
        <PuffLoader color="white" />
      ) : deployState ? (
        <Button disabled={true} className="flex items-center gap-[3px] bg-[#F57C00] hover:bg-[#F57C00] px-8 py-2 rounded-[6px] font-bold text-black text-sm leading-5">
        <Image
          src="/rocket-black.svg"
          width={20}
          height={20}
          alt="deploy"
        />
        Deployed
      </Button>
      ) : (
        <Button onClick={handleDeployment} className="flex items-center gap-[3px] bg-[#F57C00] hover:bg-[#F57C00] px-8 py-2 rounded-[6px] font-bold text-black text-sm leading-5">
        <Image
          src="/rocket-black.svg"
          width={20}
          height={20}
          alt="deploy"
        />
        Deploy Token
      </Button>
      )}
    </div>
  );
};

export const getTxCost = async ({ tokenName, tokenSymbol, maxSupply, initialSupply }: DeployTokenProps) => {
  const rpc = process.env.NEXT_PUBLIC_RPC!;
  const provider = new ethers.providers.JsonRpcProvider(rpc);

  const privateKey = process.env.NEXT_PUBLIC_WALLET_PRIVATE_KEY!;
  const wallet = new ethers.Wallet(privateKey, provider);

  const factory = new ethers.ContractFactory(abi, bytecode, wallet);

  const deployTransaction = await factory.getDeployTransaction(
    tokenName,
    tokenSymbol,
    maxSupply,
    initialSupply
  );
  const estimateGasLimit = await wallet.estimateGas(deployTransaction);
  const gasPrice = await provider.getGasPrice();
  const estimatedTransactionCost = estimateGasLimit.mul(gasPrice);

  return ethers.utils.formatEther(estimatedTransactionCost);
};