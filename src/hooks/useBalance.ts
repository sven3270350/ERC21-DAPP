import { useState } from "react";
import { erc20ABI } from "wagmi";
import { publicClient } from "../lib/viem";

type GetBalanceType = {
  address: `0x${string}`;
  tokenAddress: `0x${string}`;
};

const useBalance = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getBalance = async ({
    tokenAddress,
    address
  }: GetBalanceType) => {
    setIsLoading(true);
    if (!address || !tokenAddress) {
      setIsLoading(false);
      return Promise.reject("Invalid function parameters.");
    }

    console.log("tokenAddress", tokenAddress);
    console.log("address", tokenAddress);
    console.log("address", address);
    const tokenBalance = await publicClient.readContract({
      address: tokenAddress,
      abi: erc20ABI,
      functionName: "balanceOf",
      args: [address as `0x${string}`],
    });

    const ethBalance = await publicClient.getBalance({ address })

    setIsLoading(false);
    return { tokenBalance, ethBalance };
  };

  return { getBalance, isLoading };
};

export default useBalance;
