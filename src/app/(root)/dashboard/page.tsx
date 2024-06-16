"use client";

import React, { useEffect, useState } from "react";
import Projects from "@/components/ProjectsList";
import NoProject from "@/components/dashboard/no-projects";
import { Project } from "@/types/project";
import { useStore } from "@/store";

const Page: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const {allProjects, setAllProjects} = useStore();
  useEffect(() => {
    const data = localStorage.getItem("allProjects");
    if (data) {
      try {
        const parsedData: { [key: string]: Project }[] = JSON.parse(data);
        const projectsArray = parsedData.map((item) => Object.values(item)[0]);
        setProjects(projectsArray);
        setAllProjects(projectsArray);
      } catch (error) {
        console.error("Error parsing JSON data:", error);
      }
    }
  }, []);

  return (
    <div className="flex justify-center items-start w-full h-full overflow-auto">
      {projects.length === 0 ? <NoProject /> : <Projects projects={projects} />}
    </div>
  );
};

export default Page;
