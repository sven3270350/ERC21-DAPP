import React from "react";
import ProjectCard from "../ProjectCard";
import { Project } from "@/types/project";

interface ProjectsProps {
  projects: Project[];
}

const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  return (
    <div className="flex flex-col gap-6 p-6 w-full">
      <div className="flex justify-between">
        <div className="font-bold text-[22px] leading-7">Your Projects</div>
      </div>
      <div className="gap-4 grid grid-cols-3">
        {[...projects].reverse().map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>
    </div>
  );
};

export default Projects;
