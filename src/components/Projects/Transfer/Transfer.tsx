import React from 'react'
import ConnectWallet from '../../connectWallet'
import { Button } from '../../ui/button'
import Image from 'next/image'
import { TransferTable } from './TransferTable'

export const Transfer = () => {
    const headerData:any = [
        "#",
        "ADDRESS",
        "ETH BALANCE",
        "TOKEN BALANCE",
        "ADDRESS TO TRANSFER",
        "TOKEN",
    ]

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
            </div>
             <TransferTable headerData={headerData} />
            <p className='border-b-[1px] border-[#27272A] mt-4 mb-4'>
            </p>
            <div className='flex justify-end items-center'>
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
                    <p>Transfer</p>
                </button>
            </div>
        </div>
    )
}
