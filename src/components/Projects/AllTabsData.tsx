import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import ConnectWallet from '../connectWallet';
import { Button } from '../ui/button';
import { Transfer } from './Transfer/Transfer';
import { Sell } from './Sell/Sell';
import { BuyPage } from './Buy/page';
import { GrTest } from "react-icons/gr";
import { SimulateBuyTx } from './simulateBuyTx';
import { SimulateSellTx } from './simulateSellTx';
import useBalance from "../../hooks/useBalance";
import { Wallet } from '@/types/wallet';

interface AllTabsDataProps {
    selectedTab: string;
    projectData: {
        beneficiaryDetails: Wallet[];
        deployedTokenAddress: {
            contractAddress: `0x${string}`;
            pairAddress: `0x${string}`;
        }
    };
}


type BalanceType = {
    ethBalance: bigint;
    tokenBalance: bigint;
}

export const AllTabsData: React.FC<AllTabsDataProps> = ({ selectedTab, projectData }) => {
    const wallets: Wallet[] = useMemo(() => (projectData.beneficiaryDetails.map((wallet, index) => ({
        ...wallet,
        ethBalance: wallet?.ethBalance ?? "0",
        tokenBalance: wallet?.tokenBalance ?? "0",
        estimate: wallet?.estimate || "0"
    }))), [projectData.beneficiaryDetails]);

    const { getBalance, isLoading } = useBalance();
    const [balances, setBalances] = useState<BalanceType[]>([]);
    const [selectedWallets, setSelectedWallets] = useState<Wallet[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const batchSize = 5;
            const delayBetweenBatches = 2000;
    
            let currentIndex = 0;
            const totalWallets = wallets.length;
            const balances = [];
    
            while (currentIndex < totalWallets) {
                const batch = wallets.slice(currentIndex, currentIndex + batchSize);
                try {
                    const results = await Promise.all(batch.map(value => getBalance({ address: value.address as `0x${string}`, tokenAddress: projectData?.deployedTokenAddress?.contractAddress })));
                    balances.push(...results);
                    setBalances(balances);
                } catch (error) {
                    console.error("Error fetching balances:", error);
                }
    
                currentIndex += batchSize;
    
                if (currentIndex < totalWallets) {
                    await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
                }
            }
        };
    
        fetchData();
    }, [wallets, projectData?.deployedTokenAddress?.contractAddress]);

    const handleCollectAllETH = () => {
        const minimalWalletData = selectedWallets.map(wallet => ({
            address: wallet.address,
            privateKey: wallet.privateKey,
            ethBalance: wallet.ethBalance,
            tokenBalance: wallet.tokenBalance,
        }));
        console.log("Selected Wallets:", minimalWalletData);
    };

    const handleSelectionChange = (selectedWallets: Wallet[]) => {
        setSelectedWallets(selectedWallets);
       
    };

    const TabButton = () => {
        switch (selectedTab) {
            case 'Buy':
                return 'Enable & Buy';
            case 'Sell':
                return 'Sell';
            case 'Transfer':
                return 'Transfer';
            default:
                return 'Action';
        }
    };

    return (
        <div className='border-[1px] border-[#18181B] p-4 rounded-sm'>
            <ConnectWallet />
            <p className='border-b-[1px] border-[#27272A]'></p>

            {selectedTab === "Buy" && <BuyPage wallets={wallets} balances={balances} onSelectionChange={handleSelectionChange} />} 
            {selectedTab === "Sell" && <Sell wallets={wallets} balances={balances} onSelectionChange={handleSelectionChange}/>}
            {selectedTab === "Transfer" && <Transfer wallets={wallets} balances={balances} onSelectionChange={handleSelectionChange}/>}

            <p className='border-b-[1px] border-[#27272A] mt-4 mb-4'></p>
            <div className='flex gap-2 justify-end items-center'>
                <Button className="bg-[#09090B] border-none text-[#F57C00] text-[12px] font-normal" onClick={handleCollectAllETH}>
                    Collect All ETH
                </Button>
                {selectedTab === "Buy" ?
                  <SimulateBuyTx projectData={projectData} selectedWallets={selectedWallets} onSelectionChange={handleSelectionChange} />:
                  selectedTab === "Sell" && <SimulateSellTx projectData={projectData} selectedWallets={selectedWallets}/>
                }

                <button
                    className="bg-[#27272A] hover:bg-[#F57C00] px-4 py-2 text-[12px] flex gap-2 items-center justify-center rounded-md text-[#000000] text-sm font-bold leading-6 tracking-[0.032px]"
                >
                    <p>{TabButton()}</p>
                </button>
            </div>
        </div>
    );
};