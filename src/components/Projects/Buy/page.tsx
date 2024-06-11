import React, { useState, ChangeEvent, useEffect, useMemo } from 'react';
import { Button } from '../../ui/button';
import ConnectWallet from '../../connectWallet';
import Image from 'next/image';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import useBalance from "../../../hooks/useBalance";
import styles from '../../newproject/checkbox.module.css';
import { toast } from 'sonner';

interface Wallet {
    address: string;
    amount: string;
    ethBalance: string;
    tokenBalance: string;
    privateKey: string;
    tokensToBuy: string;
    additionalEth: string;
}

interface BuyPageProps {
    projectData: {
        beneficiaryDetails: {
            wallets: Wallet[];
        };
    };
}

type BalanceType = {
    ethBalance: bigint;
    tokenBalance: bigint;
}

export const BuyPage: React.FC<BuyPageProps> = ({ projectData }) => {
    const wallets: Wallet[] = useMemo(() => (projectData.beneficiaryDetails.wallets.slice(0, 2).map((wallet, index) => ({
        ...wallet,
        ethBalance: wallet.ethBalance || "0",
        tokenBalance: wallet.tokenBalance || "0"
    }))), [projectData.beneficiaryDetails.wallets]);
    console.log("wallets===>", wallets);

    const [initialWallets, setInitialWallets] = useState<Wallet[]>(wallets);
    const [selectedWallet, setSelectedWallet] = useState<string[]>([]);
    const [balances, setBalances] = useState<BalanceType[]>([]);
    const [firstTokensToBuy, setFirstTokensToBuy] = useState<string>("");
    const [firstAdditionalEth, setFirstAdditionalEth] = useState<string>("");

    const { getBalance, isLoading } = useBalance();
    useEffect(() => {
        Promise.all(wallets.map((value) => getBalance({ address: value.address as `0x${string}`, tokenAddress: "0xBd2E04Be415ec7517Cb8D110255923D2652Cbb79" }))).then(result => setBalances(result))
    }, [wallets]);

    const handleSelectAll = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelectedWallet(initialWallets.map(wallet => wallet.address));
            applyAmountsToAll();
        } else {
            setSelectedWallet([]);
            setInitialWallets(wallets);
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
            setSelectedWallet(prev => [...prev, walletAddress]);
        } else {
            setSelectedWallet(prev => prev.filter(address => address !== walletAddress));
        }
    };

    const isSelected = (walletAddress: string) => selectedWallet.includes(walletAddress);

    const handleTokensToBuyChange = (event: ChangeEvent<HTMLInputElement>, index: number) => {
        const newWallets = [...initialWallets];
        newWallets[index].tokensToBuy = event.target.value;
        setInitialWallets(newWallets);

        if (index === 0) {
            setFirstTokensToBuy(event.target.value);
        }
    };

    const handleAdditionalEthChange = (event: ChangeEvent<HTMLInputElement>, index: number) => {
        const newWallets = [...initialWallets];
        newWallets[index].additionalEth = event.target.value;
        setInitialWallets(newWallets);

        if (index === 0) {
            setFirstAdditionalEth(event.target.value);
        }
    };

    const handlePublicKeyCopy = (address: string, privateKey: string) => {
        const textToCopy = `${address} ${privateKey}`;
        navigator.clipboard.writeText(textToCopy);
        toast.info("Public Key and Private Key copied to clipboard");
    };

    return (
        <div>
            <div className='flex justify-between mt-5 mb-5'>
                <div className='gap-4 flex'>
                    <p className='text-[#71717A] text-sm font-medium mb-2 flex gap-2 items-center'>Selected: <span className='text-white'>{selectedWallet?.length}</span></p>
                    <p className='text-[#71717A] text-sm font-medium mb-2 flex gap-2 items-center'>Token balance: <span className='text-white'>{Number(balances[0]?.tokenBalance) / (10 ** 18)}</span></p>
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
                </div>
            </div>
            <div>
                <Table className='border-[1px] border-[#18181B] rounded-md text-center'>
                    <TableHeader className='bg-[#18181B]'>
                        <TableRow className='hover:bg-inherit border-none'>
                            <TableHead>
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
                            <TableHead className='text-[12px] text-center'>TOKENS TO BUY</TableHead>
                            <TableHead className='text-[12px] text-center'>ADDITIONAL ETH</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialWallets.map((wallet, index) => (
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
                                <TableCell className='py-0 text-center'>
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
                                    <div className='text-[#F57C00] flex gap-1 items-center text-[12px] justify-center'>
                                        <Image
                                            src={"/Vector.svg"}
                                            width={15}
                                            height={15}
                                            alt="ETH"
                                        />
                                        {Number(balances[index]?.ethBalance) / (10 ** 18)}
                                    </div>
                                </TableCell>
                                <TableCell className='py-0 '>
                                    <div className='text-[#A1A1AA] flex gap-1 items-center text-[12px] justify-center'>
                                        <Image
                                            src={"/coins-01.svg"}
                                            width={15}
                                            height={15}
                                            alt="Token"
                                        />
                                        {Number(balances[index]?.tokenBalance) / (10 ** 18)}
                                    </div>
                                </TableCell>
                                <TableCell className='w-[200px] py-0'>
                                    <Input
                                        className="bg-[#18181B] h-8 border-[#27272A] mt-2 text-white text-center text-[12px]"
                                        placeholder="Amount"
                                        type="number"
                                        value={wallet.tokensToBuy}
                                        onChange={(e) => handleTokensToBuyChange(e, index)}
                                        required
                                    />
                                </TableCell>
                                <TableCell className='w-[200px] py-0'>
                                    <Input
                                        className="bg-[#18181B] h-8 border-[#27272A] mt-2 text-white text-center text-[12px]"
                                        placeholder="Amount"
                                        type="number"
                                        value={wallet.additionalEth}
                                        onChange={(e) => handleAdditionalEthChange(e, index)}
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
