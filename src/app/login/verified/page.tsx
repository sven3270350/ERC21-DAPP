"use client";
import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  // const session = getServerSession(authOptions);
  const redirectFunc = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <div className="flex flex-col items-center gap-4 mb-4">
        <Image src="/box.svg" alt="box" width={70} height={80} />
        <h1 className="text-2xl font-semibold">ERC21 Bot</h1>
      </div>
      <div className="p-8 border border-[#27272A] w-[370px] rounded-xl flex flex-col items-center gap-4">
        <Image src="/sentEmail.svg" alt="email sent" width={150} height={150} />
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Email Sent</h2>
          <p className="text-sm font-medium text-[#71717A] mb-4">
            An authentication link was sent to your inbox
          </p>
        </div>
        <div className="flex gap-4 w-full">
          <Button
            onClick={redirectFunc}
            className="flex-1 bg-[#09090b] rounded-md text-[#F57C00] text-base font-bold hover:bg-[#f8a24c] hover:text-[#09090b] border border-solid border-[#F57C00]"
          >
            Edit Email
          </Button>
          <Button
            onClick={redirectFunc}
            className="flex-1 bg-[#09090b] rounded-md text-[#F57C00] text-base font-bold hover:bg-[#f8a24c] hover:text-[#09090b] border border-solid border-[#F57C00]"
          >
            Resend
          </Button>
        </div>
      </div>
    </div>
  );
}
