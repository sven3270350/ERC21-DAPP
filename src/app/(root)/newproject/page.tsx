"use client";
import { ProjectForm } from "@/components/project-creation";
import { useSearchParams } from "next/navigation";

export default function Newprojecthome() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  return (
    <div className="bg-[#09090B] w-full">
      <ProjectForm projectId={projectId} />
    </div>
  );
}
