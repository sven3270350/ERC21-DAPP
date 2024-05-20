import React, { useState, useEffect } from 'react';
import WalletSection from './WalletSection';

interface CreateWalletProps {
    setIsValid: (isValid: boolean) => void;
    showError: boolean;
}

export const CreateWallet: React.FC<CreateWalletProps> = ({ setIsValid, showError }) => {
    const [showFundingWalletContent, setShowFundingWalletContent] = useState(false);
    const [showControlWalletContent, setShowControlWalletContent] = useState(false);

    useEffect(() => {
        const isValid = showFundingWalletContent && showControlWalletContent;
        setIsValid(isValid);
    }, [showFundingWalletContent, showControlWalletContent, setIsValid]);

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
                <WalletSection
                    title="Funding Wallet"
                    buttonText="Create"
                    showContent={showFundingWalletContent}
                    onButtonClick={handleFundingWalletButtonClick}
                />
                <WalletSection
                    title="Admin Wallet"
                    buttonText="Create"
                    showContent={showControlWalletContent}
                    onButtonClick={handleControlWalletButtonClick}
                />
            </div>
            {showError && <p className="text-red-500 text-sm mt-1">Please Create Wallets</p>}
        </div>
    );
};
