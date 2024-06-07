import { Button } from "../ui/button";
import { ethers } from "ethers";
import { abi, bytecode } from "@/constants/tokenABI.json";
import PuffLoader from "react-spinners/PuffLoader";
import { useState } from "react";

interface DeployTokenProps {
  projectId: string | null;
}

export const DeployToken = ({ projectId }: DeployTokenProps) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployState, setDeployState] = useState(false);

  const handleDeployment = async () => {
    if (!projectId) return;
    try {
      setIsDeploying(true);
      const rpc = process.env.NEXT_PUBLIC_RPC!;
      const provider = new ethers.providers.JsonRpcProvider(rpc);

      const privateKey = process.env.NEXT_PUBLIC_WALLET_PRIVATE_KEY!;
      const wallet = new ethers.Wallet(privateKey, provider);

      const factory = new ethers.ContractFactory(abi, bytecode, wallet);
      const existingData = localStorage.getItem("projectData");

      const parsedData: Record<string, any> = existingData
        ? JSON.parse(existingData)
        : {};
      const tokenData = parsedData[projectId].tokenDetails;

      const contract = await factory.deploy(
        tokenData.tokenName,
        tokenData.tokenSymbol,
        tokenData.maxSupply,
        tokenData.initialSupply
      );

      await contract.deployed();

      console.log("Contract deployed at address:", contract.address);
      tokenData.contractAddress = contract.address;
      parsedData[projectId].tokenDetails = tokenData;
      localStorage.setItem("projectData", JSON.stringify(parsedData));

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
        <Button onClick={handleDeployment} disabled={true}>
          Deployed
        </Button>
      ) : (
        <Button onClick={handleDeployment}> Deploy Token</Button>
      )}
    </div>
  );
};

export const getTxCost = async ({ projectId }: DeployTokenProps) => {
  if (!projectId) return;
  const rpc = process.env.NEXT_PUBLIC_RPC!;
  const provider = new ethers.providers.JsonRpcProvider(rpc);

  const privateKey = process.env.NEXT_PUBLIC_WALLET_PRIVATE_KEY!;
  const wallet = new ethers.Wallet(privateKey, provider);

  const factory = new ethers.ContractFactory(abi, bytecode, wallet);
  const existingData = localStorage.getItem("projectData");

  const parsedData: Record<string, any> = existingData
    ? JSON.parse(existingData)
    : {};
  const tokenData = parsedData[projectId].tokenDetails;

  const deployTransaction = await factory.getDeployTransaction(
    tokenData.tokenName,
    tokenData.tokenSymbol,
    tokenData.maxSupply,
    tokenData.initialSupply
  );
  const estimateGasLimit = await wallet.estimateGas(deployTransaction);
  const gasPrice = await provider.getGasPrice();
  const estimatedTransactionCost = estimateGasLimit.mul(gasPrice);

  return ethers.utils.formatEther(estimatedTransactionCost);
};
