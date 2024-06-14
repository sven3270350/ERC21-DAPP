"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { v4 as uuidv4 } from 'uuid';
import { ProjectHeadData } from "./ProjectHeadData";

const Header: React.FC<{ project?: any }> = () => {
  // const { isConnected, address } = useAccount();
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const isDashboardRoute = pathname === "/dashboard" || pathname === "/newproject";
  const projectId = pathname.split("/")[1] === "projects" ? pathname.split("/")[2] : undefined;
  
   const handleNewProjectClick = () => {
    const newProjectId = uuidv4();
    router.push(`/newproject?projectId=${newProjectId}`);
  };

  return (
    <div className="top-0 left-[250px] z-50 fixed bg-[#0F0F11] px-6 pt-4 w-[calc(100%-250px)]">
      <div className="flex justify-between items-center pb-3 max-w-full-xl self-stretch">
      {!isDashboardRoute && <ProjectHeadData projectId={projectId} />}
        <div className="flex gap-4 ml-auto">
          <button
            type="button"
            className="flex items-center gap-2 border-[#F57C00] px-4 py-2 border rounded-md font-bold text-[#F57C00] text-center text-sm leading-6"
          >
            <Image src={"/user.svg"} alt="wallet" width={20} height={20} />
            {session?.user?.email}
            <Image src={"/dots.svg"} alt="wallet" width={20} height={20} />
          </button>
          <button
            onClick={handleNewProjectClick}
            className="flex justify-center items-center gap-2 bg-[#F57C00] px-4 py-2 rounded-md font-bold text-[#000000] text-sm leading-6 tracking-[0.032px]"
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
