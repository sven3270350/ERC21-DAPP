import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProviders } from "next-auth/react";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  
  return (
    <section className="bg-black h-screen flex items-center justify-center">
      <div className="w-[600px] text-bold">
        Your email successfully verified.
      </div>
    </section>
  );
}
