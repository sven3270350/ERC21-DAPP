import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LoginForm from "./emailPassAuth";
import WalletAuth from "./walletAuth";

export default async function LoginPage() {
  const session = await getServerSession();

  if (session) {
    redirect("/");
  }

  return (
    <section className="bg-black h-screen flex items-center justify-center">
      <div className="w-[600px]">
        <LoginForm />
        <WalletAuth />
      </div>
    </section>
  );
}
