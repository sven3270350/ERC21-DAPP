"use client";

import { Projects } from "@/components/Projects/Projects";
import { ProjectForm } from "@/components/project-creation";
import { useEffect, useState } from "react";

type Props = {
  params: {
    id: string;
  };
};

type ProjectObject = {
  [key: string]: any; // Use `any` or the specific type of the value if known
};


export default function Project({ params }: Props) {
  const projectId = params.id;
  const [project, setProject] = useState<any>(null);
  const [projectData, setProjectData] = useState<any>(null);
  const fetchProject = () => {
    if (typeof window === "undefined") return;
    const data = localStorage.getItem("allProjects");
    const parsedData: Record<string, any> = data ? JSON.parse(data) : [];
    function findProjectById(projects: any, projectId: string): ProjectObject | undefined {
      return projects.find((project : any) => project.hasOwnProperty(projectId));
    }
    const foundProject = findProjectById(parsedData, projectId);
    console.log(foundProject, "foundProject");
    
    const projectsArray = parsedData.map((obj: any) => {
      const key = Object.keys(obj)[0];
      const project = obj[key];
      return {
        ...project,
        projectId: key,
      };
    });
    const project = projectsArray.find(
      (project: any) => project.projectId === projectId
    );
    if (!project) {
      console.error("Project not found");
      return null;
    }
    const res = {
      project,
      foundProject,
    }
    return res;
  };

  useEffect(() => {
    const data = fetchProject();
    if (!data?.project || !data?.foundProject) return;
    setProject(data?.project);
    setProjectData(data?.foundProject);
    const handleBeforeUnload = (e: any) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div>
      {project && project?.status ? (
        <ProjectForm projectId={projectId} data={project} objectData={projectData} />
      ) : (
        <Projects />
      )}
    </div>
  );
}
