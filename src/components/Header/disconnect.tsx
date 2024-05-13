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

type Props = {};

export const DisconnectBtn = (props: Props) => {
  const { address, isDisconnected } = useAccount();
  const { disconnect } = useDisconnect();

  if (isDisconnected) {
    toast.error("Wallet Disconnected");
  }

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <button className="flex  px-6 py-2 text-[#F57C00] text-center text-base font-bold leading-6 tracking-[0.032px] items-center gap-2 rounded-md border border-[#F57C00]">
            <Image src={"/wallet-01.svg"} alt="wallet" width={20} height={20} />
            <p>
              {address?.substring(0, 3) +
                "...." +
                address?.substring(address.length - 4)}
            </p>
            <Image
              src={"/more-horizontal-circle-01.svg"}
              className="ml-2"
              alt="menu"
              width={20}
              height={20}
            />
          </button>
        </PopoverTrigger>

        <PopoverContent className="  bg-opacity-10 hover:bg-opacity-20 w-[197px] text-white bg-[#F44336] rounded-md p-3 mt-3 ">
          <button
            type="button"
            onClick={() => {
              disconnect();
            }}
            className="   w-full font-[700] text-[#F44336] text-[16px] flex justify-center gap-2 items-center "
          >
            <Image src={"/unlink-03.svg"} alt="unlink" width={20} height={20} />
            <p>Disconnect</p>
          </button>
        </PopoverContent>
      </Popover>
    </div>
  );
};
