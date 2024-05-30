import React, { useState } from "react";
import { Project } from "@/types/project";
import ProjectCard from "../ProjectCard";

interface ProjectsProps {
  projectData: Project[];
}

const Projects: React.FC<ProjectsProps> = ({ projectData }) => {
  const [status, setStatus] = useState<string>("");

  const filteredProjects = status
    ? projectData.filter((project) => project.status === status)
    : projectData;
  console.log("filteredProjects", filteredProjects);

  return (
    <div className="flex flex-col w-full p-6 gap-6">
      <div className="flex justify-between">
        <div className="text-[22px] font-bold leading-7">Your Projects</div>
        <div className="flex gap-2 transition-all duration-200 ease-linear">
          {["Created", "In Progress", "Launched"].map((state) => (
            <div
              key={state}
              className={`px-3 py-2 ${status === state
                ? "text-[#F57C00] border border-[#F57C00] bg-[#F57C00] bg-opacity-10"
                : "text-[#71717A]"
                } rounded-md text-sm font-semibold cursor-pointer tracking-[0.07px]`}
              onClick={() => setStatus(state)}
            >
              {state}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        {filteredProjects.map((project, index) => (
          <ProjectCard
            key={index}
            title={project?.projectName}
            fundingWallet={project?.fundingWallet?.publicKey}
            maxSupply={project?.tokenDetails?.maxSupply}
            status={project?.status}
            adminWallet={project?.adminWallet?.publicKey}
            wallets={
              project?.beneficiaryDetails?.wallets ?
                project?.beneficiaryDetails?.wallets.reduce(
                  (total, wallet) => total + parseFloat(wallet?.amount),
                  0
                ) : 0
            }
          />
        ))}
      </div>
    </div>
  );
};


export default Projects;
