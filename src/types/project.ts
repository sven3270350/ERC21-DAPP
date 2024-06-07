// types.ts

export interface Project {
  tokendetails: {
    tokenName: string;
    tokenSymbol: string;
    maxSupply: number;
    initialSupply: number;
  };
  walletAddess: string;
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
  status: string;
  beneficiaryDetails: {
    numWallets: number;
    tokenAmount: number;
    wallets: { address: string; amount: string; privateKey: string }[];
  };
}
