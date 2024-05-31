"use client";

import Projects from "@/components/ProjectsList";
import NoProject from "@/components/dashboard/no-projects";
import React, { useEffect, useState } from "react";
import { Project } from "@/types/project";

const Page: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const data = localStorage.getItem('projectData');
    const parsedData: Record<string, any> = data ? JSON.parse(data) : {};
    const projectsArray = Object.values(parsedData) as Project[]; 
    console.log("projectsArray", projectsArray);
    setProjects(projectsArray);
  }, []);

  return (
    <div className="flex w-full h-full items-start overflow-auto justify-center">
      {projects.length === 0 ? (
        <NoProject />
      ) : (
        <Projects projectData={projects} />
      )}
    </div>
  );
};

export default Page;
