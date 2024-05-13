"use client"
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAccount  } from 'wagmi';
export default function WalletAuth() {
  const { address, isConnected, isDisconnected } = useAccount();
  const router = useRouter();
  useEffect(() => {
    const init = async () => {
      if(address){
        console.log("address->",address);
        try {
          const response: any = await signIn("credentials", {
            email: '',
            password: '',
            walletAddress: address,
            redirect: false,
          });
          if (!response?.error) {
            router.push("/");
            router.refresh();
          }
    
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          // Process response here
          console.log("Login Successful", response);
        } catch (error: any) {
            console.error("Login Failed:", error);
        }
      }
    }
    init()
  },[address])
  return(
    <>
      <div className="w-100 flex justify-center mt-5">
        <ConnectButton />
      </div>
    </>
  )
}