import React, { useState } from 'react';
import WalletSection from './WalletSection';

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
        </div>
    );
};
