import Image from "next/image";
import React from "react";
import { writeContract, prepareWriteContract } from "@wagmi/core";
import { Address, parseEther, parseUnits } from "viem";
import { abi, routerAddress } from "@/constants/routerABI.json";
import { useAccount } from "wagmi";
import { toast } from "sonner";
interface CreatePoolProps {
  onPrev?: () => void;
  projectId?: string;
}
const CreatePool: React.FC<CreatePoolProps> = ({ onPrev, projectId }) => {
  const { address } = useAccount();

  const handlePoolCreation = async () => {
    const existingData = localStorage.getItem("projectData");
    const parsedData: Record<string, any> = existingData
      ? JSON.parse(existingData)
      : {};
    if (!projectId) {
      toast.error("Project Id not found");
      return;
    }
    const tokenData = parsedData[projectId]?.tokenDetails;
    const poolData = parsedData[projectId]?.poolData;
    const tokenAddress = tokenData?.contractAddress;
    const amountTokenDesired = poolData.tokenLiquidityAmount;
    const amountETHDesired = poolData.ethLiquidityAmount;
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

    try {
      const { request } = await prepareWriteContract({
        abi,
        address: routerAddress as Address,
        functionName: "addLiquidityETH",
        args: [
          tokenAddress,
          amountTokenDesired,
          amountTokenDesired,
          amountETHDesired,
          address,
          deadline,
        ],
        value: parseUnits(amountETHDesired, 18),
      });
      console.log(request);
      const hash = await writeContract(request);

      console.log(hash);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 border-[#18181B] p-6 border rounded-xl">
      <div className="flex flex-col items-center gap-2">
        <h1 className="font-bold text-xl leading-8">Create Pool</h1>
        <p className="font-medium text-[#71717A] text-sm leading-5">
          Stop trading is active
        </p>
      </div>
      <div className="flex justify-between w-full">
        <button className="flex justify-center items-center py-2 font-bold text-[#F57C00] text-sm">
          Cancel
        </button>
        <div className="flex gap-2 tracking-[0.07px]">
          <button
            className="flex justify-center items-center gap-2 px-8 py-2 font-bold text-[#F57C00] text-sm"
            onClick={onPrev}
          >
            <Image
              src={"/arrow-left-02.svg"}
              alt="back"
              width={20}
              height={20}
            />{" "}
            Back
          </button>
          <button
            onClick={handlePoolCreation}
            className="bg-[#F57C00] px-8 py-2 rounded-md font-bold text-black text-sm"
          >
            Execute
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePool;
