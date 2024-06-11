"use client";

import { Project } from "@/types/project";
import Image from "next/image";
import React from "react";
import { toast } from "sonner";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.info("Copied to clipboard");
  };

  const status = project.status || "Created";

  const totalWalletAmount = project?.beneficiaryDetails?.wallets?.reduce((total, wallet) => {
    return total + (parseFloat(wallet.amount) || 0);
  }, 0);

  return (
    <div className="flex flex-col gap-4 col-span-1 bg-[#18181B] px-[10px] py-3 rounded-xl">
      <div className="flex justify-between items-center border-[#27272A] mb-3 pb-3 border-b">
        <h1 className="font-semibold text-[18px] leading-7">{project?.tokendetails?.tokenName}</h1>
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
          <p className="text-[#71717A] text-xs font-medium text-start break-words">
            {project?.walletAddress}
          </p>
        </div>
        <button
          className="flex items-end"
          onClick={() => copyToClipboard(project?.walletAddress)}
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
          <p className="text-[#71717A] text-xs font-medium text-start break-words">
            {project?.devWallet?.devWallet}
          </p>
        </div>
        <button
          className="flex items-end"
          onClick={() => copyToClipboard(project?.devWallet?.devWallet)}
        >
          <Image src={"/copy-01.svg"} alt="copy" width={20} height={20} />
        </button>
      </div>
      <div className="flex gap-1 justify-between border-[#27272A] pb-4 border-b">
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
          <p className="text-[#71717A] text-xs font-medium text-start break-words">
            {project?.marketingWallet?.marketingWallet}
          </p>
        </div>
        <button
          className="flex items-end"
          onClick={() => copyToClipboard(project?.marketingWallet?.marketingWallet)}
        >
          <Image src={"/copy-01.svg"} alt="copy" width={20} height={20} />
        </button>
      </div>
      <div className="justify-between grid grid-cols-3 pt-4">
        <div className="flex flex-col justify-between items-start gap-2 col-span-1">
          <div className="flex gap-2">
            <Image src={"/coins-01.svg"} alt="coins" width={20} height={20} />
            <p className="font-semibold text-sm">{project?.tokendetails?.maxSupply}</p>
          </div>
          <p className="font-medium text-[#71717A] text-xs tracking-[0.06px]">
            Max Supply
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
            Project Status
          </p>
        </div>
        <div className="flex flex-col justify-between items-center gap-2 col-span-1">
          <div className="flex gap-2">
            <Image
              src={"/wallet-01-white.svg"}
              alt="wallet"
              width={20}
              height={20}
            />
            <p className="font-semibold text-sm">
              {totalWalletAmount?.toFixed(2)}
            </p>
          </div>
          <p className="font-medium text-[#71717A] text-xs tracking-[0.06px]">
            Wallets Amount
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
