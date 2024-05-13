import React, { useState } from "react";

import { Project } from "../../types/project";
import ProjectCard from "../ProjectCard";
interface ProjectsProps {
  projectData: Project[];
}
const Projects = ({ projectData }: ProjectsProps) => {
  const [status, setStatus] = useState<string>("");
  const filteredProjects = status
    ? projectData.filter((project) => project.status === status)
    : projectData;
  return (
    <div className="flex flex-col w-full p-6 gap-6 ">
      <div className="flex justify-between">
        {" "}
        <div className="text-[22px] font-bold leading-7 ">
          Your Projects
        </div>{" "}
        <div className="flex gap-2 transition-all duration-200 ease-linear ">
          <div
            className={`px-3 py-2  ${status === "Created" ? "text-[#F57C00] border border-[#F57C00] bg-[#F57C00] bg-opacity-10 " : "text-[#71717A]"}  rounded-md text-sm font-semibold cursor-pointer tracking-[0.07px] `}
            onClick={() => setStatus("Created")}
          >
            Created
          </div>
          <div
            className={`px-3 py-2  ${status === "In Progress" ? "text-[#F57C00] border border-[#F57C00] bg-[#F57C00] bg-opacity-10 " : "text-[#71717A]"}  rounded-md text-sm font-semibold cursor-pointer tracking-[0.07px] `}
            onClick={() => setStatus("In Progress")}
          >
            In Progress
          </div>
          <div
            className={`px-3 py-2  ${status === "Launched" ? "text-[#F57C00] border border-[#F57C00] bg-[#F57C00] bg-opacity-10 " : "text-[#71717A]"}  rounded-md text-sm font-semibold cursor-pointer tracking-[0.07px] `}
            onClick={() => setStatus("Launched")}
          >
            Launched
          </div>
        </div>{" "}
      </div>
      <div className="flex flex-wrap gap-4">
        {filteredProjects.map((project: Project, index: number) => (
          <ProjectCard
            key={index}
            title={project.title}
            fundingWallet={project.fundingWallet}
            maxSupply={project.maxSupply}
            status={project.status}
            teamWallet={project.teamWallet}
            wallets={project.wallets}
          />
        ))}
      </div>
    </div>
  );
};

export default Projects;
