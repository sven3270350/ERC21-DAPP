"use client";
import Projects from "@/components/ProjectsList";
import NoProject from "@/components/dashboard/no-projects";
import {useEffect, useState} from "react";

const Page: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("projectData");
    const parsedData: Record<string, any> = data ? JSON.parse(data) : {};
    const projectsArray = Object.values(parsedData) as Project[]; 
    setProjects(projectsArray);
  }, []);

  // TODO: Fetch projects from the server (API asynchronous call)
  return (
    <div className="flex justify-center items-start w-full h-full overflow-auto">
      {projects.length === 0 ? <NoProject /> : <Projects />}
    </div>
  );
};

export default Page;
