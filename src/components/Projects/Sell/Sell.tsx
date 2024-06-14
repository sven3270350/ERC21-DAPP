import React, { useState, ChangeEvent } from 'react';
import Image from 'next/image';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import styles from '../../newproject/checkbox.module.css';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Wallet } from '@/types/wallet';


interface SellPageProps {
    wallets: Wallet[];
    balances: { ethBalance: bigint; tokenBalance: bigint; }[];
    onSelectionChange: (selectedWallets: Wallet[]) => void;
}

export const Sell: React.FC<SellPageProps> = ({ wallets, balances, onSelectionChange }) => {
    const [selectedWallet, setSelectedWallet] = useState<string[]>([]);
    const [initialWallets, setInitialWallets] = useState<Wallet[]>(wallets);

    const handleSelectAll = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelectedWallet(initialWallets.map(wallet => wallet.address));
            applyAmountsToAll();
            onSelectionChange(initialWallets)
        } else {
            setSelectedWallet([]);
            setInitialWallets(wallets);
            onSelectionChange([]);
        }
    };

    const applyAmountsToAll = () => {
        const firstWallet = initialWallets[0];
        setInitialWallets(prevWallets => prevWallets.map(wallet => ({
            ...wallet,
            tokenToSell: firstWallet.tokenToSell,
        })));
    };

    const handleTokenToSell = (event: ChangeEvent<HTMLInputElement>, index: number) => {
        const newWallets = [...initialWallets];
        newWallets[index].tokenToSell = event.target.value;
        setInitialWallets(newWallets);
    };

    const handleSelectOne = (event: ChangeEvent<HTMLInputElement>, walletAddress: string) => {
        if (event.target.checked) {
            const updatedSelection = [...selectedWallet, walletAddress];
            setSelectedWallet(updatedSelection);
            onSelectionChange(initialWallets.filter(wallet => updatedSelection.includes(wallet.address))); 
        } else {
            const updatedSelection = selectedWallet.filter(address => address !== walletAddress);
            setSelectedWallet(updatedSelection);
            onSelectionChange(initialWallets.filter(wallet => updatedSelection.includes(wallet.address))); 
        }
    };

    const isSelected = (walletAddress: string) => selectedWallet.includes(walletAddress);

    const handlePublicKeyCopy = (address: string, privateKey: string) => {
        const textToCopy = `${address} ${privateKey}`;
        navigator.clipboard.writeText(textToCopy);
        toast.info("Public Key and Private Key copied to clipboard");
    };

    const downloadCSV = (data: Wallet[], selectedWallets: string[]) => {
        const selectedData = data.filter(wallet => selectedWallets.includes(wallet.address));
        if (selectedData.length === 0) {
            toast("No wallets selected for download");
            return;
        }
        
        const csvRows = [];
        const headers = ["address", "privateKey", "ethBalance", "tokenBalance"];
        csvRows.push(headers.join(','));
    
        for (const row of selectedData) {
            const values = headers.map(header => row[header as keyof Wallet]);
            csvRows.push(values.join(','));
        }
    
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', 'selected_wallets.csv');
        a.click();
    };
    
    const handleDownloadCSV = () => {
        if (selectedWallet.length === initialWallets.length) {
        }
        downloadCSV(initialWallets, selectedWallet);
    };

    return (
        <div>
            <div className='flex justify-between mt-5 mb-5'>
                <div className='gap-4 flex'>
                    <p className='text-[#71717A] text-sm font-medium mb-2 flex gap-2 items-center'>Selected: <span className='text-white'>{selectedWallet.length}</span></p>
                </div>
                <div className='gap-4 flex'>
                    <Button className="bg-[#09090B] border-none text-[#F57C00] text-sm font-normal" onClick={handleDownloadCSV}>
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
                        <TableHead className='text-center'>
                            <input
                                type="checkbox"
                                className={styles.checkbox}
                                onChange={handleSelectAll}
                                checked={selectedWallet.length === wallets.length}
                            />
                        </TableHead>
                        <TableHead className='text-[12px] text-center'>#</TableHead>
                        <TableHead className='text-[12px] text-center'>ADDRESS</TableHead>
                        <TableHead className='text-[12px] text-center'>ETH BALANCE</TableHead>
                        <TableHead className='text-[12px] text-center'>TOKEN BALANCE</TableHead>
                        <TableHead className='text-[12px] text-center'>% TO SELL</TableHead>
                        <TableHead className='text-[12px] text-center'>ESTIMATED ETH</TableHead>
                        <TableHead className='text-[12px] text-center'>TRANSFER TO TARGET</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {initialWallets.map((wallet, index) => (
                        <TableRow key={wallet.address} className={`hover:bg-inherit py-0 border-none text-center ${index % 2 === 1 ? 'bg-[#18181B]' : ''}`}>
                            <TableCell className='py-0 text-center'>
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
                                    {Number(balances[index]?.ethBalance) / (10 ** 18)}
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
                                    {Number(balances[index]?.tokenBalance) / (10 ** 18)}
                                </div>
                            </TableCell>
                            <TableCell className='w-[150px] py-0'>
                                <Input
                                    className="bg-[#18181B] h-8 border-[#27272A] mt-2 text-white justify-center text-center text-[12px]"
                                    placeholder="%"
                                    type="number"
                                    required
                                    value={wallet?.tokenToSell}
                                    onChange={(e) => handleTokenToSell(e, index)}
                                />
                            </TableCell>
                            <TableCell className='py-0 text-[#A1A1AA] text-[12px]'>{wallet?.estimate}</TableCell>
                            <TableCell className=' py-0'>
                                <input
                                    type="checkbox"
                                    className={`${styles.checkbox}`}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
