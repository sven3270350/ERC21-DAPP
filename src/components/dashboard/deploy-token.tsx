import { Button } from "../ui/button";
import ethers from "ethers";
import { abi, bytecode } from "@/constants/tokenABI.json";

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
  const handleDeployment = async () => {
    const rpc = process.env.NEXT_RPC!;
    const provider = new ethers.provider.JsonRpcProvider(rpc);

    const privateKey = process.env.WALLET_PRIVATE_KEY!;
    const wallet = new ethers.Wallet(privateKey, provider);

    const factory = new ethers.ContractFactory(abi, bytecode, wallet);

    const contract = await factory.deploy(tokenName, tokenSymbol, maxSupply);

    await contract.deployed();

    console.log("Contract deployed at address:", contract.address);
  };

  return (
    <div>
      <Button onClick={handleDeployment}> Deploy Token</Button>
    </div>
  );
};
