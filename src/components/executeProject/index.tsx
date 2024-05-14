"use client";
import Image from "next/image";
import React, { useState } from "react";
import FundMainWallet from "./fundMainWallet";
import Beneficiaries from "./Beneficiaries";
import LaunchToken from "./Launch";
import CreatePool from "./CreatePool";
import Logs from "./Logs";

const ExecuteProject = () => {
  const [componentsIndex, setComponentsIndex] = useState<number>(0);

  const handleNext = () => {
    setComponentsIndex((i) => i + 1);
  };

  const handlePrev = () => {
    setComponentsIndex((i) => i - 1);
  };

  const components = [FundMainWallet, Beneficiaries, LaunchToken, CreatePool];
  const Component = components[componentsIndex];
  return (
    <div className="w-full flex flex-col justify-center items-center p-8 ">
      <div className="flex flex-col w-[580px] gap-4">
        <div className=" flex flex-col gap-8 p-6 rounded-xl border border-[#27272A] ">
          <h1 className="text-[22px] font-bold leading-7 text-center ">
            Execute Project
          </h1>

          <div className="inline-flex gap-1  items-center ">
            <div className="flex flex-col gap-3 items-center ">
              <div
                className={`${componentsIndex >= 1 ? "bg-[#F57C00]" : ""}  transition-all duration-100 ease-in-out  flex justify-center items-center border  border-[#27272A] rounded-md p-[14px]`}
              >
                <Image
                  className=" transition-all duration-100 ease-in-out "
                  src={`/${componentsIndex >= 1 ? "tick" : "money-bag"}-02.svg`}
                  alt="fund"
                  width={22}
                  height={22}
                />
              </div>
              <h1 className="text-sm font-medium ">Fund wallet</h1>
            </div>

            <div className="w-16 h-[1px] bg-[#3F3F46] mt-[-26px] "></div>
            <div className="flex flex-col gap-3 items-center ">
              <div
                className={` ${componentsIndex >= 2 ? "bg-[#F57C00]" : ""}  transition-all duration-100 ease-in-out flex justify-center items-center border border-[#27272A] rounded-md p-[14px]`}
              >
                <Image
                  className=" transition-all duration-100 ease-in-out "
                  src={`/${componentsIndex >= 2 ? "tick-02.svg" : `${componentsIndex == 1 ? "user-group-orange.svg" : "user-group-dull.svg"}`}`}
                  alt="fund"
                  width={22}
                  height={22}
                />
              </div>
              <h1 className="text-sm font-medium ">Beneficiaries</h1>
            </div>

            <div className="w-16 h-[1px] bg-[#3F3F46] mt-[-26px] "></div>
            <div className="flex flex-col gap-3 items-center ">
              <div
                className={` ${componentsIndex >= 3 ? "bg-[#F57C00]" : ""}  transition-all duration-100 ease-in-out flex justify-center items-center border border-[#27272A] rounded-md p-[14px]`}
              >
                <Image
                  className=" transition-all duration-100 ease-in-out"
                  src={`/${componentsIndex >= 3 ? "tick-02" : `${componentsIndex == 2 ? "rocket-01-orange" : "rocket-01-dull"}`}.svg`}
                  alt="fund"
                  width={22}
                  height={22}
                />
              </div>
              <h1 className="text-sm font-medium ">Launch token</h1>
            </div>

            <div className="w-16 h-[1px] bg-[#3F3F46] mt-[-26px] "></div>

            <div className="flex flex-col gap-3 items-center ">
              <div
                className={`  flex justify-center items-center border border-[#27272A] rounded-md p-[14px]`}
              >
                <Image
                  className=" transition-all duration-100 ease-in-out"
                  src={`/${componentsIndex == 3 ? "pool-orange" : "pool"}.svg`}
                  alt="fund"
                  width={22}
                  height={22}
                />
              </div>
              <h1 className="text-sm font-medium ">Create pool</h1>
            </div>
          </div>
          <div className="flex justify-between "></div>
        </div>

        <div>
          <Component onNext={handleNext} onPrev={handlePrev} />
        </div>
      </div>
      <div className="w-full mt-[216px] ">
        <Logs componentsIndex={componentsIndex} />
      </div>
    </div>
  );
};

export default ExecuteProject;
