export interface Wallet {
    address: string;
    amount: string;
    ethBalance: string;
    tokenBalance: string;
    privateKey: string;
    tokensToBuy: string;
    additionalEth: string;
    estimate?: string; 
    tokenToSell?: string;
    addressToTransfer?: string;
    TokenAmount?: string;
    requiredETH?: string
    ethEstimated?: string
}
