import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { v4 as uuidv4 } from 'uuid';

const NoProject = () => {
  const router = useRouter();
  const handleNewProjectClick = () => {
    const newProjectId = uuidv4();
    router.push(`/newproject?projectId=${newProjectId}`);
  };

  return (
    <div className="p-8 mt-2 flex flex-col max-w-[357px] border border-[#71717A] rounded-xl gap-4 items-center  ">
      <Image
        src={"/connection-lost 1.svg"}
        alt="default image"
        width={186}
        height={167}
      />
      <div className="flex-col">
        <h1 className="text-[28px] text-center font-bold leading-9 tracking-[-0.28px]">
          There's no project yet!
        </h1>
        <p className="mt-3 text-sm font-medium text-center ">
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
        </p>
        <button
          onClick={handleNewProjectClick}
          className="bg-[#F57C00] w-full mt-4 px-6 py-3 flex gap-2 items-center justify-center rounded-md text-[#000000] text-base font-bold leading-6 tracking-[0.032px] ">
          <Image src={"/plus.svg"} alt="plus" width={20} height={20} /> New
          Project
        </button>
      </div>
    </div>
  );
};

export default NoProject;
