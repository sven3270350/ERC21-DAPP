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
    <div className="px-6 pt-4 rounded-t-lg w-full mb-6 border-[#3F3F46] flex flex-col items-start bg-[#0F0F11]">
      <div className="flex justify-between items-center self-stretch pb-3">
        <div className="flex items-center gap-4">
          <p className="text-[#F57C00] font-semibold">BRUNE</p>
          <span className="text-[#71717A]">|</span>
          <div className="flex gap-1 items-center">
            <p className="text-sm text-[#71717A]">00qwe1...01230</p>
            <Image
              src={"/Images/New Project/copy-01.svg"}
              width={14}
              height={14}
              alt="Copy"
              className='cursor-pointer'
            />
          </div>
          <div className="text-center">
            <div className="flex gap-1 items-center">
              <Image
                src={"/coins-01.svg"}
                width={14}
                height={14}
                alt="Copy"
                className='cursor-pointer'
              />
              <span className="text-white text-sm">5M</span>
            </div>
            <span className="text-sm text-[#71717A] mt-1">MaxSupply</span>
          </div>
          <span className="border-[1px] h-8 border-[#71717A]"></span>
          <div className="text-center">
            <div className={`flex h-[22px] w-24 py-1 justify-center ${status === "Created" ? "text-[#FFC400] bg-[#FFC400]" : status === "In Progress" ? "text-[#2979FF] bg-[#2979FF]" : "text-[#00E676] bg-[#00E676]"} text-xs font-semibold tracking-[0.06px] items-center px-[6px] bg-opacity-10 rounded gap-1`}>
              <Image
                src={`/${status === "Created" ? "nano-technology" : status === "In Progress" ? "codesandbox" : "rocket-01"}.svg`}
                alt="icon"
                width={14}
                height={14}
              />
              Launched
            </div>
            <p className="text-xs font-medium text-[#71717A] tracking-[0.06px] mt-1">
              Project stats
            </p>
          </div>
          <span className="border-[1px] h-8 border-[#71717A]"></span>
          <div className="text-center">
            <div className="flex gap-1 items-center">
              <Image
                src={"/wallet-01-white.svg"}
                width={14}
                height={14}
                alt="Copy"
                className='cursor-pointer'
              />
              <span className="text-white text-sm">6000</span>
            </div>
            <span className="text-sm text-[#71717A] mt-1">MaxSupply</span>
          </div>
        </div>
        <div className="flex gap-4">
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
                            <Image src={"/user.svg"} alt="wallet" width={20} height={20} />
                            Riyo.eliteKods@gmail.com
                            <Image src={"/dots.svg"} alt="wallet" width={20} height={20} />
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
          <button
            onClick={handleNewProjectClick}
            className="bg-[#F57C00] px-6 py-3 flex gap-2 items-center justify-center rounded-md text-[#000000] text-base font-bold leading-6 tracking-[0.032px]"
          >
            <Image src={"/plus.svg"} alt="plus" width={20} height={20} />
            <p>New Project</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
