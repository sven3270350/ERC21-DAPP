import Image from "next/image";
import React, { useState } from "react";
import { writeContract, prepareWriteContract, watchContractEvent, readContract } from "@wagmi/core";
import { Address, parseUnits } from "viem";
import { uniswapRouterabi, uniswapV2FactoryAddress, uniswapV2FactoryABI, uniswapV2RouterAddress, wethAddress } from "@/constants/routerABI.json";
import { abi, } from "@/constants/tokenABI.json";
import { useAccount } from "wagmi";
import { Button } from "../ui/button";
import { ethers } from "ethers";
import ClipLoader from "react-spinners/ClipLoader";



interface CreatePoolProps {
  onPrev?: () => void;
  projectId?: string;
}
const CreatePool: React.FC<CreatePoolProps> = ({ onPrev, projectId,  }) => {
  const { address } = useAccount();
  const [isCreating, setIsCreating] = useState(false);
  const [poolState, setPoolState] = useState(false);
  const [processState, setProcessState] = useState('Create Liquidity Pool')
  
  const handlePoolCreation = async () => {

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
    const tokenData = project?.tokendetails;
    const poolData = project?.poolData;
    const tokenAddress = project?.deployedTokenAddress;
    const amountTokenDesired = poolData.tokenAmountA;
    const amountETHDesired = poolData?.tokenAmountB;
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

    try {

      setIsCreating(true);
      const rpc = process.env.NEXT_PUBLIC_ALCHEMY_RPC;
      const provider = new ethers.JsonRpcProvider(rpc)
      
      setProcessState('Approving')
      const { request: approveRequest } = await prepareWriteContract({
        abi,
        address: tokenAddress,
        functionName: "approve",
        args: [
          uniswapV2RouterAddress as Address,
          parseUnits(amountTokenDesired, 18),
        ],
      });
      const approveHash = await writeContract(approveRequest);
      const approveReceipt = await provider.waitForTransaction(approveHash.hash)
      
      if (approveReceipt && approveReceipt.status === 1) {
        console.log('Approval was successful!');
      } else {
        console.log('Approval failed');
        return;
      }

      setProcessState('Creating Pool')

      const routerContract = new ethers.Contract(uniswapV2RouterAddress, uniswapRouterabi, provider);
      const tx = await routerContract.addLiquidityETH.staticCall(tokenAddress,
          parseUnits(amountTokenDesired, 18),
          parseUnits(amountTokenDesired, 18),
          parseUnits(amountETHDesired, 18),
          address,
          deadline,{from: address, value: parseUnits(amountETHDesired, 18)});

        console.log(tx)

      const { request } = await prepareWriteContract({
        abi: uniswapRouterabi,
        address: uniswapV2RouterAddress as Address,
        functionName: "addLiquidityETH",
        args: [
          tokenAddress,
          parseUnits(amountTokenDesired, 18),
          parseUnits(amountTokenDesired, 18),
          parseUnits(amountETHDesired, 18),
          address,
          deadline,
        ],
        value: parseUnits(amountETHDesired, 18),
      });

      const hash = await writeContract(request);

      const receipt = await provider.waitForTransaction(hash.hash)

      if (receipt && receipt.status === 1) {
        console.log('Pool creation was successful!');

        const factoryContract = new ethers.Contract(uniswapV2FactoryAddress, uniswapV2FactoryABI, provider);
        const pairAddress = await factoryContract.getPair(wethAddress, tokenAddress)
        console.log(pairAddress)

        setProcessState('Setting Pair Address')  

      const { request: setPairRequest } = await prepareWriteContract({
        abi,
        address: tokenAddress,
        functionName: "setSwapPair",
        args: [
          pairAddress as Address,
        ],
      });
      const setPairHash = await writeContract(setPairRequest);
      const setPairReceipt = await provider.waitForTransaction(setPairHash.hash)

      console.log(setPairReceipt);
      } else {
        console.log('Pool creation failed');
        return;
      }
      setIsCreating(false);
      setPoolState(true)
    } catch (error) {
      console.log(error);
      setProcessState('Create Liquidity Pool')  
      setIsCreating(false);
    }
  };

  return (
    <div>
      {poolState ? (
        <Button disabled={true} className="flex items-center gap-[3px] bg-[#F57C00] hover:bg-[#F57C00] px-8 py-2 rounded-[6px] font-bold text-black text-sm leading-5">
        <Image
          src="/pool.svg"
          width={20}
          height={20}
          alt="pool"
        />
        Created
      </Button>
      ) : (
        <Button disabled={isCreating} onClick={handlePoolCreation} className="flex items-center gap-[8px] bg-[#F57C00] hover:bg-[#F57C00] px-8 py-2 rounded-[6px] font-bold text-black text-sm leading-5">
        <Image
          src="/pool.svg"
          width={20}
          height={20}
          alt="pool"
        />
        {processState}
        {isCreating && (
                    <ClipLoader
                      color="#fff"
                      className="color-[black]"
                      size="16px"
                    />
                  )}
      </Button>
      )}
    </div>
  );
};

export default CreatePool;
