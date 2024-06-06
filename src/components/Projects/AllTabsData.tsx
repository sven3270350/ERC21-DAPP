import React from 'react';
import Image from 'next/image';
import ConnectWallet from '../connectWallet';
import { Button } from '../ui/button';
import { Transfer } from './Transfer/Transfer';
import { Sell } from './Sell/Sell';

interface AllTabsDataProps {
    selectedTab: string;
}

export const AllTabsData: React.FC<AllTabsDataProps> = ({ selectedTab }) => {
    const TabButton = () => {
        switch (selectedTab) {
            case 'Buy':
                return 'Buy';
            case 'Sell':
                return 'Sell';
            case 'Transfer':
                return 'Transfer';
            default:
                return 'Action';
        }
    };

    return (
        <div className='border-[1px] border-[#18181B] p-4 rounded-sm '>
            <ConnectWallet />
            <p className='border-b-[1px] border-[#27272A]'>
            </p>
            <div className='flex justify-between mt-5 mb-5'>
                <div className='gap-4 flex'>
                    <p className='text-[#71717A] text-sm font-medium mb-2 flex gap-2 items-center'>Selected: <span className='text-white'>0</span></p>
                    <p className='text-[#71717A] text-sm font-medium mb-2 flex gap-2 items-center'>Token balance: <span className='text-white'>0.96</span></p>
                </div>
                <div className='gap-4 flex'>
                    <Button className="bg-[#09090B] border-none text-[#F57C00] text-sm font-normal" >
                        <Image
                            src={"/Images/New Project/download-02.svg"}
                            width={18}
                            height={18}
                            alt="logo"
                            className="cursor-pointer m-auto mr-1"
                        />
                        Download wallets
                    </Button>
                    {selectedTab !== 'Transfer' && (
                        <Button className="bg-[#09090B] border-none text-[#F57C00] text-sm font-normal" >
                            <Image
                                src={"/Images/New Project/add-01.svg"}
                                width={18}
                                height={18}
                                alt="logo"
                                className="cursor-pointer m-auto mr-1"
                            />
                            Generate Wallet
                        </Button>
                    )}
                </div>
            </div>

            {selectedTab === "Buy" && "BuyTab"}
            {selectedTab === "Sell" && <Sell />}
            {selectedTab === "Transfer" && <Transfer />}

            <p className='border-b-[1px] border-[#27272A] mt-4 mb-4'>
            </p>
            <div className='flex gap-2 justify-end items-center'>
                <Button className="bg-[#09090B] border-none text-[#F57C00] text-[12px] font-normal" >
                    <Image
                        src={"/ethereum.svg"}
                        width={18}
                        height={18}
                        alt="logo"
                        className="cursor-pointer m-auto mr-1"
                    />
                    Collect All ETH
                </Button>
                <button
                    className="bg-[#F57C00] px-4 py-2 text-[12px] flex gap-2 items-center justify-center rounded-md text-[#000000] text-sm font-bold leading-6 tracking-[0.032px]"
                >
                    <Image
                        src={"/arrow-data-transfer.svg"}
                        width={18}
                        height={18}
                        alt="logo"
                        className="cursor-pointer m-auto mr-1"
                    />
                    <p>{TabButton()}</p>
                </button>
            </div>
        </div>
    )
}
