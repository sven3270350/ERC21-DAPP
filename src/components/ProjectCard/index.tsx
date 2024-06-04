"use client";

import Image from "next/image";
import React from "react";
import { toast } from "sonner";


const ProjectCard = ({}) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.info("Copied to clipboard");
  };

  let status = "Created";

  return (
    <div className="flex flex-col gap-4 bg-[#18181B] px-4 py-3 rounded-xl w-[32.5%]">
      <div className="flex justify-between items-center border-[#27272A] mb-3 pb-3 border-b">
        <h1 className="font-semibold text-[18px] leading-7">OpSec</h1>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Image
              src={"/icons/rocket-white.svg"}
              alt="purse"
              width={20}
              height={20}
            />
            <p className="font-semibold text-sm">Deployer Wallet</p>
          </div>
          <p className="font-medium text-[#71717A] text-xs tracking-[0.06px]">
            0x40Ea7581ed45BF55F255b465c59ccFd298FC3c89
          </p>
        </div>
        <button
          className="flex items-end"
          onClick={() =>
            copyToClipboard("0x40Ea7581ed45BF55F255b465c59ccFd298FC3c89")
          }
        >
          <Image src={"/copy-01.svg"} alt="copy" width={20} height={20} />
        </button>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Image src={"/icons/code.svg"} alt="team" width={20} height={20} />
            <p className="font-semibold text-sm">Dev Wallet</p>
          </div>
          <p className="font-medium text-[#71717A] text-xs tracking-[0.06px]">
            0xcF2898225ED05Be911D3709d9417e86E0b4Cfc8f
          </p>
        </div>
        <button
          className="flex items-end"
          onClick={() =>
            copyToClipboard("0x40Ea7581ed45BF55F255b465c59ccFd298FC3c89")
          }
        >
          <Image src={"/copy-01.svg"} alt="copy" width={20} height={20} />
        </button>
      </div>
      <div className="flex justify-between border-[#27272A] pb-4 border-b">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Image
              src={"/icons/marketing.svg"}
              alt="team"
              width={20}
              height={20}
            />
            <p className="font-semibold text-sm">Marketing Wallet</p>
          </div>
          <p className="font-medium text-[#71717A] text-xs tracking-[0.06px]">
            0x0000633b68f5D8D3a86593ebB815b4663BCBe0
          </p>
        </div>
        <button
          className="flex items-end"
          onClick={() =>
            copyToClipboard("0x40Ea7581ed45BF55F255b465c59ccFd298FC3c89")
          }
        >
          <Image src={"/copy-01.svg"} alt="copy" width={20} height={20} />
        </button>
      </div>
      <div className="gap-8 grid grid-cols-3 pt-4">
        <div className="flex flex-col justify-between items-start gap-2 col-span-1">
          <div className="flex gap-2">
            <Image src={"/coins-01.svg"} alt="coins" width={20} height={20} />
            <p className="font-semibold text-sm">5M</p>
          </div>
          <p className="font-medium text-[#71717A] text-xs tracking-[0.06px]">
            maxSupply
          </p>
        </div>
        <div className="flex flex-col justify-between items-start gap-2 col-span-1">
          <div
            className={`flex h-[22px] px-3 py-1 justify-center ${status === "Created" ? "text-[#FFC400] bg-[#FFC400]" : status === "In Progress" ? "text-[#2979FF] bg-[#2979FF]" : "text-[#00E676] bg-[#00E676]"} text-xs font-semibold tracking-[0.06px] items-center px-[6px] bg-opacity-10 rounded gap-1`}
          >
            <Image
              src={`/${status === "Created" ? "nano-technology" : status === "In Progress" ? "codesandbox" : "rocket-01"}.svg`}
              alt="icon"
              width={14}
              height={14}
            />
            {status}
          </div>
          <p className="font-medium text-[#71717A] text-xs tracking-[0.06px]">
            Project stats
          </p>
        </div>
        <div className="flex flex-col justify-between items-start gap-2 col-span-1">
          <div className="flex gap-2">
            <Image
              src={"/wallet-01-white.svg"}
              alt="wallet"
              width={20}
              height={20}
            />
            <p className="font-semibold text-sm">50</p>
          </div>
          <p className="font-medium text-[#71717A] text-xs tracking-[0.06px]">
            Wallets
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
