import { Button } from "@/components/ui/button";
import React from "react"
import { useAccount, useBalance, useNetwork, useToken, useContractRead, erc20ABI } from "wagmi";
import { writeContract, prepareWriteContract } from "@wagmi/core";
import bulksendABI from "../../constants/bulksendABI.json"

const bulkContract = (process.env.TEST_BULKCONTRACT_ADDRESS ?? "0x53f377ab870fc163443033764e7568312eb9c61b") as `0x${string}`;
const tokenAddress = '0xBd2E04Be415ec7517Cb8D110255923D2652Cbb79';
const wallets = ["0x58Dc0daA59D9FcddA2E710602C01085504d14Dd6", "0x33c2629e03987F90D69Cf7FE49039418fb7f44EF"];
const amount = [50, 50]

const MultiToken: React.FC = () => {
  const { address } = useAccount();
  const { chain } = useNetwork()

  const { data: sepBalance, isLoading: sepBalanceLoading } = useBalance({
    address: address, 
    chainId: chain?.id
  })

  const { data: tokenBalance, isLoading: tokenBalanceLoading } = useContractRead({
    address: tokenAddress,
    chainId: chain?.id,
    abi: erc20ABI,
    functionName: 'balanceOf',
    args: [address as `0x${string}`]
  })

  const { data: tokenAllowance, isLoading: tokenAllowanceLoading } = useContractRead({
    address: tokenAddress,
    chainId: chain?.id,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [address as `0x${string}`, bulkContract as `0x${string}`]
  })

  const { data: tokenData, isLoading: tokenLoading } = useToken({
    address: tokenAddress,
  })
  
  const totalAmount = amount.reduce((partialSum, a) => partialSum + a, 0);

  const hanldeClick = async () => {
    if (tokenBalance === undefined || sepBalance === undefined || tokenData === undefined || tokenAllowance === undefined) {
      return;
    }

    if ((Number(tokenBalance)/(10 ** Number(tokenData.decimals))) <= totalAmount) {
      console.log("Insufficient token balance.")
      return;
    }

    if ((Number(tokenAllowance)/(10 ** Number(tokenData.decimals))) <= totalAmount) {
      const { request } = await prepareWriteContract({
        abi: erc20ABI,
        address: tokenAddress,
        functionName: "approve",
        args: [bulkContract as `0x${string}`, tokenBalance],
      });
  
      const approveHash = await writeContract(request);
    }

    const { request } = await prepareWriteContract({
      abi: bulksendABI,
      address: bulkContract,
      functionName: "bulkSendToken",
      args: [tokenAddress as `0x${string}`, wallets, amount.map((value) => BigInt(value) * BigInt((10 ** tokenData.decimals)))],
    });

    const sendHash = await writeContract(request);
  }

  return (
    <Button onClick={hanldeClick}>
      Send
    </Button>
  );
};

export default MultiToken;
