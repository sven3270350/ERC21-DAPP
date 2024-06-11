import { Button } from "../ui/button";
import { ethers } from "ethers";
import { abi, bytecode } from "@/constants/tokenABI.json";
import PuffLoader from "react-spinners/PuffLoader";
import { useState } from "react";
import Image from "next/image";
import { useWalletClient, usePublicClient } from "wagmi";
import { waitForTransaction } from "@wagmi/core";
import { UpdateProject } from "@/utils/update-project";
import { useSession } from "next-auth/react";
import { ExtendedUser } from "@/types/user";
import { saveTransaction } from "@/utils/save-transaction";
import { useRouter } from "next/navigation";

interface DeployTokenProps {
  projectId: string;
  data: any;
  objectData?: any;
}

export const DeployToken = ({
  projectId,
  data,
  objectData,
}: DeployTokenProps) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployState, setDeployState] = useState(false);
  const session = useSession();
  const userId = (session?.data?.user as ExtendedUser)?.id;
  const { data: walletClient } = useWalletClient();

  const rpc = process.env.NEXT_PUBLIC_ALCHEMY_RPC;
  const router = useRouter();

  const handleDeployment = async () => {
    try {
      setIsDeploying(true);

      const hash = await walletClient?.deployContract({
        abi: abi,
        bytecode: bytecode as `0x${string}`,
        args: [
          data.tokendetails.tokenName,
          data.tokendetails.tokenSymbol,
          BigInt(data.tokendetails.maxSupply) * BigInt(10 ** 18),
          BigInt(data.tokendetails.initialSupply) * BigInt(10 ** 18),
          data.devWallet.devBuyTax,
          data.devWallet.devSellTax,
          data.marketingWallet.marketingBuyTax,
          data.marketingWallet.marketingSellTax,
          data.devWallet.devWallet,
          data.marketingWallet.marketingWallet,
        ],
      });

      if (!hash) {
        console.error("Failed to deploy contract");
        return;
      }

      console.log("Transaction hash:", hash);

      const provider = new ethers.providers.JsonRpcProvider(rpc);
      const transaction = await provider.waitForTransaction(hash as string);

      if (transaction && transaction.status === 1) {
        console.log("Transaction was successful!");
        console.log("Contract Address:", transaction.contractAddress);
      } else {
        console.log("Transaction failed");
      }

      if (transaction?.contractAddress) {
        // save the contract address to the project + status
        if (!objectData) {
          console.error("Project not found");
          return;
        }
        const projectData = {
          ...objectData,
        };
        projectData[projectId].status = "In Progress";
        projectData[projectId].deployedTokenAddress =
          transaction?.contractAddress;
        console.log(projectData, "data");
        if (!userId) {
          console.error("User not found");
          return;
        }
        const res = await UpdateProject(projectId, projectData, userId);
        if (res?.error) {
          console.error(res?.error);
          return;
        }
        // save the transaction hash to transaction table
        const transactionData = {
          userId: userId,
          transactionHash: hash as string, // !TODO get the transaction hash
          transactionType: "token deployed",
          projectId: projectId,
        };
        const saveTransactionRes = await saveTransaction(transactionData);
        if (saveTransactionRes?.error) {
          console.error(saveTransactionRes?.error);
          // return; //!TODO: handle error
        }
        // Update the local db
        if (typeof window !== "undefined") {
          console.log("window");
          
          const data = localStorage.getItem("allProjects");
          const parsedData: Record<string, any> = data ? JSON.parse(data) : [];
          const projectsArray = parsedData.map((obj: any) => {
            const key = Object.keys(obj)[0];
            const project = obj[key];
            return {
              ...project,
              projectId: key,
            };
          });
          const project = projectsArray.find(
            (project: any) => project.projectId === projectId
          );
          if (!project) {
            console.error("Project not found");
            return;
          }
          console.log(project, "project");
          
          const projectIndex = projectsArray.findIndex(
            (project: any) => project.projectId === projectId
          );
          projectsArray[projectIndex] = {
            ...project,
            status: "In Progress",
            deployedTokenAddress: transaction?.contractAddress,
          };
          const updatedData = projectsArray.map((project: any) => {
            return {
              [project.projectId]: project,
            };
          });
          console.log(updatedData, "updatedData");
          
          localStorage.setItem("allProjects", JSON.stringify(updatedData));
        }
        router.refresh();
      }

      setIsDeploying(false);
      setDeployState(true);
    } catch (error) {
      setIsDeploying(false);
      console.log(error);
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div>
      {isDeploying ? (
        <PuffLoader color="white" />
      ) : deployState ? (
        <Button
          disabled={true}
          className="flex items-center gap-[3px] bg-[#F57C00] hover:bg-[#F57C00] px-8 py-2 rounded-[6px] font-bold text-black text-sm leading-5"
        >
          <Image src="/rocket-black.svg" width={20} height={20} alt="deploy" />
          Deployed
        </Button>
      ) : (
        <Button
          onClick={handleDeployment}
          type="button"
          className="flex items-center gap-[3px] bg-[#F57C00] hover:bg-[#F57C00] px-8 py-2 rounded-[6px] font-bold text-black text-sm leading-5"
        >
          <Image src="/rocket-black.svg" width={20} height={20} alt="deploy" />
          Deploy Token
        </Button>
      )}
    </div>
  );
};

export const getTxCost = async ({ data }: DeployTokenProps) => {
  const rpc = process.env.NEXT_PUBLIC_RPC!;
  const provider = new ethers.providers.JsonRpcProvider(rpc);

  const privateKey = process.env.NEXT_PUBLIC_WALLET_PRIVATE_KEY!;
  const wallet = new ethers.Wallet(privateKey, provider);

  const factory = new ethers.ContractFactory(abi, bytecode, wallet);

  const deployTransaction = await factory.getDeployTransaction(
    data.tokenDetails.tokenName,
    data.tokenDetails.tokenSymbol,
    data.tokenDetails.maxSupply,
    data.tokenDetails.initialSupply,
    data.devWallet.devBuyTax,
    data.devWallet.devSellTax,
    data.marketingWallet.marketingBuyTax,
    data.marketingWallet.marketingSellTax,
    data.devWallet.devWallet,
    data.marketingWallet.marketingWallet
  );
  const estimateGasLimit = await wallet.estimateGas(deployTransaction);
  const gasPrice = await provider.getGasPrice();
  const estimatedTransactionCost = estimateGasLimit.mul(gasPrice);

  return ethers.utils.formatEther(estimatedTransactionCost);
};
