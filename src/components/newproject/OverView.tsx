import React from "react";
import Image from "next/image";
import { Input } from "../ui/input";
import { toast } from "sonner";

interface AdminWallet {
    name: string;
    publicKey: string;
    privateKey: string;
}

interface BeneficiaryWallet {
    address: string;
    amount: string;
}

interface OverviewProps {
    projectName: string;
    tokenDetails: any;
    beneficiaryDetails: { wallets: BeneficiaryWallet[] };
    fundingWalletData: AdminWallet;
    adminWalletData: AdminWallet;
}

const Overview: React.FC<OverviewProps> = ({ projectName, tokenDetails, beneficiaryDetails, fundingWalletData, adminWalletData }) => {
    const wallets: AdminWallet[] = [
        {
            name: 'Funding Wallet',
            publicKey: fundingWalletData?.publicKey || '',
            privateKey: fundingWalletData?.privateKey || ''
        },
        {
            name: 'Admin Wallet',
            publicKey: adminWalletData?.publicKey || '',
            privateKey: adminWalletData?.privateKey
        }
    ];

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.info("Copied to clipboard");
    };

    const downloadKey = (key: string, filename: string, keyType: 'Public key' | 'Private key') => {
        const keyContent = `${keyType}: ${key}`;
        const element = document.createElement('a');
        const file = new Blob([keyContent], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = filename;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };


    const renderWallets = (): JSX.Element[] => {
        return wallets.map((wallet: AdminWallet, index: number) => (
            <div key={index} className='border-dashed border-[1px] border-[#27272A] px-6 py-4 w-[320px]'>
                <h2 className="text-xl font-semibold text-white text-center mb-2">{wallet.name}</h2>
                {renderKeys(wallet)}
            </div>
        ));
    };

    const renderKeys = (wallet: AdminWallet): JSX.Element => {
        return (
            <>
                <div className='mb-4'>
                    <h2 className="text-base font-semibold text-white text-center mb-2">Public Key</h2>
                    <p className="text-[#71717A] text-xs font-medium text-start">{wallet.publicKey}</p>
                    {renderKeyActions(wallet.publicKey, `${wallet.name}_public_key.txt`, 'Public key')}
                </div>
                <div className='mb-4'>
                    <h2 className="text-base font-semibold text-white text-center mb-2">Private Key</h2>
                    <Input type='password' className='bg-[#09090B] border-0 text-[#71717A] text-xs font-medium' value={wallet.privateKey} readOnly />
                    {renderKeyActions(wallet.privateKey, `${wallet.name}_private_key.txt`, 'Private key')}
                </div>
            </>
        );
    };    

    const renderKeyActions = (key: string, filename: string, keyType: 'Public key' | 'Private key'): JSX.Element => {
        return (
            <div className='flex gap-2'>
                <Image
                    src={"/Images/New Project/copy-01.svg"}
                    width={16}
                    height={16}
                    alt="Copy"
                    className='cursor-pointer'
                    onClick={() => copyToClipboard(key)}
                />
                <Image
                    src={"/Images/New Project/download-02.svg"}
                    width={16}
                    height={16}
                    alt="Download"
                    className='cursor-pointer'
                    onClick={() => downloadKey(key, filename, keyType)}
                />
            </div>
        );
    };



    const array1 = [
        {
            price: tokenDetails?.tokenName || 'N/A',
            name: 'Token Name'
        },
        {
            price: tokenDetails?.tokenSymbol || 'N/A',
            name: 'Token Symbol '
        },
        {
            price: tokenDetails?.maxSupply || 'N/A',
            name: 'Max supply'
        },
        {
            price: tokenDetails?.initialSupply || 'N/A',
            name: 'Initial supply'
        },
    ];

    const array2 = [
        {
            price: tokenDetails?.liquidity || 'N/A',
            name: 'Liquidity'
        },
        {
            price: tokenDetails?.tradingPrice || 'N/A',
            name: 'Trading price'
        },
        {
            price: tokenDetails?.maxSupply || 'N/A',
            name: 'Max supply'
        },
        {
            price: tokenDetails?.initialSupply || 'N/A',
            name: 'Initial supply'
        },
    ];

    return (
        <section>
            <div className="mb-4">
                <h2 className="text-xl font-semibold text-white text-center mb-2">Overview</h2>
                <p className="text-white text-lg font-medium text-center mb-4">{projectName}</p>
                <div className="grid grid-cols-4 justify-between mb-4">
                    {array1.map((item, index) => (
                        <div key={index}>
                            <h4 className="font-medium text-[16px] text-white">{item.price}</h4>
                            <p className="text-[#71717A] text-sm font-medium ">{item.name}</p>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-4 justify-between mb-4">
                    {array2.map((item, index) => (
                        <div key={index}>
                            <h4 className="font-medium text-[16px] text-white">{item.price}</h4>
                            <p className="text-[#71717A] text-sm font-medium ">{item.name}</p>
                        </div>
                    ))}
                </div>
                <div className='flex gap-4 mb-4'>
                    {renderWallets()}
                </div>
                <h2 className="text-xl font-semibold text-white text-start mb-2">Beneficiaries</h2>
                {beneficiaryDetails?.wallets?.map((wallet: BeneficiaryWallet, index: number) => (
                    <div className="flex justify-between mb-4" key={index}>
                        <div>
                            <h4 className="font-medium text-[16px] text-white">{wallet.address}</h4>
                            <p className="text-[#71717A] text-sm font-medium ">Wallet address</p>
                        </div>
                        <div>
                            <h4 className="font-medium text-[16px] text-white">{wallet.amount}</h4>
                            <p className="text-[#71717A] text-sm font-medium ">Supply of token</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Overview;
