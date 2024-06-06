import Image from 'next/image'
import React, { useState } from 'react'

export const Tabs = ({ setStatus, status }) => {
  const getImageSrc = (state: string) => {
    switch (state) {
      case "Buy":
        return status === "Buy" ? "/money-bag-active.svg" : "/money-bag.svg";
      case "Sell":
        return status === "Sell" ? "/give-pill-active.svg" : "/give-pill.svg";
      case "Transfer":
        return status === "Transfer" ? "/arrow-data-active.svg" : "/arrow-data.svg";
      default:
        return "";
    }
  };

  return (
    <div className='mb-5'>
      <div className="flex gap-2 transition-all duration-200 ease-linear m-auto rounded-md w-[386px] bg-[#18181B] px-3 py-3">
        {["Buy", "Sell", "Transfer"].map((state) => (
          <div
            key={state}
            className={`flex items-center gap-2 px-8 py-1 ${status === state
              ? "text-[#F57C00] border border-[#F57C00] bg-[#F57C00] bg-opacity-10"
              : "text-[#71717A]"
              } rounded-md text-base font-semibold cursor-pointer tracking-[0.07px]`}
            onClick={() => setStatus(state)}
          >
            <Image
              src={getImageSrc(state)}
              width={20}
              height={20}
              alt="icon"
            />
            {state}
          </div>
        ))}
      </div>
    </div>
  )
}
