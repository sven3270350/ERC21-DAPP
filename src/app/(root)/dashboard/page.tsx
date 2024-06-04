import Projects from "@/components/ProjectsList";
import NoProject from "@/components/dashboard/no-projects";
import React from "react";

const Page: React.FC = () => {
  let projects = [1, 2, 3];
  // TODO: Fetch projects from the server (API asynchronous call)
  return (
    <div className="flex justify-center items-start w-full h-full overflow-auto">
      {projects.length === 0 ? <NoProject /> : <Projects />}
    </div>
  );
};

export default Page;
