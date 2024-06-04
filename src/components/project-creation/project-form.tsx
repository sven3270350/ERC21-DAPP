import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { InputField } from "./input-field";
import { Title } from "./title";
import classNames from "classnames";

type Props = {};

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

const ProjectForm = (props: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <main className="flex flex-col justify-center items-center gap-6 py-14">
      <div className="flex flex-col gap-6 border-[#18181B] p-6 border rounded-[12px]">
        <h1 className="font-bold text-[22px] text-center text-white uppercase leading-7">
          New project
        </h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6 max-w-[719px]"
          >
            <div>
              <Title text="Token Details" />
              <Title
                text="Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam"
                para={true}
              />
            </div>
            <div className="gap-6 border-[#27272A] grid grid-cols-4 pb-6 border-b">
              <InputField
                form={form}
                name="username"
                label="Token name"
                placeholder="Example..."
              />
              <InputField
                form={form}
                name="username"
                label="Token Symbol"
                placeholder="Example..."
              />
              <InputField
                form={form}
                name="username"
                label="Max supply"
                placeholder="Enter number"
              />
              <InputField
                form={form}
                name="username"
                label="Initial supply"
                placeholder="Enter number"
              />
            </div>
            <div>
              <Title text="Your project wallet" />
              <Title
                text="Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam"
                para={true}
              />
            </div>
            <div className="flex flex-col items-center gap-4 border-[#27272A] p-4 border border-dashed rounded-[12px]">
              <h1 className="font-semibold text-lg leading-7">
                Deployer Wallet
              </h1>
              <div className="flex justify-center items-center gap-2 bg-[#F57C00] px-8 py-2 rounded-[6px] w-fit">
                <Image src="/unlink.svg" width={20} height={20} alt="unlink" />
                <p className="font-bold text-base text-black leading-6">
                  Connect Wallet
                </p>
              </div>
            </div>
            <div className="gap-6 border-[#27272A] grid grid-cols-5 pb-6 border-b">
              <InputField
                form={form}
                name="username"
                label="Dev buy tax"
                placeholder="e.g 10%"
              />
              <InputField
                form={form}
                name="username"
                label="Dev sell tax"
                placeholder="e.g 10%"
              />
              <div className="col-span-3">
                <InputField
                  form={form}
                  name="username"
                  label="Dev wallet"
                  placeholder="0x...."
                />
              </div>
              <InputField
                form={form}
                name="username"
                label="Marketing buy tax"
                placeholder="e.g 10%"
              />
              <InputField
                form={form}
                name="username"
                label="Marketing sell tax"
                placeholder="e.g 10%"
              />
              <div className="col-span-3">
                <InputField
                  form={form}
                  name="username"
                  label="Marketing wallet"
                  placeholder="0x...."
                />
              </div>
            </div>
            <div>
              <Title text="Setup pool" />
              <Title
                text="Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam"
                para={true}
              />
            </div>
            <div className="gap-6 border-[#27272A] grid grid-cols-4 pb-6 border-b">
              <div className="col-span-3">
                <InputField
                  form={form}
                  name="username"
                  label="Liquidity"
                  placeholder="Enter number"
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <button
                type="button"
                className="font-bold text-[#F57C00] text-sm leading-5"
              >
                Cancel
              </button>
              <Button className="flex items-center gap-[3px] bg-[#F57C00] px-8 py-2 rounded-[6px] font-bold text-black text-sm leading-5">
                <Image
                  src="/rocket-black.svg"
                  width={20}
                  height={20}
                  alt="deploy"
                />
                Deploy Token
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <div className="relative flex flex-col border-[#3f3f46] bg-[#18181B] px-6 pt-10 border rounded-[12px] w-[719px]">
        <div className="top-0 left-0 absolute bg-[#27272A] px-8 py-2 rounded-[63px] -translate-y-1/2 translate-x-[16px]">
          <p className="font-bold text-sm text-white leading-5">
            Transaction Logs
          </p>
        </div>
        {[1, 2]?.map((_, index) => (
          <div
            key={index}
            className={classNames({
                "border-b border-[#27272A]" : index !== 1 // remove border bottom for last element
            },"flex justify-start items-center gap-2 text-left py-6")}
          >
            <p className="font-[400] text-[#71717A] text-sm leading-5">
              May 14, 18:58 UTC
            </p>
            <p className="font-[400] text-[#00E676] text-sm leading-5">
              token deployed
            </p>
            <p className="font-[400] text-[#F57C00] text-sm underline leading-5">
              etherscan
            </p>
          </div>
        ))}
      </div>
    </main>
  );
};

export { ProjectForm };
