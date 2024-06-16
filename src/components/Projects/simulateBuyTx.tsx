import { abi } from "@/constants/tokenABI.json";
import { useAccount } from "wagmi";
import { Address, readContract } from "@wagmi/core";
import { GrTest } from "react-icons/gr";
import {
  uniswapRouterABI,
  uniswapV2RouterAddress,
  wethAddress,
  uniswapV2PairABI,
} from "@/constants/routerABI.json";
import { formatUnits, parseUnits } from "viem";

import axios from "axios";
import { Interface, ethers } from "ethers";
import { Wallet } from "@/types/wallet";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { Button } from "../ui/button";

interface SimulateTxProps {
  projectData: {
    beneficiaryDetails: {
      wallets: Wallet[];
    };
    deployedTokenAddress: {
      contractAddress: `0x${string}`;
    };
    poolAddress: `0x${string}`;
  };
  selectedWallets: Wallet[];
  onWalletUpdate: (selectedWallets: Wallet[]) => void;
}

export interface Transaction {
  from: `0x${string}`;
  to: `0x${string}`;
  value?: string;
  input?: string;
}

export const SimulateBuyTx = ({
  projectData,
  selectedWallets,
  onWalletUpdate,
}: SimulateTxProps) => {
  console.log(selectedWallets);
  const { address } = useAccount();
  const [isSimulating, setIsSimulating] = useState(false);
  const buyWallets: Wallet[] = selectedWallets;
  console.log(buyWallets);
  const handleSimulation = async () => {
    if (buyWallets?.length != 0) {
      try {
        setIsSimulating(true);
        await fetchQuotes();
        const transactionSequence: Transaction[] = [];
        const ethTransferTransactions = getEthTransferTxSequence();
        transactionSequence.push(...ethTransferTransactions!);
        const setTradingManagerTransaction = await getTradingManagerTx();
        transactionSequence.push(setTradingManagerTransaction!);
        const enableTradingTransaction = getEnableTradingTx();
        transactionSequence.push(enableTradingTransaction!);
        const buyTx = getBuyTx();
        transactionSequence.push(...buyTx!);

        const simulationData = await simulate(transactionSequence);
        console.log(simulationData);
        for (let i = 0; i < simulationData.length; i++) {
          if (simulationData[i].transaction.status === false) {
            toast(
              "Simulation Failed: " +
                simulationData[i].transaction.error_message +
                "For: " +
                simulationData[i].transaction.from
            );
            setIsSimulating(false);
          }
        }

        toast("Simulation Success: You can proceed with Buy");
        onWalletUpdate(buyWallets!);
        setIsSimulating(false);
      } catch (error) {
        console.log(error);
        setIsSimulating(false);
      }
    } else {
      toast("Please Select a Wallet");
    }
  };

  const fetchQuotes = async () => {
    try {
      const pairAddress = projectData.poolAddress;
      console.log(pairAddress);
      const result = await readContract({
        abi: uniswapV2PairABI,
        address: pairAddress,
        functionName: "getReserves",
      });

      const reservesArray: any = result;

      let reserveEth = parseFloat(reservesArray[1]);
      let reserveToken = parseFloat(reservesArray[0]);

      for (let i = 0; i < buyWallets.length!; i++) {
        const amountToken = parseUnits(
          buyWallets[i].tokensToBuy!,
          18
        ).toString();
        const ethRequired = await getEthAmountForToken(
          reserveEth,
          reserveToken,
          amountToken
        );
        reserveEth += ethRequired!;
        reserveToken -= parseFloat(amountToken);
        const formattedValue = formatUnits(BigInt(ethRequired!), 18);

        buyWallets[i].requiredETH = formattedValue;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getEthAmountForToken = async (
    reserveEth: number,
    reserveToken: number,
    amountOut: string
  ) => {
    console.log(reserveEth);
    console.log(reserveToken);
    console.log(amountOut);
    try {
      const result = await readContract({
        abi: uniswapRouterABI,
        address: uniswapV2RouterAddress as Address,
        functionName: "getAmountIn",
        args: [amountOut, reserveEth.toString(), reserveToken.toString()],
      });
      const amounts: any = result;

      return parseFloat(amounts);
    } catch (error) {
      console.log(error);
    }
  };

  const getEthTransferTxSequence = () => {
    try {
      const ethTransferTransactions: Transaction[] = [];
      for (let i = 0; i < buyWallets.length; i++) {
        const ethValue =
          parseFloat(buyWallets[i].requiredETH!) +
          parseFloat(formatUnits(BigInt("12000000"), 9));
        buyWallets[i].additionalEth = ethValue.toString();
        const tx: Transaction = {
          from: address!,
          to: buyWallets[i].address as `0x${string}`,
          value: parseUnits(ethValue.toString(), 18).toString(),
        };
        ethTransferTransactions.push(tx);
      }

      return ethTransferTransactions;
    } catch (error) {
      console.log(error);
    }
  };

  const getTradingManagerTx = async () => {
    try {
      const tokenAddress = projectData.deployedTokenAddress.contractAddress;
      console.log(tokenAddress);
      const tokenInterface = new Interface(abi);

      const result = await readContract({
        abi,
        address: tokenAddress,
        functionName: "TRADING_MANAGER_ROLE",
      });

      const tx: Transaction = {
        from: address!,
        to: tokenAddress,
        input: tokenInterface.encodeFunctionData("grantRole", [
          result,
          address,
        ]),
      };

      return tx;
    } catch (error) {
      console.log(error);
    }
  };

  const getEnableTradingTx = () => {
    try {
      const tokenAddress = projectData.deployedTokenAddress.contractAddress;

      const tokenInterface = new Interface(abi);

      const tx: Transaction = {
        from: address!,
        to: tokenAddress,
        input: tokenInterface.encodeFunctionData("setEnableTrading", [true]),
      };

      return tx;
    } catch (error) {
      console.log(error);
    }
  };

  const getBuyTx = () => {
    try {
      const tokenAddress = projectData.deployedTokenAddress.contractAddress;
      const uniswapRouterInterface = new Interface(uniswapRouterABI);
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now
      const buyTranscations: Transaction[] = [];
      for (let i = 0; i < buyWallets.length; i++) {
        const amountETHMax: string = buyWallets[i].requiredETH!;
        const tx: Transaction = {
          from: buyWallets[i].address as `0x${string}`,
          to: uniswapV2RouterAddress as `0x${string}`,
          input: uniswapRouterInterface.encodeFunctionData(
            "swapETHForExactTokens",
            [
              parseUnits(buyWallets[i].tokensToBuy!, 18),
              [wethAddress, tokenAddress],
              buyWallets[i].address,
              deadline,
            ]
          ),
          value: parseUnits(amountETHMax, 18).toString(),
        };
        buyTranscations.push(tx);
      }

      return buyTranscations;
    } catch (error) {
      console.log(error);
    }
  };

  const simulate = async (transactionSequence: any[]) => {
    try {
      const simulationResponse = await axios.post(
        `https://api.tenderly.co/api/v1/account/kai010/project/erc21bot/simulate-bundle`,
        {
          simulations: transactionSequence.map((transaction) => ({
            network_id: "11155111", // network to simulate on
            save: true,
            save_if_fails: true,
            simulation_type: "full",
            ...transaction,
          })),
        },
        {
          headers: {
            "X-Access-Key": "EjuQ-40NZHjcBPrmM5TR-2YxjqKbb8QV",
          },
        }
      );

      return simulationResponse.data.simulation_results;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Button
        onClick={handleSimulation}
        className="bg-[#27272A] hover:bg-[#F57C00] cursor-pointer px-4 py-2 text-[12px] flex gap-2 items-center justify-center rounded-md text-[#000000] text-sm font-bold leading-6 tracking-[0.032px]"
        disabled={isSimulating}
      >
        <GrTest className="text-black h-[18px] w-[18px]" />
        <p>Simulate</p>
        {isSimulating && (
          <ClipLoader color="#fff" className="color-[black]" size="16px" />
        )}
      </Button>
    </div>
  );
};
