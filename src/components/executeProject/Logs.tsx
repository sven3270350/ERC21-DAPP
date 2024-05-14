import React from "react";
import { IBM_Plex_Mono } from "next/font/google";
const myFont = IBM_Plex_Mono({
  subsets: ["latin", "cyrillic", "cyrillic-ext", "latin-ext", "vietnamese"],
  weight: ["400", "700", "200", "300", "500", "600"],
  display: "auto",
});
interface Props {
  componentsIndex: number;
}
const Logs: React.FC<Props> = ({ componentsIndex }) => {
  return (
    <div className="relative  ">
      {" "}
      <div
        className={` h-[300px] pt-10 px-6 pb-6 flex  flex-col w-full ${myFont.className} gap-6 bg-[#09090B] rounded-3xl border border-[#18181B]  `}
      >
        <div className="absolute top-[-20px] left-6  w-24 h-9 rounded-[63px] bg-[#27272A] py-2 px-8 inline-flex justify-center items-center text-sm font-bold ">
          Logs
        </div>
        {componentsIndex >= 0 && (
          <div className="flex text-base font-normal tracking-[0.08px] gap-4">
            <div className=" text-[#71717A] ">May 14, 18:28 UTC</div>
            <div className="text-[#00E676]  ">Funded wallet</div>
            <div>12 ETH</div>
            <a className="text-[#F57C00] underline" href="/execute">
              etherscan
            </a>
          </div>
        )}
        {componentsIndex >= 1 && (
          <div className="flex text-base font-normal tracking-[0.08px] gap-4">
            <div className=" text-[#71717A] ">May 14, 18:28 UTC</div>
            <div className="text-[#00E676]  ">Splited ETHs</div>
            <div>12 ETH</div>
            <a className="text-[#F57C00] underline" href="/execute">
              etherscan
            </a>
          </div>
        )}
        {componentsIndex >= 2 && (
          <div className="flex text-base font-normal tracking-[0.08px] gap-4">
            <div className=" text-[#71717A] ">May 14, 18:28 UTC</div>
            <div className="text-[#00E676]  ">Launched Token</div>

            <a className="text-[#F57C00] underline" href="/execute">
              etherscan
            </a>
          </div>
        )}
        {componentsIndex >= 3 && (
          <div className="flex text-base font-normal tracking-[0.08px] gap-4">
            <div className=" text-[#71717A] ">May 14, 18:28 UTC</div>
            <div className="text-[#00E676]  ">Created Pool</div>

            <a className="text-[#F57C00] underline" href="/execute">
              etherscan
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Logs;
