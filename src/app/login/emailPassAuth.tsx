"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import Image from "next/image";

const FormSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  })
});

type FormData = z.infer<typeof FormSchema>;

export default function LoginForm() {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    const { email } = data;

    try {
      const response: any = await signIn("email", {
        email,
        redirect: false,
      });
      if (!response?.error) {
        router.push("/");
        router.refresh();
      }

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // Process response here
      console.log("Login Successful", response);
      toast({ title: "Login Successful" });
    } catch (error: any) {
      console.error("Login Failed:", error);
      toast({ title: "Login Failed", description: error.message });
    }
  };

  return (
    <>
      <div>
        <div className="flex flex-col justify-center items-center gap-4 mb-4">
          <Image src="/box.svg" alt="box" width={69.63} height={80.01} />
          <h1 className="text-2xl leading-7 font-semibold  ">ERC21 Bot</h1>
        </div>
        <div className="p-8 border border-[#27272A] w-[370px] rounded-xl gap-4 flex flex-col items-center m-auto ">
          <Image src="/login-img.svg" alt="box" width={150} height={150} />
          <div>
            <h2 className="text-xl font-semibold text-white text-center mb-2">Enter Email</h2>
            <p className="text-[#71717A] text-sm font-medium text-center mb-4">
              Enter your email and we’ll send a login link
            </p>
          </div>
          <Form {...form} >
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#A1A1AA] text-sm font-medium">Email</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-[#18181B] border-[#27272A] mt-2 text-white w-[290px] "
                        placeholder="Enter Your Email"
                        {...field}
                        type="text"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {/* <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Provide Password</FormLabel>
                <FormControl>
                  <Input
                    className="text-black"
                    placeholder="Hasło"
                    {...field}
                    type="password"
                  />
                </FormControl>
              </FormItem>
            )}
          /> */}
              <Button
                type="submit"
                className="bg-[#F57C00] w-full mt-4 px-6 py-3 rounded-md text-[#000000] text-base font-bold leading-6 tracking-[0.032px] hover:bg-[#f8a24c]"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Opening...." : "Send"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
