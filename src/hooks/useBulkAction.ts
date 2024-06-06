import { useState } from "react";
import { useAccount, erc20ABI } from "wagmi";
import { publicClient } from "../lib/viem";
import { writeContract, prepareWriteContract } from "@wagmi/core";
import bulksendABI from "../constants/bulksendABI.json";

const bulkContract = ((process.env.NEXT_PUBLIC_ENVIRONMENT === "development"
  ? process.env.NEXT_PUBLIC_TEST_BULKCONTRACT_ADDRESS
  : process.env.NEXT_PUBLIC_BULKCONTRACT_ADDRESS) ??
  "0x53f377ab870fc163443033764e7568312eb9c61b") as `0x${string}`;

type SendBulkTokendType = {
  tokenAddress: `0x${string}`;
  wallets: string[];
  amount: number[];
};

const useBulkAction = () => {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sendBulkToken = async ({
    tokenAddress,
    wallets,
    amount,
  }: SendBulkTokendType) => {
    setIsLoading(true);
    if (!address) {
      setIsLoading(false);
      return "Please connect the wallet.";
    }

    const tokenBalance = await publicClient.readContract({
      address: tokenAddress,
      abi: erc20ABI,
      functionName: "balanceOf",
      args: [address as `0x${string}`],
    });

    const tokenAllowance = await publicClient.readContract({
      address: tokenAddress,
      abi: erc20ABI,
      functionName: "allowance",
      args: [address as `0x${string}`, bulkContract as `0x${string}`],
    });

    const tokenDecimals = await publicClient.readContract({
      address: tokenAddress,
      abi: erc20ABI,
      functionName: "decimals",
    });

    const totalAmount = amount.reduce((partialSum, a) => partialSum + a, 0);

    if (tokenBalance && tokenAllowance && tokenDecimals) {
      if (tokenBalance <= BigInt(totalAmount) * BigInt(10 ** tokenDecimals)) {
        setIsLoading(false);
        return "Insufficient token balance.";
      }

      if (tokenAllowance <= BigInt(totalAmount) * BigInt(10 ** tokenDecimals)) {
        const { request } = await prepareWriteContract({
          abi: erc20ABI,
          address: tokenAddress,
          functionName: "approve",
          args: [bulkContract as `0x${string}`, tokenBalance],
        });

        await writeContract(request);
      }

      const { request } = await prepareWriteContract({
        abi: bulksendABI,
        address: bulkContract,
        functionName: "bulkSendToken",
        args: [
          tokenAddress as `0x${string}`,
          wallets,
          amount.map((value) => BigInt(value) * BigInt(10 ** tokenDecimals)),
        ],
      });

      const sendHash = await writeContract(request);

      setIsLoading(false);
      return sendHash;
    } else {
      setIsLoading(false);
      return "Error while fetching onchain Data.";
    }
  };

  return { sendBulkToken, isLoading };
};

export default useBulkAction;
