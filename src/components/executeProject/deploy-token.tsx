import { Button } from "../ui/button";
import { ethers } from "ethers";
import { abi, bytecode } from "@/constants/tokenABI.json";
import CircleLoader from "react-spinners/CircleLoader";
import { useState } from "react";

interface DeployTokenProps {
  tokenName: string;
  tokenSymbol: string;
  maxSupply: string;
}

export const DeployToken = ({
  tokenName,
  tokenSymbol,
  maxSupply,
}: DeployTokenProps) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployState, setDeployState] = useState(false);
  const handleDeployment = async () => {
    try {
      setIsDeploying(true);
      const rpc = process.env.NEXT_PUBLIC_RPC!;
      const provider = new ethers.providers.JsonRpcProvider(rpc);

      const privateKey = process.env.NEXT_PUBLIC_WALLET_PRIVATE_KEY!;
      const wallet = new ethers.Wallet(privateKey, provider);

      const factory = new ethers.ContractFactory(abi, bytecode, wallet);
      const contract = await factory.deploy(tokenName, tokenSymbol, maxSupply);
      await contract.deployed();

      console.log("Contract deployed at address:", contract.address);

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
        <CircleLoader />
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
