// types.ts

interface Wallet {
  address: string;
  amount: string;
  privateKey: string;
}

export interface Project {
  tokendetails: {
    tokenName: string;
    tokenSymbol: string;
    maxSupply: number;
    initialSupply: number;
  };
  walletAddress: string;
  devWallet: {
    devBuyTax: number;
    devSellTax: number;
    devWallet: string;
  };
  marketingWallet: {
    marketingBuyTax: number;
    marketingSellTax: number;
    marketingWallet: string;
  };
  poolData: {
    liquidityAmount: number;
    liquidityToken: string;
  };
  bundleWallet: string;
  poolAddress: string;
  status: string;
  beneficiaryDetails: {
    numWallets: number;
    tokenAmount: number;
    wallets: Wallet[];
  } & { [key: string]: number };
}
