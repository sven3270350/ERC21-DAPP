import React, { useMemo } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useStore } from "@/store";

export const ProjectHeadData: React.FC<{
  project: any;
  projectId: string | undefined;
}> = ({ project, projectId }) => {
  const totalAmount = project?.beneficiaryDetails?.length;
  const handlePublicKeyCopy = () => {
    navigator.clipboard.writeText(
      project?.deployedTokenAddress?.contractAddress
    );
    toast.info("Public Key copied to clipboard");
  };
  const { allProjects } = useStore();
  
  const currProject = useMemo(() => {
    if (!projectId) return null;
    return allProjects.find((project: any) => project?.projectId === projectId);
  }, [allProjects, projectId]);
  console.log("currProject", currProject, allProjects, projectId);
  
  return (
    <div>
      <div className="flex items-center gap-4">
        <p className="font-semibold text-[#F57C00]">
          {project?.tokendetails?.tokenName}
        </p>
        <span className="text-[#71717A]">|</span>
        <div className="flex items-center gap-1">
          <p className="text-[#71717A] text-[12px]">
            {project?.deployedTokenAddress?.contractAddress}
          </p>
          <Image
            src={"/Images/New Project/copy-01.svg"}
            width={14}
            height={14}
            alt="Copy"
            className="cursor-pointer"
            onClick={handlePublicKeyCopy}
          />
        </div>
        <div className="text-center">
          <div className="flex items-center gap-1">
            <Image
              src={"/coins-01.svg"}
              width={14}
              height={14}
              alt="Maxsupply"
              className="cursor-pointer"
            />
            <span className="text-sm text-white">
              {project?.tokendetails?.maxSupply}
            </span>
          </div>
          <span className="mt-1 text-[#71717A] text-sm">MaxSupply</span>
        </div>
        <span className="border-[#71717A] border-[1px] h-8"></span>
        <div className="text-center">
          <div
            className={`flex h-[22px] w-24 py-1 justify-center ${currProject?.status === "Created" ? "text-[#FFC400] bg-[#FFC400]" : currProject?.status === "In Progress" ? "text-[#2979FF] bg-[#2979FF]" : "text-[#00E676] bg-[#00E676]"} text-xs font-semibold tracking-[0.06px] items-center px-[6px] bg-opacity-10 rounded gap-1`}
          >
            <Image
              src={`/${currProject?.status === "Created" ? "nano-technology" : currProject?.status === "In Progress" ? "codesandbox" : "rocket-01"}.svg`}
              alt="icon"
              width={14}
              height={14}
            />
            {currProject?.status}
          </div>
          <p className="mt-1 font-medium text-[#71717A] text-xs tracking-[0.06px]">
            Project Status
          </p>
        </div>
        <span className="border-[#71717A] border-[1px] h-8"></span>
        <div className="text-center">
          <div className="flex items-center gap-1">
            <Image
              src={"/wallet-01-white.svg"}
              width={14}
              height={14}
              alt="Copy"
              className="cursor-pointer"
            />
            <span className="text-sm text-white">{totalAmount}</span>
          </div>
          <span className="mt-1 text-[#71717A] text-sm">Wallets</span>
        </div>
      </div>
    </div>
  );
};
export default ProjectHeadData;
