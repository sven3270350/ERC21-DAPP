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

// createWallets.ts
export const createWallets = async (count: number) => {
    return new Promise<any[]>((resolve, reject) => {
    const createWalletsWorkerCode = `
            importScripts('https://cdnjs.cloudflare.com/ajax/libs/ethers/6.4.0/ethers.umd.min.js');

            self.onmessage = async event => {
                const count = event.data;
                const wallets = [];
                for (let i = 0; i < count; i++) {
                    const wallet = ethers.Wallet.createRandom();
                    wallets.push({
                        address: wallet.address,
                        amount: "",
                        privateKey: wallet.privateKey
                    });
                }
                self.postMessage(wallets);
            };
        `;
        
        const blob = new Blob([createWalletsWorkerCode], { type: 'application/javascript' });
        const worker = new Worker(URL.createObjectURL(blob));

        worker.onmessage = (event) => {
            resolve(event.data);
            worker.terminate();
        };
        
        worker.onerror = reject;

        worker.postMessage(count);
    });
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

