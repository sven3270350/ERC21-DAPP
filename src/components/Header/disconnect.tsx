"use client";
import { useAccount, useDisconnect } from "wagmi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { signOut } from "next-auth/react";
import Image from "next/image";

type Props = {
  width?: boolean;
};

export const DisconnectBtn = (props: Props) => {
  const { address, isDisconnected } = useAccount();
  const { disconnect } = useDisconnect();

  if (isDisconnected) {
    toast.error("Wallet Disconnected");
  }

  return (
    // <div className={`${props.width ? "w-full" : ""}`}>
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={`${props.width ? "w-full" : ""} flex items-center justify-between gap-2 border-[#F57C00] px-6 py-2 border rounded-md font-bold text-[#F57C00] text-base text-center leading-6 tracking-[0.032px]`}
        >
          <div className="flex items-center gap-2">
            <Image src={"/wallet-01.svg"} alt="wallet" width={20} height={20} />
            <p>
              {address?.substring(0, 3) +
                "...." +
                address?.substring(address.length - 4)}
            </p>
          </div>
          <Image
            src={"/more-horizontal-circle-01.svg"}
            className="ml-2"
            alt="menu"
            width={20}
            height={20}
          />
        </button>
      </PopoverTrigger>

      <PopoverContent className="bg-[#F44336] bg-opacity-10 hover:bg-opacity-20 mt-3 p-3 rounded-md w-[197px] text-white">
        <button
          type="button"
          onClick={() => {
            disconnect();
          }}
          className="flex justify-center items-center gap-2 w-full font-[700] text-[#F44336] text-[16px]"
        >
          <Image src={"/unlink-03.svg"} alt="unlink" width={20} height={20} />
          <p>Disconnect</p>
        </button>
      </PopoverContent>
    </Popover>
    // </div>
  );
};
