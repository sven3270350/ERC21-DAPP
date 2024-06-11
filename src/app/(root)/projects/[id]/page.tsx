"use client";

import { Projects } from "@/components/Projects/Projects";
import { ProjectForm } from "@/components/project-creation";
import { useEffect, useState } from "react";

type Props = {
  params: {
    id: string;
  };
};

export default function Project({ params }: Props) {
  const projectId = params.id;
  const [project, setProject] = useState<any>(null);

  const fetchProject = () => {
    if (typeof window === "undefined") return;
    const data = localStorage.getItem("allProjects");
    const parsedData: Record<string, any> = data ? JSON.parse(data) : [];
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
    return project;
  };

  useEffect(() => {
    const project = fetchProject();
    if (!project) return;
    setProject(project);
    console.log(project);
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
      {project && project?.status === "Completed" ? (
        <Projects projectData={project} />
      ) : (
        <ProjectForm projectId={projectId} data={project} />
      )}
    </div>
  );
}
