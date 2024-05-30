import { getServerSession } from "next-auth";
import { getProviders } from "next-auth/react";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import LoginForm from "./emailPassAuth";
import WalletAuth from "./walletAuth";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  const providers = await getProviders();
  
  if (session) {
    redirect("/dashboard");
  }

  return (
    <section className="bg-black h-screen flex items-center justify-center">
      <div className="w-[600px]">
        <LoginForm />
      </div>
    </section>
  );
}
