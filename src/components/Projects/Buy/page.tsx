import React, { useState, ChangeEvent } from 'react';
import { Button } from '../../ui/button';
import ConnectWallet from '../../connectWallet';
import Image from 'next/image';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import styles from '../../newproject/checkbox.module.css';

interface Wallet {
    address: string;
    amount: string;
    ethBalance: string;
    tokenBalance: string;
}

interface BuyPageProps {
    projectData: {
        beneficiaryDetails: {
            wallets: Wallet[];
        };
    };
}

export const BuyPage: React.FC<BuyPageProps> = ({ projectData }) => {
    const wallets: Wallet[] = projectData.beneficiaryDetails.wallets.map((wallet, index) => ({
        ...wallet,
        ethBalance: wallet.ethBalance || "0",
        tokenBalance: wallet.tokenBalance || "0"
    }));
    console.log("projectData===>", projectData);

    const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);

    const handleSelectAll = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelectedInvoices(wallets.map(wallet => wallet.address));
        } else {
            setSelectedInvoices([]);
        }
    };

    const handleSelectOne = (event: ChangeEvent<HTMLInputElement>, walletAddress: string) => {
        if (event.target.checked) {
            setSelectedInvoices(prev => [...prev, walletAddress]);
        } else {
            setSelectedInvoices(prev => prev.filter(address => address !== walletAddress));
        }
    };

    const isSelected = (walletAddress: string) => selectedInvoices.includes(walletAddress);

    return (
        <div>
            <div>
                <Table className='border-[1px] border-[#18181B] rounded-md'>
                    <TableHeader className='bg-[#18181B]'>
                        <TableRow className='hover:bg-inherit border-none'>
                            <TableHead>
                                <input
                                    type="checkbox"
                                    className={styles.checkbox}
                                    onChange={handleSelectAll}
                                    checked={selectedInvoices.length === wallets.length}
                                />
                            </TableHead>
                            <TableHead className='text-[12px] text-center'>#</TableHead>
                            <TableHead className='text-[12px] text-center'>ADDRESS</TableHead>
                            <TableHead className='text-[12px] text-center'>ETH BALANCE</TableHead>
                            <TableHead className='text-[12px] text-center'>TOKEN BALANCE</TableHead>
                            <TableHead className='text-[12px] text-center'>TOKENS TO BUY</TableHead>
                            <TableHead className='text-[12px] text-center'>ADDITIONAL ETH</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {wallets.map((wallet, index) => (
                            <TableRow key={wallet.address} className={`hover:bg-inherit py-0 border-none ${index % 2 === 1 ? 'bg-[#18181B]' : ''}`}>
                                <TableCell className='py-0'>
                                    <input
                                        type="checkbox"
                                        className={styles.checkbox}
                                        checked={isSelected(wallet.address)}
                                        onChange={(event) => handleSelectOne(event, wallet.address)}
                                    />
                                </TableCell>
                                <TableCell className='text-[#A1A1AA] text-[12px]'>{index + 1}</TableCell>
                                <TableCell className='py-0'>
                                    <div className='text-[#71717A] flex gap-1 items-center text-[12px]'>
                                        {wallet.address}
                                        <Image
                                            src={"/copy-01.svg"}
                                            width={15}
                                            height={15}
                                            alt="Copy"
                                        />
                                    </div>
                                </TableCell>
                                <TableCell className='py-0'>
                                    <div className='text-[#F57C00] flex gap-1 items-center text-[12px]'>
                                        <Image
                                            src={"/Vector.svg"}
                                            width={15}
                                            height={15}
                                            alt="ETH"
                                        />
                                        {wallet?.ethBalance}
                                    </div>
                                </TableCell>
                                <TableCell className='py-0'>
                                    <div className='text-[#A1A1AA] flex gap-1 items-center text-[12px]'>
                                        <Image
                                            src={"/coins-01.svg"}
                                            width={15}
                                            height={15}
                                            alt="Token"
                                        />
                                        {wallet?.tokenBalance}
                                    </div>
                                </TableCell>
                                <TableCell className='w-[200px] py-0'>
                                    <Input
                                        className="bg-[#18181B] h-8 border-[#27272A] mt-2 text-white text-center text-[12px]"
                                        placeholder="Amount"
                                        type="text"
                                        required
                                    />
                                </TableCell>
                                <TableCell className='w-[200px] py-0'>
                                    <Input
                                        className="bg-[#18181B] h-8 border-[#27272A] mt-2 text-white text-center text-[12px]"
                                        placeholder="Amount"
                                        type="number"
                                        required
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
