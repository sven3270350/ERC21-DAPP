import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProviders } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  return (
    <section className="bg-black h-screen flex items-center justify-center">
      <div className="w-[600px] text-bold">
        There is some error while sign in. Please go to <Link href="/login" className="text-[#F57C00]">login</Link> page again.
      </div>
    </section>
  );
}
