import { ethers } from 'ethers';

export const generateBeneficiaryDetails = async (numWallets: number, tokenAmount: number) => {
    try {
        const wallets = await generateWallets(numWallets);
        return { numWallets, tokenAmount, wallets };
    } catch (error) {
        console.error("Error generating wallets:", error);
        throw error;
    }
};

export const generateWallets = (count: number) => {
    return Array.from({ length: count }, () => {
        const wallet = ethers.Wallet.createRandom();
        return {
            address: wallet.address,
            amount: "",
            privateKey: wallet.privateKey
        };
    });
};

