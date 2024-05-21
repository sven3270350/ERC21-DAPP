import React, { useState, useEffect } from 'react';
import WalletSection from './WalletSection';
import { saveProjectData, getProjectData } from "@/app/utils/utils";

interface CreateWalletProps {
    setIsValid: (isValid: boolean) => void;
    showError: boolean;
}

const createRandomKey = (): string => {
    const hexString = [...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    return `${hexString.substring(0, 16)} ${hexString.substring(16, 32)} ${hexString.substring(32, 48)} ${hexString.substring(48, 64)}`;
};

export const CreateWallet: React.FC<CreateWalletProps> = ({ setIsValid, showError }) => {
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
        const data = getProjectData();
        if (data?.FundingWallet) {
            setFundingWalletPublicKey(data?.FundingWallet?.fundingWalletPublicKey);
            setFundingWalletPrivateKey(data?.FundingWallet?.fundingWalletPrivateKey);
            setShowFundingWalletContent(true);
        }
        if (data?.AdminWallet) {
            setControlWalletPublicKey(data?.AdminWallet?.AdminWalletPublicKey);
            setControlWalletPrivateKey(data?.AdminWallet?.AdminWalletPrivateKey);
            setShowControlWalletContent(true);
        }
    }, []);

    const handleFundingWalletButtonClick = () => {
        const publicKey = createRandomKey();
        const privateKey = createRandomKey();
        setFundingWalletPublicKey(publicKey);
        setFundingWalletPrivateKey(privateKey);
        saveProjectData('FundingWallet', {
            fundingWalletPublicKey: publicKey,
            fundingWalletPrivateKey: privateKey,
        });
        setShowFundingWalletContent(true);
    };

    const handleControlWalletButtonClick = () => {
        const publicKey = createRandomKey();
        const privateKey = createRandomKey();
        setControlWalletPublicKey(publicKey);
        setControlWalletPrivateKey(privateKey);
        saveProjectData('AdminWallet', {
            AdminWalletPublicKey: publicKey,
            AdminWalletPrivateKey: privateKey,
        });
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
