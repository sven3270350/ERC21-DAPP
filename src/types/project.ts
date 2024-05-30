export interface Project {
  projectName: string;
  adminWallet: {
    publicKey: string;
  };
  fundingWallet: {
    publicKey: string;
  };
  tokenDetails: {
    maxSupply: number;
  };
  status: string;
  beneficiaryDetails: {
    amount: string;
    wallets: { address: string; amount: string; privateKey: string }[];
  };
  [key: string]: any;
}
