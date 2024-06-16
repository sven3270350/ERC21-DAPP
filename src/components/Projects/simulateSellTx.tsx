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
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import ClipLoader from "react-spinners/ClipLoader";
import { Transaction } from "./simulateBuyTx";

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
  onWalletsUpdate: (selectedWallets: Wallet[]) => void;
  onTransactionsUpdate: (transactions: Transaction[]) => void;
}

export const SimulateSellTx = ({
  projectData,
  selectedWallets,
  onWalletsUpdate,
  onTransactionsUpdate,
}: SimulateTxProps) => {
  const { address } = useAccount();

  const [isSimulating, setIsSimulating] = useState(false);
  const sellWallets: Wallet[] = selectedWallets;

  const handleSimulation = async () => {
    console.log(sellWallets);
    if (sellWallets?.length != 0) {
      setIsSimulating(true);
      const transactionSequence: Transaction[] = [];
      const ethTransferTransactions = getEthTransferTxSequence();
      transactionSequence.push(...ethTransferTransactions);
      const approveTx = getApproveTx();
      transactionSequence.push(...approveTx!);
      const sellTx = getSellTx();
      transactionSequence.push(...sellTx!);

      try {
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
            return;
          }
        }

        for (
          let i = 0, j = sellWallets?.length! * 2;
          i < sellWallets?.length!;
          i++, j++
        ) {
          const assetChanges =
            simulationData[j].transaction.transaction_info.asset_changes;
          const gainedETH = assetChanges[assetChanges.length - 1];
          sellWallets[i].ethEstimated! = gainedETH.amount;
        }

        toast("Simulation Success: You can proceed with Sell");
        onTransactionsUpdate(transactionSequence);
        onWalletsUpdate(sellWallets);
        setIsSimulating(false);
      } catch (error) {
        console.log(error);
        setIsSimulating(false);
      }
    } else {
      toast("Please Select a Wallet");
    }
  };

  const getEthTransferTxSequence = () => {
    const ethTransferTransactions: Transaction[] = [];
    for (let i = 0; i < sellWallets.length; i++) {
      const ethValue = parseFloat(formatUnits(BigInt("10000000"), 9));
      const tx: Transaction = {
        from: address!,
        to: sellWallets[i].address as `0x${string}`,
        value: parseUnits(ethValue.toString(), 18).toString(),
      };
      ethTransferTransactions.push(tx);
    }

    return ethTransferTransactions;
  };

  const getApproveTx = () => {
    try {
      const tokenAddress = projectData.deployedTokenAddress.contractAddress;
      const tokenInterface = new Interface(abi);
      const approveTranscations: Transaction[] = [];
      for (let i = 0; i < sellWallets?.length!; i++) {
        const tx: Transaction = {
          from: sellWallets[i].address as `0x${string}`,
          to: tokenAddress,
          input: tokenInterface.encodeFunctionData("approve", [
            uniswapV2RouterAddress,
            parseUnits(sellWallets[i].tokenToSell!, 18),
          ]),
        };
        approveTranscations.push(tx);
      }

      return approveTranscations;
    } catch (error) {
      console.log(error);
    }
  };

  const getSellTx = () => {
    try {
      const tokenAddress = projectData.deployedTokenAddress.contractAddress;
      const uniswapRouterInterface = new Interface(uniswapRouterABI);
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now
      const sellTranscations: Transaction[] = [];
      for (let i = 0; i < sellWallets?.length!; i++) {
        const tx: Transaction = {
          from: sellWallets[i].address as `0x${string}`,
          to: uniswapV2RouterAddress as `0x${string}`,
          input: uniswapRouterInterface.encodeFunctionData(
            "swapExactTokensForETH",
            [
              parseUnits(sellWallets[i].tokenToSell!, 18),
              "0",
              [tokenAddress, wethAddress],
              sellWallets[i].address,
              deadline,
            ]
          ),
        };
        sellTranscations.push(tx);
      }

      return sellTranscations;
    } catch (error) {
      console.log(error);
    }
  };

  const simulate = async (transactionSequence: any[]) => {
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
