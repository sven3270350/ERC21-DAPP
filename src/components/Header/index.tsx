"use client";

import Image from "next/image";
import React, { useEffect } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { DisconnectBtn } from "./disconnect";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';

const Header: React.FC = () => {
  const { isConnected, address } = useAccount();
  const router = useRouter();

  // useEffect(() => {
  //   if (isConnected) {
  //     toast.success("Wallet connected successfully");
  //   } else {
  //     router.push("/");
  //   }

  //   if (!address) {
  //     toast.error("Wallet not connected");
  //   }
  // }, [isConnected, address, router]);

  const handleNewProjectClick = () => {
    const newProjectId = uuidv4();
    window.location.href = `/newproject?projectId=${newProjectId}`;
  };
  
  return (
    <div className="px-6 pt-4 rounded-t-lg w-full mb-6 border-[#3F3F46] flex flex-col items-start">
      <div className="flex justify-between items-center self-stretch">
        <Link href={"/"} className="flex justify-center items-center gap-2 max-sm:gap-2">
          <Image src={"/box.svg"} alt="logo" width={30} height={35} className="max-sm:w-[30px] max-sm:h-[30px]" />
          <h1 className="text-[18px] font-semibold leading-7">ERC21 Bot</h1>
        </Link>

        <div className="flex gap-4">
          <button
            onClick={handleNewProjectClick}
            className="bg-[#F57C00] px-6 py-3 flex gap-2 items-center justify-center rounded-md text-[#000000] text-base font-bold leading-6 tracking-[0.032px]"
          >
            <Image src={"/plus.svg"} alt="plus" width={20} height={20} />
            <p>New Project</p>
          </button>
          {isConnected ? (
            <DisconnectBtn />
          ) : (
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                mounted,
              }) => {
                return (
                  <div
                    {...(!mounted && {
                      "aria-hidden": true,
                      style: {
                        opacity: 0,
                        pointerEvents: "none",
                        userSelect: "none",
                      },
                    })}
                  >
                    {(() => {
                      if (!mounted || !account || !chain) {
                        return (
                          <button
                            onClick={openConnectModal}
                            type="button"
                            className="flex px-6 py-3 text-[#F57C00] text-center text-base font-bold leading-6 items-center gap-2 rounded-md border border-[#F57C00]"
                          >
                            <Image src={"/wallet-01.svg"} alt="wallet" width={20} height={20} />
                            Connect Wallet
                          </button>
                        );
                      }

                      if (chain.unsupported) {
                        return (
                          <button onClick={openChainModal} type="button">
                            Wrong network
                          </button>
                        );
                      }

                      return (
                        <div style={{ display: "flex", gap: 12 }}>
                          <button
                            className="flex px-6 py-2 text-[#F57C00] text-center text-base font-bold leading-6 items-center gap-3 rounded-full border border-[#F57C00]"
                            onClick={openChainModal}
                            type="button"
                          >
                            {chain.hasIcon && (
                              <div
                                style={{
                                  background: chain.iconBackground,
                                  width: 12,
                                  height: 12,
                                  borderRadius: 999,
                                  overflow: "hidden",
                                  marginRight: 4,
                                }}
                              >
                                {chain.iconUrl && (
                                  <Image alt={chain.name ?? "Chain icon"} src={chain.iconUrl} width={12} height={12} />
                                )}
                              </div>
                            )}
                            {chain.name}
                          </button>

                          <button onClick={openAccountModal} type="button">
                            {account.displayName}
                            {account.displayBalance ? ` (${account.displayBalance})` : ""}
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
