import React, { useState } from 'react';
import { Button } from '../ui/button';
import Image from 'next/image';
import { Input } from '../ui/input';

export const CreateWallet = () => {
    const [showFundingWalletContent, setShowFundingWalletContent] = useState(false);
    const [showControlWalletContent, setShowControlWalletContent] = useState(false);

    const handleFundingWalletButtonClick = () => {
        setShowFundingWalletContent(true);
    };

    const handleControlWalletButtonClick = () => {
        setShowControlWalletContent(true);
    };

    return (
        <div className="mb-4">
                <h2 className="text-xl font-semibold text-white text-center mb-2">Create Funding and Control Wallet</h2>
                <p className="text-[#71717A] text-sm font-medium text-center mb-4">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam</p>
                <div className='flex gap-4'>
                    <div className='border-dashed border-[1px] border-[#27272A] px-6 py-4 w-[320px]'>
                        <h2 className="text-xl font-semibold text-white text-center mb-2">Funding Wallet</h2>
                        <p className="text-[#71717A] text-sm font-medium text-center mb-16">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam</p>
                        {!showFundingWalletContent && (
                            <Button className="bg-black text-[#F57C00] text-base font-semibold flex gap-2 w-[280px] border-[1px] border-[#F57C00]" onClick={handleFundingWalletButtonClick}>
                                <Image
                                    src={"./Images/New Project/add-01.svg"}
                                    width={14}
                                    height={14}
                                    alt="logo"
                                />
                                Create
                            </Button>
                        )}
                        {showFundingWalletContent && (
                            <div>
                                <div className='mb-4'>
                                    <h2 className="text-base font-semibold text-white text-center mb-2">Public Key</h2>
                                    <div>
                                        <p className="text-[#71717A] text-xs font-medium text-start">afdfd9c3d2095ef6 96594f6cedcae59 e72dcd697e2a7521b1578140422a4f890 {" "}</p>
                                        <div className='flex gap-2 '>
                                            <Image
                                                src={"./Images/New Project/copy-01.svg"}
                                                width={16}
                                                height={16}
                                                alt="logo"
                                                className='cursor-pointer'
                                            />
                                            <Image
                                                src={"./Images/New Project/download-02.svg"}
                                                width={16}
                                                height={16}
                                                alt="logo"
                                                className='cursor-pointer'
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='mb-4'>
                                    <h2 className="text-base font-semibold text-white text-center mb-2">Private Key</h2>
                                    <div>
                                        <Input type='password' className='bg-[#09090B] border-0' placeholder='******************************************' />
                                        <div className='flex gap-2 '>
                                            <Image
                                                src={"./Images/New Project/copy-01.svg"}
                                                width={16}
                                                height={16}
                                                alt="logo"
                                                className='cursor-pointer'
                                            />
                                            <Image
                                                src={"./Images/New Project/download-02.svg"}
                                                width={16}
                                                height={16}
                                                alt="logo"
                                                className='cursor-pointer'
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='border-dashed border-[1px] border-[#27272A] px-6 py-4 text-center w-[320px]'>
                        <h2 className="text-xl font-semibold text-white  mb-2">Control Wallet</h2>
                        <p className="text-[#71717A] text-sm font-medium text-center mb-16">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam</p>
                        {!showControlWalletContent && (
                            <Button className="bg-black text-[#F57C00] text-base font-semibold flex gap-2 w-[280px] border-[1px] border-[#F57C00]" onClick={handleControlWalletButtonClick}>
                                <Image
                                    src={"./Images/New Project/add-01.svg"}
                                    width={14}
                                    height={14}
                                    alt="logo"
                                />
                                Create
                            </Button>
                        )}
                        {showControlWalletContent && (
                            <div>
                                <div className='mb-4'>
                                    <h2 className="text-base font-semibold text-white text-center mb-2">Public Key</h2>
                                    <div>
                                        <p className="text-[#71717A] text-xs font-medium text-start">afdfd9c3d2095ef6 96594f6cedcae59 e72dcd697e2a7521b1578140422a4f890 {" "}</p>
                                        <div className='flex gap-2 '>
                                            <Image
                                                src={"./Images/New Project/copy-01.svg"}
                                                width={16}
                                                height={16}
                                                alt="logo"
                                                className='cursor-pointer'
                                            />
                                            <Image
                                                src={"./Images/New Project/download-02.svg"}
                                                width={16}
                                                height={16}
                                                alt="logo"
                                                className='cursor-pointer'
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='mb-4'>
                                    <h2 className="text-base font-semibold text-white text-center mb-2">Private Key</h2>
                                    <div>
                                    <Input type='password' className='bg-[#09090B] border-0' placeholder='******************************************' />
                                        <div className='flex gap-2 '>
                                            <Image
                                                src={"./Images/New Project/copy-01.svg"}
                                                width={16}
                                                height={16}
                                                alt="logo"
                                                className='cursor-pointer'
                                            />
                                            <Image
                                                src={"./Images/New Project/download-02.svg"}
                                                width={16}
                                                height={16}
                                                alt="logo"
                                                className='cursor-pointer'
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
        </div>
    );
};
