import Image from "next/image";
import React, { useEffect } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
const ConnectWallet = () => {
  // const router = useRouter();
  // const { isConnected, address } = useAccount();
  // const isAllowed = isConnected;
  // useEffect(() => {
  //   if (session.status !== "authenticated") return;
  //   if (isAllowed) {
  //     router.push("/dashboard");
  //     toast.success("Wallet connected successfully");
  //   }
  // }, [isConnected, router, address, session]);
  const handlePublicKeyCopy = () => {
    navigator.clipboard.writeText("0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367");
    toast.info("Public Key copied to clipboard");
};

  return (
    <div className=" w-full text-white overflow-auto flex justify-between items-start ">
      <div>
        <h2 className="text-xl font-semibold text-white text-start mb-2">Deployer wallet</h2>
        <p className="text-[#71717A] text-sm font-medium text-center mb-2 flex gap-2 items-center">0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367
          <span className="font-bold text-white">
            <Image
              src={"/copy-01.svg"}
              width={20}
              height={20}
              alt="copy"
              onClick={handlePublicKeyCopy}
            /></span>
        </p>
        <p className="text-[#71717A] text-sm font-medium text-start mb-4">Connect your deployer wallet to interact with this page</p>
      </div>
      <div>
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openConnectModal,
            openChainModal,
            openAccountModal,
            mounted,
          }) => {
            return (
              <div
                {...(!mounted && {
                  "aria-hidden": "true",
                  style: {
                    opacity: 0,
                    pointerEvents: "none",
                    userSelect: "none",
                  },
                })}
              >
                {!mounted || !account || !chain ? (
                  <button
                    className="w-full flex items-center justify-center rounded-md text-[#000000] text-base font-bold tracking-[0.32px] bg-[#F57C00] py-3 gap-2 px-6 "
                    onClick={openConnectModal}
                  >
                    <Image
                      src="/unlink.svg"
                      width={20}
                      height={20}
                      alt="link"
                    />
                    <p>Connect Wallet </p>
                  </button>
                ) : chain.unsupported ? (
                  <button onClick={openChainModal} type="button">
                    Wrong network
                  </button>
                ) : (
                  <div className="text-center bg-[#F57C00] flex gap-3 items-center justify-center px-6 py-3 font-bold rounded-md ">
                    <button
                      onClick={openChainModal}
                      style={{ display: "flex", alignItems: "center" }}
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
                            <Image
                              alt={chain.name ?? "Chain icon"}
                              src={chain.iconUrl}
                              width={12}
                              height={12}
                            />
                          )}
                        </div>
                      )}
                      {chain.name}
                    </button>
                    <button onClick={openAccountModal} type="button">
                      {account.displayName}
                      {account.displayBalance
                        ? ` (${account.displayBalance})`
                        : ""}
                    </button>
                  </div>
                )}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </div>
      {/* <div className="flex flex-col gap-10 mt-20 ">
        <div className="flex flex-col justify-center items-center gap-4">
          <Image src="/box.svg" alt="box" width={69.63} height={80.01} />
          <h1 className="text-2xl leading-7 font-semibold  ">ERC21 Bot</h1>
        </div>
        <div className="p-8 border border-[#27272A] w-[370px] rounded-xl gap-4 flex flex-col items-center ">
          <Image src={"/wallet.svg"} width={150} height={150} alt="wallet" />
          <div className="flex flex-col">
            <h1 className="text-[28px]  text-center font-bold leading-9 tracking-[-0.28px] mb-3 ">
              Connect Wallet to Start{" "}
            </h1>
            <p className="text-center text-sm font-medium mb-4 text-[#71717A] ">
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
            </p>
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openConnectModal,
                openChainModal,
                openAccountModal,
                mounted,
              }) => {
                return (
                  <div
                    {...(!mounted && {
                      "aria-hidden": "true",
                      style: {
                        opacity: 0,
                        pointerEvents: "none",
                        userSelect: "none",
                      },
                    })}
                  >
                    {!mounted || !account || !chain ? (
                      <button
                        className="w-full flex items-center justify-center rounded-md text-[#000000] text-base font-bold tracking-[0.32px] bg-[#F57C00] py-3 gap-2 px-6 "
                        onClick={openConnectModal}
                      >
                        <Image
                          src="/unlink.svg"
                          width={20}
                          height={20}
                          alt="link"
                        />
                        <p>Connect Wallet </p>
                      </button>
                    ) : chain.unsupported ? (
                      <button onClick={openChainModal} type="button">
                        Wrong network
                      </button>
                    ) : (
                      <div className="text-center bg-[#F57C00] flex gap-3 items-center justify-center px-6 py-3 font-bold rounded-md ">
                        <button
                          onClick={openChainModal}
                          style={{ display: "flex", alignItems: "center" }}
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
                                <Image
                                  alt={chain.name ?? "Chain icon"}
                                  src={chain.iconUrl}
                                  width={12}
                                  height={12}
                                />
                              )}
                            </div>
                          )}
                          {chain.name}
                        </button>
                        <button onClick={openAccountModal} type="button">
                          {account.displayName}
                          {account.displayBalance
                            ? ` (${account.displayBalance})`
                            : ""}
                        </button>
                      </div>
                    )}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default ConnectWallet;
