"use client";

import Image from "next/image";
import React from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { DisconnectBtn } from "./disconnect";
import Link from "next/link";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';
import { ProjectHeadData } from "./ProjectHeadData";
import { useSession } from "next-auth/react";

const Header: React.FC<{ project: any }> = ({ project }) => {
  // const { isConnected, address } = useAccount();
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const isDashboardRoute = pathname === "/dashboard";
   const handleNewProjectClick = () => {
    const newProjectId = uuidv4();
    router.push(`/newproject?projectId=${newProjectId}`);
  };

  return (
    <div className="fixed top-0 left-[250px] w-[calc(100%-250px)] px-6 pt-4 bg-[#0F0F11] z-50">
      <div className="flex justify-between items-center self-stretch pb-3 max-w-full-xl ">
      {!isDashboardRoute && <ProjectHeadData project={project} />}
        <div className="flex gap-4 ml-auto">
          <button
            type="button"
            className="flex px-4 py-2  text-[#F57C00] text-center text-sm font-bold leading-6 items-center gap-2 rounded-md border border-[#F57C00]"
          >
            <Image src={"/user.svg"} alt="wallet" width={20} height={20} />
            {session?.user?.email}
            <Image src={"/dots.svg"} alt="wallet" width={20} height={20} />
          </button>
          <button
            onClick={handleNewProjectClick}
            className="bg-[#F57C00] px-4 py-2 flex gap-2 items-center justify-center rounded-md text-[#000000] text-sm font-bold leading-6 tracking-[0.032px]"
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
