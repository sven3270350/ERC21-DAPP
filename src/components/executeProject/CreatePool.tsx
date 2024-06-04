import Image from "next/image";
import React from "react";
import { ethers } from "ethers";
import { writeContract, prepareWriteContract, readContract } from "@wagmi/core";
import { parseEther, parseUnits } from "viem";
import { abi } from "@/constants/routerABI.json";
import { useAccount } from "wagmi";
interface CreatePoolProps {
  onPrev?: () => void;
  projectId: string;
}
const CreatePool: React.FC<CreatePoolProps> = ({ onPrev, projectId }) => {
  const { address } = useAccount();

  const handlePoolCreation = async () => {
    const existingData = localStorage.getItem("projectData");
    const parsedData: Record<string, any> = existingData
      ? JSON.parse(existingData)
      : {};
    const tokenData = parsedData[projectId].tokenDetails;
    const poolData = parsedData[projectId].poolData;
    const tokenAddress = tokenData?.contractAddress;
    const amountTokenDesired = poolData.tokenLiquidityAmount;
    const amountETHDesired = poolData.ethLiquidityAmount;
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

    try {
      const { request } = await prepareWriteContract({
        abi,
        address: "0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008",
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
    <div className="p-6 flex flex-col items-center gap-6 border border-[#18181B] rounded-xl ">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-xl font-bold leading-8">Create Pool</h1>
        <p className="text-[#71717A] text-sm font-medium leading-5 ">
          Stop trading is active
        </p>
      </div>
      <div className="flex justify-between w-full ">
        <button className="py-2 flex justify-center items-center text-[#F57C00] text-sm font-bold ">
          Cancel
        </button>
        <div className="flex gap-2 tracking-[0.07px]">
          <button
            className="py-2 px-8 flex justify-center gap-2 items-center text-[#F57C00] text-sm font-bold "
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
            className="bg-[#F57C00] text-black px-8 py-2 text-sm font-bold  rounded-md "
          >
            Execute
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePool;
