import React, { useState, ChangeEvent, useEffect } from 'react';
import Image from 'next/image';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import useBalance from "../../../hooks/useBalance";
import styles from '../../newproject/checkbox.module.css';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface Wallet {
    address: string;
    amount: string;
    ethBalance: string;
    tokenBalance: string;
    privateKey: string;
}

interface TransferPageProps {
    projectData: {
        beneficiaryDetails: {
            wallets: Wallet[];
        };
    };
}

type BalanceType = {
    ehtBalance: BigInt;
    tokenBalance: BigInt;
};

export const Transfer: React.FC<TransferPageProps> = ({ projectData }) => {
    const wallets: Wallet[] = projectData.beneficiaryDetails.wallets.map((wallet, index) => ({
        ...wallet,
        ethBalance: wallet.ethBalance || "0",
        tokenBalance: wallet.tokenBalance || "0",
    }));

    const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
    const [balances, setBalances] = useState<BalanceType[]>([]);
    const { getBalance, isLoading } = useBalance();

    const handleSelectAll = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelectedInvoices(wallets.map(wallet => wallet.address));
        } else {
            setSelectedInvoices([]);
        }
    };

    useEffect(() => {
        Promise.all(wallets.map((value) => getBalance({ address: value.address as `0x${string}`, tokenAddress: "0xBd2E04Be415ec7517Cb8D110255923D2652Cbb79" }))).then(result => console.log(result));
    }, []);

    const handleSelectOne = (event: ChangeEvent<HTMLInputElement>, walletAddress: string) => {
        if (event.target.checked) {
            setSelectedInvoices(prev => [...prev, walletAddress]);
        } else {
            setSelectedInvoices(prev => prev.filter(address => address !== walletAddress));
        }
    };

    const isSelected = (walletAddress: string) => selectedInvoices.includes(walletAddress);
    const handlePublicKeyCopy = (address: string, privateKey: string) => {
        const textToCopy = `${address} ${privateKey}`;
        navigator.clipboard.writeText(textToCopy);
        toast.info("Public Key and Private Key copied to clipboard");
    };
    return (
        <div>
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
                </div>
            </div>
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
                        <TableHead className='text-[12px] text-center'>ADDRESS TO TRANSFER</TableHead>
                        <TableHead className='text-[12px] text-center'>TOKEN</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {wallets.map((wallet, index) => (
                        <TableRow key={wallet.address} className={`hover:bg-inherit py-0 border-none text-center ${index % 2 === 1 ? 'bg-[#18181B]' : ''}`}>
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
                                    <p className='hidden'>{wallet.privateKey}</p>
                                    <Image
                                        src={"/copy-01.svg"}
                                        width={15}
                                        height={15}
                                        alt="Copy"
                                        onClick={() => handlePublicKeyCopy(wallet.address, wallet.privateKey)}
                                    />
                                </div>
                            </TableCell>
                            <TableCell className='py-0'>
                                <div className='text-[#F57C00] flex gap-1 items-center justify-center text-[12px]'>
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
                                <div className='text-[#A1A1AA] flex items-center justify-center text-[12px]'>
                                    <Image
                                        src={"/coins-01.svg"}
                                        width={15}
                                        height={15}
                                        alt="Token"
                                    />
                                    {wallet?.tokenBalance}
                                </div>
                            </TableCell>
                            <TableCell className='w-[250px] py-0'>
                                <Input
                                    className="bg-[#18181B] h-8 border-[#27272A] mt-2 text-white justify-center text-center text-[12px]"
                                    placeholder="Enter Address"
                                    type="number"
                                    required
                                />
                            </TableCell>
                            <TableCell className='w-[150px] py-0'>
                                <Input
                                    className="bg-[#18181B] h-8 border-[#27272A] mt-2 text-white justify-center text-center text-[12px]"
                                    placeholder="Amount"
                                    required
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
