"use client";
import MultiToken from "@/components/multisendForm";
import React from "react";

const Page: React.FC = () => {
  return (
    <div className="flex justify-center items-start w-full h-full overflow-auto">
      <MultiToken />
    </div>
  );
};

export default Page;
