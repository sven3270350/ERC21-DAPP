import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import ConnectWallet from "../connectWallet";
import { Button } from "../ui/button";
import { Transfer } from "./Transfer/Transfer";
import { Sell } from "./Sell/Sell";
import { BuyPage } from "./Buy/page";
import { GrTest } from "react-icons/gr";
import { SimulateBuyTx } from "./simulateBuyTx";
import { SimulateSellTx } from "./simulateSellTx";
import useBalance from "../../hooks/useBalance";
import { Wallet } from "@/types/wallet";
import { SellBundle } from "./bundleTx/bundle-sell";
import useBulkAction from "../../hooks/useBulkAction"
import { Transaction } from "./simulateBuyTx";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import { publicClient } from '@/lib/viem'

interface AllTabsDataProps {
  selectedTab: string;
  projectData: {
    bundleWallet: any
    beneficiaryDetails: Wallet[];
    deployedTokenAddress: {
      contractAddress: `0x${string}`;
      pairAddress: `0x${string}`;
    };
  };
}

type BalanceType = {
  ethBalance: bigint;
  tokenBalance: bigint;
};

export const AllTabsData: React.FC<AllTabsDataProps> = ({
  selectedTab,
  projectData,
}) => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [txStatus, setTxStatus] = useState<string>();
  const { sendEthToWallets, isLoading: bulkLoading  } = useBulkAction();

  // Initialize wallets with default values
  useMemo(() => {
    setWallets(
      projectData.beneficiaryDetails.map((wallet) => ({
        ...wallet,
        ethBalance: wallet?.ethBalance ?? "0",
        tokenBalance: wallet?.tokenBalance ?? "0",
        estimate: wallet?.estimate || "0",
      }))
    );
  }, [projectData.beneficiaryDetails]);

  const { getBalance, isLoading } = useBalance();
  const [balances, setBalances] = useState<BalanceType[]>([]);
  const [selectedWallets, setSelectedWallets] = useState<Wallet[]>([]);
  const [sellTransactions, setSellTransactions] = useState<Transaction[]>();
  const [isBundling, setIsBundling] = useState(false);
  const [isCollecting, setIsCollecting] = useState(false);

  const { address } = useAccount();

  const handleUpdateAdditionalEthAmount = (updatedWallets: Wallet[]) => {
    setWallets((prevWallets) =>
      prevWallets.map((wallet) => {
        const updatedWallet = updatedWallets.find(
          (u) => u.address === wallet.address
        );
        return updatedWallet
          ? { ...wallet, additionalEth: updatedWallet.additionalEth }
          : wallet;
      })
    );
  };

  const handleUpdateEstimatedEthAmount = (updatedWallets: Wallet[]) => {
    setWallets((prevWallets) =>
      prevWallets.map((wallet) => {
        const updatedWallet = updatedWallets.find(
          (u) => u.address === wallet.address
        );
        return updatedWallet
          ? { ...wallet, ethEstimated: updatedWallet.ethEstimated }
          : wallet;
      })
    );
  };

  const getTxStatus = async (hash: string) => {
    const txStatus = await publicClient.getTransactionReceipt({ 
      hash: hash as `0x${string}`
    })
    if (txStatus.status === "success") {
      setTxStatus(txStatus.blockHash);
    }
    return txStatus.status;
  }

  const handleFundEthToWallets = async () => {
    if (selectedWallets.length === 0) {
      toast("Please selecte beneficary wallets.");
      return
    }
    if (selectedWallets.some(value => value.additionalEth === "")) {
      toast("Please do simulatoin before sending ETH.");
      return
    }
    const result = await sendEthToWallets({ wallets: selectedWallets.map(value => value.address), amount: selectedWallets.map(value => Number(value.additionalEth)) })
    if (result.status === 200) {
      toast(`Transaction Hash: ${result.hash}`)
      setTimeout(async () => {
        await getTxStatus(result.hash as string)
      }, 10000);
    } else {
      toast(result.message)
    }
  }


  useEffect(() => {
    const fetchData = async () => {
      const batchSize = 7;
      const delayBetweenBatches = 2000;

      let currentIndex = 0;
      const totalWallets = wallets.length;
      const balances = [];

      while (currentIndex < totalWallets) {
        const batch = wallets.slice(currentIndex, currentIndex + batchSize);
        try {
          const results = await Promise.all(
            batch.map((value) =>
              getBalance({
                address: value.address as `0x${string}`,
                tokenAddress:
                  projectData?.deployedTokenAddress?.contractAddress,
              })
            )
          );
          balances.push(...results);
          setBalances(balances);
        } catch (error) {
          console.error("Error fetching balances:", error);
        }

        currentIndex += batchSize;

        if (currentIndex < totalWallets) {
          await new Promise((resolve) =>
            setTimeout(resolve, delayBetweenBatches)
          );
        }
      }
    };

    fetchData();
  }, [wallets, projectData?.deployedTokenAddress?.contractAddress, txStatus]);

  const handleCollectAllETH = async () => {
    if (selectedWallets.length != 0) {
      setIsCollecting(true);
      const minimalWalletData = selectedWallets.map((wallet) => ({
        address: wallet.address,
        privateKey: wallet.privateKey,
        ethBalance: wallet.ethBalance,
        tokenBalance: wallet.tokenBalance,
      }));

      try {
        const response = await axios.post("/api/bundle/collecteth", {
          wallets: minimalWalletData,
          connectedWallet: address,
        });
        console.log(response);
        if (response.data.success) {
          toast("Collect is successful");
        } else {
          toast("Collect Failed");
        }

        setIsCollecting(false);
      } catch (error) {
        console.log(error);
        setIsCollecting(false);
      }
    } else {
      toast("Please Select a Wallet");
    }
  };

  const handleSelectionChange = (selectedWallets: Wallet[]) => {
    setSelectedWallets(selectedWallets);
  };

  const handleSellTransactionChange = (transactions: Transaction[]) => {
    setSellTransactions(transactions);
  };

  const TabButton = () => {
    switch (selectedTab) {
      case "Buy":
        return "Enable & Buy";
      case "Sell":
        return "Sell";
      case "Transfer":
        return "Transfer";
      default:
        return "Action";
    }
  };
  
  const handleBundleTx = async () => {
    setIsBundling(true);
    if (selectedTab === "Sell") {
      const response = await axios.post("/api/bundle/sell", {
        wallets: selectedWallets,
        sellTransactions: sellTransactions?.slice(selectedWallets.length),
      });
      console.log(response);
      if (response.data.success) {
        toast("Sell is successful");
      } else {
        toast("Sell Failed");
      }
    }

    if (selectedTab === "Buy") {
      // temporary bundle wallet pKey @Dang to update 
      const response = await axios.post("/api/bundle/buy", {
        privateKey: projectData?.bundleWallet.privateKey,
        tokenAddress: projectData?.deployedTokenAddress?.contractAddress.toString(),
        wallets: selectedWallets as Wallet[],
      });
      console.log(response);
      if (response.data.success) {
        toast("Buy Transaction Successful!");
      } else {
        toast("Buy Failed: ", response.data);
      }
    }

    setIsBundling(false);
  };

  return (
    <div className="border-[1px] border-[#18181B] p-4 rounded-sm">
      <ConnectWallet />
      <p className="border-b-[1px] border-[#27272A]"></p>

      {selectedTab === "Buy" && (
        <BuyPage
          wallets={wallets}
          balances={balances}
          onSelectionChange={handleSelectionChange}
        />
      )}
      {selectedTab === "Sell" && (
        <Sell
          wallets={wallets}
          balances={balances}
          onSelectionChange={handleSelectionChange}
        />
      )}
      {selectedTab === "Transfer" && (
        <Transfer
          wallets={wallets}
          balances={balances}
          onSelectionChange={handleSelectionChange}
        />
      )}

      <p className="border-b-[1px] border-[#27272A] mt-4 mb-4"></p>
      <div className="flex gap-2 justify-end items-center">
        {isCollecting ? (
          <ClipLoader color="#fff" className="color-[black]" size="16px" />
        ) : (
          <Button
            className="bg-[#09090B] border-none text-[#F57C00] text-[12px] font-normal"
            onClick={handleCollectAllETH}
          >
            Collect All ETH
          </Button>
        )}
        {selectedTab === "Buy" ? (
          <SimulateBuyTx
            projectData={projectData}
            selectedWallets={selectedWallets}
            onWalletUpdate={handleUpdateAdditionalEthAmount}
          />
        ) : (
          selectedTab === "Sell" && (
            <SimulateSellTx
              projectData={projectData}
              selectedWallets={selectedWallets}
              onWalletsUpdate={handleUpdateEstimatedEthAmount}
              onTransactionsUpdate={handleSellTransactionChange}
            />
          )
        )}

        {selectedTab === "Buy" && <button
          onClick={handleFundEthToWallets}
          disabled={bulkLoading}
          className="bg-[#27272A] hover:bg-[#F57C00] px-4 py-2 text-[12px] flex gap-2 items-center justify-center rounded-md text-[#000000] text-sm font-bold leading-6 tracking-[0.032px]"
        >
          <p>Fund Eth</p>
          {bulkLoading && (
            <ClipLoader color="#fff" className="color-[black]" size="16px" />
          )}
        </button>}

        <button
          onClick={handleBundleTx}
          disabled={isBundling}
          className="bg-[#27272A] hover:bg-[#F57C00] px-4 py-2 text-[12px] flex gap-2 items-center justify-center rounded-md text-[#000000] text-sm font-bold leading-6 tracking-[0.032px]"
        >
          <p>{TabButton()}</p>
          {isBundling && (
            <ClipLoader color="#fff" className="color-[black]" size="16px" />
          )}
        </button>
      </div>
    </div>
  );
};
