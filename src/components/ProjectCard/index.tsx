import Image from "next/image";
import React from "react";
import { toast } from "sonner";
interface ProjectCardProps {
  title: string;
  fundingWallet: string;
  teamWallet: string;
  maxSupply: number;
  status: string;
  wallets: number;
}
const ProjectCard: React.FC<ProjectCardProps> = ({
  status,
  fundingWallet,
  maxSupply,
  teamWallet,
  title,
  wallets,
}) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.info("Copied to clipboard");
  };

  return (
    <div className="py-3 px-4 bg-[#18181B] w-[32.5%] rounded-xl flex flex-col gap-4 ">
      <div className="flex justify-between pb-3 -b items-center -[#27272A] ">
        <h1 className="text-[18px] font-semibold leading-7 ">{title}</h1>
        <button>
          <Image
            src={`/${status === "Launched" ? "settings-02" : "edit-02"}.svg`}
            alt="settings"
            width={20}
            height={20}
          />
        </button>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col gap-2 ">
          <div className="flex gap-2">
            <Image src={"/purse.svg"} alt="purse" width={20} height={20} />

            <p className="text-sm font-semibold">Funding Wallet</p>
          </div>
          <p className="text-xs font-medium text-[#71717A] tracking-[0.06px]">
            {fundingWallet}
          </p>
        </div>
        <button
          className="flex items-end"
          onClick={() => copyToClipboard(fundingWallet)}
        >
          <Image src={"/copy-01.svg"} alt="copy" width={20} height={20} />
        </button>
      </div>
      <div className="flex justify-between -b -[#27272A] pb-4 ">
        <div className="flex flex-col gap-2 ">
          <div className="flex gap-2">
            <Image src={"/user-group.svg"} alt="team" width={20} height={20} />

            <p className="text-sm font-semibold">Team Wallet</p>
          </div>
          <p className="text-xs font-medium text-[#71717A] tracking-[0.06px]">
            {teamWallet}
          </p>
        </div>
        <button
          className="flex items-end"
          onClick={() => copyToClipboard(teamWallet)}
        >
          <Image src={"/copy-01.svg"} alt="copy" width={20} height={20} />
        </button>
      </div>
      <div className=" flex gap-8  pt-4">
        <div className=" flex-col flex  flex-1 gap-2 justify-between ">
          <div className="flex gap-2">
            <Image src={"/coins-01.svg"} alt="coins" width={20} height={20} />
            <p className="text-sm font-semibold ">{maxSupply}</p>
          </div>
          <p className="text-xs font-medium text-[#71717A] tracking-[0.06px] ">
            maxSupply
          </p>
        </div>
        <div className=" flex-col flex-1  flex gap-2  justify-between ">
          <div
            className={`flex h-[22px] w-24 py-1 justify-center  ${status === "Created" ? "text-[#FFC400] bg-[#FFC400] " : status === "In Progress" ? "text-[#2979FF] bg-[#2979FF]" : "text-[#00E676] bg-[#00E676]"} text-xs font-semibold tracking-[0.06px] items-center  px-[6px]  bg-opacity-10 rounded gap-1`}
          >
            <Image
              src={`/${status === "Created" ? "nano-technology" : status === "In Progress" ? "codesandbox" : "rocket-01"}.svg`}
              alt="rocker"
              width={14}
              height={14}
            />

            {status}
          </div>
          <p className="text-xs font-medium text-[#71717A] tracking-[0.06px] ">
            Project stats
          </p>
        </div>
        <div className=" flex-col flex  flex-1 gap-2 justify-between ">
          <div className="flex gap-2">
            <Image
              src={"/wallet-01-white.svg"}
              alt="coins"
              width={20}
              height={20}
            />
            <p className="text-sm font-semibold ">{wallets}</p>
          </div>
          <p className="text-xs font-medium text-[#71717A] tracking-[0.06px] ">
            Wallets
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
