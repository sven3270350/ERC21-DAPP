"use client";

import Projects from "@/components/ProjectsList";
import NoProject from "@/components/dashboard/no-projects";
import projectData from "../../../constants/projects.json";
import React, { useEffect, useState } from "react";
import { Project } from "@/types/project";

const Page = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    setProjects(projectData);
  }, []);

  return (
    <div className="flex w-full h-full items-center overflow-auto justify-center">
      {projects.length === 0 ? (
        <NoProject />
      ) : (
        <Projects projectData={projects} />
      )}
    </div>
  );
};

export default Page;
