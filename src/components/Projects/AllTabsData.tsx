import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import ConnectWallet from '../connectWallet';
import { Button } from '../ui/button';
import { Transfer } from './Transfer/Transfer';
import { Sell } from './Sell/Sell';
import { BuyPage } from './Buy/page';
import { GrTest } from "react-icons/gr";
import useBalance from "../../hooks/useBalance";

interface AllTabsDataProps {
    selectedTab: string;
    projectData: {
        beneficiaryDetails: {
            wallets: Wallet[];
        };
    };
}
interface Wallet {
    address: string;
    amount: string;
    ethBalance: string;
    tokenBalance: string;
    privateKey: string;
    tokensToBuy: string;
    additionalEth: string;
}

type BalanceType = {
    ethBalance: bigint;
    tokenBalance: bigint;
}

export const AllTabsData: React.FC<AllTabsDataProps> = ({ selectedTab, projectData }) => {
    const wallets: Wallet[] = useMemo(() => (projectData.beneficiaryDetails.wallets.slice(0, 2).map((wallet, index) => ({
        ...wallet,
        ethBalance: wallet.ethBalance || "0",
        tokenBalance: wallet.tokenBalance || "0"
    }))), [projectData.beneficiaryDetails.wallets]);

    console.log("wallets===>", wallets);

    const { getBalance, isLoading } = useBalance();
    const [balances, setBalances] = useState<BalanceType[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const results = await Promise.all(wallets.map(value => getBalance({ address: value.address as `0x${string}`, tokenAddress: "0xBd2E04Be415ec7517Cb8D110255923D2652Cbb79" })));
                setBalances(results);
            } catch (error) {
                console.error("Error fetching balances:", error);
            }
        };

        fetchData();
    }, [wallets]);

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

            {selectedTab === "Buy" && <BuyPage projectData={projectData} wallets={wallets} balances={balances} />}
            {selectedTab === "Sell" && <Sell />}
            {selectedTab === "Transfer" && <Transfer />}

            <p className='border-b-[1px] border-[#27272A] mt-4 mb-4'></p>
            <div className='flex gap-2 justify-end items-center'>
                <Button className="bg-[#09090B] border-none text-[#F57C00] text-[12px] font-normal">
                    Collect All ETH
                </Button>
                {selectedTab === "Buy" &&
                    <button
                        className="bg-[#27272A] hover:bg-[#F57C00] cursor-pointer px-4 py-2 text-[12px] flex gap-2 items-center justify-center rounded-md text-[#000000] text-sm font-bold leading-6 tracking-[0.032px]"
                        disabled={true}
                    >
                        <GrTest className='text-black h-[18px] w-[18px]' />
                        <p>Simulate</p>
                    </button>
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
