import {
    Form
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { InputField } from "./input-field";
import { Title } from "./title";

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
    <main className="flex justify-center pt-14">
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
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </main>
  );
};

export { ProjectForm };
