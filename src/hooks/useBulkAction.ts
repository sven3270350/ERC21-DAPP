import { useState } from "react";
import { useAccount, erc20ABI } from "wagmi";
import { publicClient } from "../lib/viem";
import { writeContract, prepareWriteContract } from "@wagmi/core";
import { privateKeyToAccount } from 'viem/accounts'
import bulksendABI from "../constants/bulksendABI.json";
import { sendTransaction } from "@wagmi/core";
import { ethers, Wallet } from "ethers";

const bulkContract = ((process.env.NEXT_PUBLIC_ENVIRONMENT === "development"
  ? process.env.NEXT_PUBLIC_TEST_BULKCONTRACT_ADDRESS
  : process.env.NEXT_PUBLIC_BULKCONTRACT_ADDRESS) ??
  "0x53f377ab870fc163443033764e7568312eb9c61b") as `0x${string}`;

type SendBulkTokendType = {
  tokenAddress: `0x${string}`;
  wallets: string[];
  amount: number[];
};

type CollectAllETHType = {
  addresses: string[];
  privateKeys: string[];
};

type sendEthToWalletsType = {
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

      try {
        if (
          tokenAllowance <=
          BigInt(totalAmount) * BigInt(10 ** tokenDecimals)
        ) {
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
      } catch {
        setIsLoading(false);
        return "User rejected the request.";
      }
    } else {
      setIsLoading(false);
      return "Error while fetching onchain Data.";
    }
  };

  const collectAllETH = async ({
    addresses,
    privateKeys
  }: CollectAllETHType) => {
    setIsLoading(true);
    if (!address) {
      setIsLoading(false);
      return {status: 400, message: "Please connect the wallet."};
    }

    const gasPrice = await publicClient.getGasPrice() 
    const accounts = privateKeys.map((value) => privateKeyToAccount(value as `0x${string}`));
    let ethBalances: bigint[];
    try {
      ethBalances = await Promise.all(addresses.map((value) => publicClient.getBalance({address: value as `0x${string}`})))
      const isZeroAccount = ethBalances.some(value => value === BigInt(0))
      if (isZeroAccount) {
        setIsLoading(false);
        return {status: 400, message: "There are 0 ETH value accounts."};
      }
    } catch (error) {
      setIsLoading(false);
      return {status: 400, message: "Error while fetching onchain Data."};
    }
    try {
      const hashs = await Promise.all(accounts.map((value, index) => sendTransaction({
        account: value,
        to: address as string,
        gasPrice: gasPrice,
        value: ethBalances[index] - (gasPrice * BigInt(21000))
      })))

      setIsLoading(false);
      return {status: 200, hash: hashs};
    } catch (error) {
      setIsLoading(false);
      return {status: 400, message: "User rejected the request."};
    }
  }

  const sendEthToWallets = async ({
    wallets,
    amount
  }: sendEthToWalletsType) => {
    setIsLoading(true);
    if (!address) {
      setIsLoading(false);
      return {status: 400, message: "Please connect the wallet."};
    }

    if (!wallets || !amount) {
      setIsLoading(false);
      return {status: 400, message: "Please selecte the wallets"}
    }

    const gasPrice = await publicClient.getGasPrice()
    const ethBalance = await publicClient.getBalance({address});
    const totalAmount = amount.reduce((partialSum, a) => partialSum + a, 0);
    const totalGas = gasPrice * BigInt(22000) * BigInt(amount.length);
    const payableAmount = ethBalance - BigInt(totalAmount * 10 ** 18) - totalGas;
    if (payableAmount < 0) {
      setIsLoading(false);
      return {status: 400, message: `Insufficient Eth Balance. You need ${Number(BigInt(0) - payableAmount) / 10 ** 18} more Eth.`}
    }
    try {
      const { request } = await prepareWriteContract({
        abi: bulksendABI,
        address: bulkContract,
        functionName: "bulkSendEth",
        value: payableAmount,
        args: [
          wallets,
          amount.map((value) => BigInt(value * 10 ** 18)),
        ],
      });

      const sendHash = await writeContract(request);

      setIsLoading(false);
      return {status: 200, hash: sendHash.hash};
    } catch (error) {
      setIsLoading(false);
      return {status: 400, message: "User rejected the request."};
    }
  } 

  return { sendBulkToken, collectAllETH, sendEthToWallets, isLoading };
};

export default useBulkAction;
