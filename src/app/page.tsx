"use client";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { signOut } from "next-auth/react";
import { useAccount } from "wagmi";
import { useEffect } from "react";
import ConnectWallet from "@/components/connectWallet";
export default function Home() {
  const { isConnected } = useAccount();

  return (
    <main>
      <ConnectWallet />
    </main>
  );
}
