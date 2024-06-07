"use client";
import { ProjectFormWrapper } from "@/components/project-creation";
import { Suspense } from "react";

export default function Newprojecthome() {
  return (
    <div className="bg-[#09090B] w-full">
      <Suspense fallback={<div>Loading...</div>}>
        <ProjectFormWrapper />
      </Suspense>
    </div>
  );
}
