import React, { useState, useEffect } from 'react';
import WalletSection from './WalletSection';
import { ethers } from 'ethers'; // Importing ethers.js

interface CreateWalletProps {
    setIsValid: (isValid: boolean) => void;
    showError: boolean;
    projectId: string;
    fundingWalletData: { publicKey: string, privateKey: string } | null;
    adminWalletData: { publicKey: string, privateKey: string } | null;
    setFundingWalletData: (data: { publicKey: string, privateKey: string }) => void;
    setAdminWalletData: (data: { publicKey: string, privateKey: string }) => void;
}

const CreateWallet: React.FC<CreateWalletProps> = ({ setIsValid, showError, projectId, fundingWalletData, adminWalletData, setFundingWalletData, setAdminWalletData }) => {
    const [showFundingWalletContent, setShowFundingWalletContent] = useState(false);
    const [showControlWalletContent, setShowControlWalletContent] = useState(false);
    const [fundingWalletPublicKey, setFundingWalletPublicKey] = useState('');
    const [fundingWalletPrivateKey, setFundingWalletPrivateKey] = useState('');
    const [controlWalletPublicKey, setControlWalletPublicKey] = useState('');
    const [controlWalletPrivateKey, setControlWalletPrivateKey] = useState('');

    useEffect(() => {
        const isValid = showFundingWalletContent && showControlWalletContent;
        setIsValid(isValid);
    }, [showFundingWalletContent, showControlWalletContent, setIsValid]);

    useEffect(() => {
        if (fundingWalletData) {
            setFundingWalletPublicKey(fundingWalletData.publicKey);
            setFundingWalletPrivateKey(fundingWalletData.privateKey);
            setShowFundingWalletContent(true);
        }
        if (adminWalletData) {
            setControlWalletPublicKey(adminWalletData.publicKey);
            setControlWalletPrivateKey(adminWalletData.privateKey);
            setShowControlWalletContent(true);
        }
    }, [fundingWalletData, adminWalletData]);

    const handleFundingWalletButtonClick = () => {
        const wallet = ethers.Wallet.createRandom();
        const publicKey = wallet.address;
        const privateKey = wallet.privateKey;
        setFundingWalletPublicKey(publicKey);
        setFundingWalletPrivateKey(privateKey);
        setFundingWalletData({ publicKey, privateKey });
        setShowFundingWalletContent(true);
    };

    const handleControlWalletButtonClick = () => {
        const wallet = ethers.Wallet.createRandom();
        const publicKey = wallet.address;
        const privateKey = wallet.privateKey;
        setControlWalletPublicKey(publicKey);
        setControlWalletPrivateKey(privateKey);
        setAdminWalletData({ publicKey, privateKey });
        setShowControlWalletContent(true);
    };

    return (
        <div className="mb-4">
            <h2 className="text-xl font-semibold text-white text-center mb-2">Create Funding and Control Wallet</h2>
            <p className="text-[#71717A] text-sm font-medium text-center mb-4">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam</p>
            <div className='flex gap-4'>
                <WalletSection
                    title="Funding Wallet"
                    buttonText="Create"
                    showContent={showFundingWalletContent}
                    onButtonClick={handleFundingWalletButtonClick}
                    publicKey={fundingWalletPublicKey}
                    privateKey={fundingWalletPrivateKey}
                />
                <WalletSection
                    title="Admin Wallet"
                    buttonText="Create"
                    showContent={showControlWalletContent}
                    onButtonClick={handleControlWalletButtonClick}
                    publicKey={controlWalletPublicKey}
                    privateKey={controlWalletPrivateKey}
                />
            </div>
            {showError && <p className="text-red-500 text-sm mt-1">Please Create Wallets</p>}
        </div>
    );
};

export default CreateWallet;
