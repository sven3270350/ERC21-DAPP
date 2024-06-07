import React from "react";
import { ProjectForm } from "./project-form";
import { useSearchParams } from "next/navigation";

type Props = {};

const ProjectFormWrapper = (props: Props) => {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  return (
    <div>
      <ProjectForm projectId={projectId} />
    </div>
  );
};

export { ProjectFormWrapper };
