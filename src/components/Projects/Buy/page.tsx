import React, { useState, ChangeEvent } from 'react';
import { Button } from '../../ui/button';
import ConnectWallet from '../../connectWallet';
import Image from 'next/image';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import styles from '../../newproject/checkbox.module.css';
import { toast } from 'sonner';
import { Wallet } from '@/types/wallet';

interface BuyPageProps {
    wallets: Wallet[];
    balances: { ethBalance: bigint; tokenBalance: bigint; }[];
    onSelectionChange: (selectedWallets: Wallet[]) => void;
}

export const BuyPage: React.FC<BuyPageProps> = ({ wallets, balances, onSelectionChange }) => {
    const [selectedWallet, setSelectedWallet] = useState<string[]>([]);
    const [initialWallets, setInitialWallets] = useState<Wallet[]>(wallets);

    const handleSelectAll = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelectedWallet(initialWallets.map(wallet => wallet.address));
            applyAmountsToAll();
            onSelectionChange(initialWallets); 
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
            tokensToBuy: firstWallet.tokensToBuy,
            additionalEth: firstWallet.additionalEth,
        })));
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

    const handleTokensToBuyChange = (event: ChangeEvent<HTMLInputElement>, index: number) => {
        const newWallets = [...initialWallets];
        newWallets[index].tokensToBuy = event.target.value;
        setInitialWallets(newWallets);
    };

    const handleAdditionalEthChange = (event: ChangeEvent<HTMLInputElement>, index: number) => {
        const newWallets = [...initialWallets];
        newWallets[index].additionalEth = event.target.value;
        setInitialWallets(newWallets);
    };

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
    

    console.log(selectedWallet);
    return (
        <div>
            <div className='flex justify-between mt-5 mb-5'>
                <div className='flex gap-4'>
                    <p className='flex items-center gap-2 mb-2 font-medium text-[#71717A] text-sm'>Selected: <span className='text-white'>{selectedWallet?.length}</span></p>
                </div>
                <div className='flex gap-4'>
                    <Button className="bg-[#09090B] border-none font-normal text-[#F57C00] text-sm" onClick={handleDownloadCSV}>
                        <Image
                            src={"/Images/New Project/download-02.svg"}
                            width={18}
                            height={18}
                            alt="logo"
                            className="m-auto mr-1 cursor-pointer"
                        />
                        Download wallets
                    </Button>
                    {/* <Button className="bg-[#09090B] border-none font-normal text-[#F57C00] text-sm">
                        <Image
                            src={"/Images/New Project/add-01.svg"}
                            width={18}
                            height={18}
                            alt="logo"
                            className="m-auto mr-1 cursor-pointer"
                        />
                        Add Wallet
                    </Button> */}
                </div>
            </div>
            <div>
                <Table className='border-[#18181B] border-[1px] rounded-md text-center'>
                    <TableHeader className='bg-[#18181B]'>
                        <TableRow className='hover:bg-inherit border-none'>

                            <TableHead className='text-center'>
                                <input
                                    type="checkbox"
                                    className={styles.checkbox}
                                    onChange={handleSelectAll}
                                    checked={selectedWallet.length === wallets?.length}
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
                        {initialWallets?.map((wallet, index) => (
                            <TableRow key={wallet.address} className={`hover:bg-inherit py-0 border-none ${index % 2 === 1 ? 'bg-[#18181B]' : ''}`}>
                                <TableCell className='py-0 text-center'>
                                    <input
                                        type="checkbox"
                                        className={styles.checkbox}
                                        checked={isSelected(wallet.address)}
                                        onChange={(event) => handleSelectOne(event, wallet.address)}
                                    />
                                </TableCell>
                                <TableCell className='text-[#A1A1AA] text-[12px]'>{index + 1}</TableCell>
                                <TableCell className='py-0 text-center'>
                                    <div className='flex items-center gap-1 text-[#71717A] text-[12px]'>
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
                                    <div className='flex justify-center items-center gap-1 text-[#F57C00] text-[12px]'>
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
                                    <div className='flex justify-center items-center gap-1 text-[#A1A1AA] text-[12px]'>
                                        <Image
                                            src={"/coins-01.svg"}
                                            width={15}
                                            height={15}
                                            alt="Token"
                                        />
                                        {Number(balances[index]?.tokenBalance) / (10 ** 18)}
                                    </div>
                                </TableCell>
                                <TableCell className='py-0 w-[200px]'>
                                    <Input
                                        className="border-[#27272A] bg-[#18181B] mt-2 h-8 text-[12px] text-center text-white"
                                        placeholder="Amount"
                                        type="number"
                                        value={wallet.tokensToBuy}
                                        onChange={(e) => handleTokensToBuyChange(e, index)}
                                        required
                                    />
                                </TableCell>
                                <TableCell className='py-0 w-[200px]'>
                                    {/* <Input
                                        className="border-[#27272A] bg-[#18181B] mt-2 h-8 text-[12px] text-center text-white"
                                        placeholder="Amount"
                                        type="number"
                                        value={wallet.additionalEth}
                                        onChange={(e) => handleAdditionalEthChange(e, index)}
                                        required
                                    /> */}
                                    <div>{wallet.additionalEth}</div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
