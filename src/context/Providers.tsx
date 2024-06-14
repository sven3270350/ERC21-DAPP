"use client"
import React from "react";
import { SessionProvider } from "next-auth/react"
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import {
  argentWallet
} from "@rainbow-me/rainbowkit/wallets";
import { Chain, configureChains, createConfig, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { mainnet, sepolia } from "wagmi/chains";

const chainss : Chain[] = [mainnet,sepolia];

const { chains, publicClient, webSocketPublicClient } = configureChains(chainss, [
  alchemyProvider({ apiKey: process.env.ALCHEMY_KEY ?? "lv9u9bsZ85gMYhfk3c9jyAIixErH-SoZ"}),
]);

const projectId: string = process.env.WALLETCONNECTPROJECTID ?? "a8596606f31dd36e8f20bd4237ef2415";

const { wallets } = getDefaultWallets({
  appName: "RainbowKit For Test Project",
  projectId,
  chains,
});

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: "Other",
    wallets: [
      argentWallet({ projectId, chains }),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <SessionProvider>
        <RainbowKitProvider chains={chains}>
          {children}
        </RainbowKitProvider>
      </SessionProvider>
    </WagmiConfig>
  );
}