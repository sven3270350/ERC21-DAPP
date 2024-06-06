import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { InputField } from "./input-field";
import { Title } from "./title";
import { DisconnectBtn } from "../Header/disconnect";
import { useAccount } from "wagmi";
import { generateBeneficiaryDetails } from "@/utils/generate-wallet";
import { useState } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

type Project = {
  tokendetails: {
    tokenName: string;
    tokenSymbol: string;
    maxSupply: string;
    initialSupply: string;
  };
  walletAddess: `0x${string}` | undefined;
  devWallet: {
    devBuyTax: string;
    devSellTax: string;
    devWallet: string;
  };
  marketingWallet: {
    marketingBuyTax: string;
    marketingSellTax: string;
    marketingWallet: string;
  };
  poolData: {
    liquidityAmount: string;
    liquidityToken: string;
  };
  status: string;
};

interface Projects {
  [key: string]: Project;
}

type Props = {
  projectId: string | null;
};

const formSchema = z.object({
  tokenName: z.string().min(1, { message: "Required*" }),
  tokenSymbol: z.string().min(1, { message: "Required*" }),
  maxSupply: z.string().min(1, { message: "Required*" }),
  initialSupply: z.string().min(1, { message: "Required*" }),
  devBuyTax: z.string().min(1, { message: "Required*" }),
  devSellTax: z.string().min(1, { message: "Required*" }),
  devWallet: z.string().min(1, { message: "Required*" }),
  marketingBuyTax: z.string().min(1, { message: "Required*" }),
  marketingSellTax: z.string().min(1, { message: "Required*" }),
  marketingWallet: z.string().min(1, { message: "Required*" }),
  liquidity: z.string().min(1, { message: "Required*" }),
  token: z.string({ required_error: "Required*." }),
});

const ProjectForm = ({ projectId }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tokenName: "",
      tokenSymbol: "",
      maxSupply: "",
      initialSupply: "",
      devBuyTax: "",
      devSellTax: "",
      devWallet: "",
      marketingBuyTax: "",
      marketingSellTax: "",
      marketingWallet: "",
      liquidity: "",
      token: "",
    },
  });
  const { isConnected, address } = useAccount();
  const [submitting, setSubmitting] = useState(false);

  function cancel() {
    form.reset();
    form.setValue("maxSupply", "");
    form.setValue("initialSupply", "");
    form.setValue("liquidity", "");
  }
  const generateWallets = async (numWallets: number, tokenAmount: number) => {
    try {
      const res = await axios.post("/api/generate-wallets", {
        numWallets,
        tokenAmount,
      });
      return { data: res.data, success: true };
    } catch (error) {
      console.error("Error generating wallets:", error);
      return { error, success: false };
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);
    try {
      // ✅ This will be type-safe and validated.
      if (!isConnected) {
        console.log("Connect your wallet");
        return;
      }
      if (!projectId) {
        console.log("Project Id is missing");
        return;
      }
      const wallets = await generateWallets(100, 0);

      if (!wallets.success) {
        console.log("Error generating wallets");
        return;
      }
      const data = {
        tokendetails: {
          tokenName: values.tokenName,
          tokenSymbol: values.tokenSymbol,
          maxSupply: values.maxSupply,
          initialSupply: values.initialSupply,
        },
        walletAddess: address,
        devWallet: {
          devBuyTax: values.devBuyTax,
          devSellTax: values.devSellTax,
          devWallet: values.devWallet,
        },
        marketingWallet: {
          marketingBuyTax: values.marketingBuyTax,
          marketingSellTax: values.marketingSellTax,
          marketingWallet: values.marketingWallet,
        },
        poolData: {
          liquidityAmount: values.liquidity,
          liquidityToken: values.token,
        },
        beneficiaryDetails: wallets?.data?.beneficiaryDetails,
        status: "In Progress",
      };

      const projects: Projects = {};

      // Create the key with the desired format
      const projectKey = `project-${projectId}`;

      projects[projectKey] = data;
      console.log(projects);
    } catch (error) {
      console.log("Something went wrong!");
    } finally {
      setSubmitting(false);
    }
  }

  let arr: number[] = [1, 2];
  return (
    <main className="flex flex-col justify-center items-center gap-6 py-[100px]">
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
                name="tokenName"
                label="Token name"
                placeholder="Example..."
              />
              <InputField
                form={form}
                name="tokenSymbol"
                label="Token Symbol"
                placeholder="Example..."
              />
              <InputField
                form={form}
                name="maxSupply"
                type="number"
                label="Max supply"
                placeholder="Enter number"
              />
              <InputField
                form={form}
                name="initialSupply"
                type="number"
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
              {isConnected ? (
                <DisconnectBtn width />
              ) : (
                <ConnectButton.Custom>
                  {({
                    account,
                    chain,
                    openAccountModal,
                    openChainModal,
                    openConnectModal,
                    mounted,
                  }) => {
                    return (
                      <div
                        {...(!mounted && {
                          "aria-hidden": true,
                          style: {
                            opacity: 0,
                            pointerEvents: "none",
                            userSelect: "none",
                          },
                        })}
                      >
                        {(() => {
                          if (!mounted || !account || !chain) {
                            return (
                              <button
                                type="button"
                                onClick={openConnectModal}
                                className="flex justify-center items-center gap-2 bg-[#F57C00] px-8 py-2 rounded-[6px] w-fit cursor-pointer"
                              >
                                <Image
                                  src="/unlink.svg"
                                  width={20}
                                  height={20}
                                  alt="unlink"
                                />
                                <p className="font-bold text-base text-black leading-6">
                                  Connect Wallet
                                </p>
                              </button>
                            );
                          }

                          if (chain.unsupported) {
                            return (
                              <button onClick={openChainModal} type="button">
                                Wrong network
                              </button>
                            );
                          }

                          return (
                            <div style={{ display: "flex", gap: 12 }}>
                              <button
                                className="flex items-center gap-3 border-[#F57C00] px-6 py-2 border rounded-full font-bold text-[#F57C00] text-base text-center leading-6"
                                onClick={openChainModal}
                                type="button"
                              >
                                {chain.hasIcon && (
                                  <div
                                    style={{
                                      background: chain.iconBackground,
                                      width: 12,
                                      height: 12,
                                      borderRadius: 999,
                                      overflow: "hidden",
                                      marginRight: 4,
                                    }}
                                  >
                                    {chain.iconUrl && (
                                      <Image
                                        alt={chain.name ?? "Chain icon"}
                                        src={chain.iconUrl}
                                        width={12}
                                        height={12}
                                      />
                                    )}
                                  </div>
                                )}
                                {chain.name}
                              </button>

                              <button onClick={openAccountModal} type="button">
                                {account.displayName}
                                {account.displayBalance
                                  ? ` (${account.displayBalance})`
                                  : ""}
                              </button>
                            </div>
                          );
                        })()}
                      </div>
                    );
                  }}
                </ConnectButton.Custom>
              )}
            </div>
            <div className="gap-6 border-[#27272A] grid grid-cols-5 pb-6 border-b">
              <InputField
                form={form}
                type="number"
                name="devBuyTax"
                label="Dev buy tax"
                placeholder="e.g 10%"
              />
              <InputField
                form={form}
                type="number"
                name="devSellTax"
                label="Dev sell tax"
                placeholder="e.g 10%"
              />
              <div className="col-span-3">
                <InputField
                  form={form}
                  name="devWallet"
                  label="Dev wallet"
                  placeholder="0x...."
                />
              </div>
              <InputField
                form={form}
                type="number"
                name="marketingBuyTax"
                label="Marketing buy tax"
                placeholder="e.g 10%"
              />
              <InputField
                form={form}
                type="number"
                name="marketingSellTax"
                label="Marketing sell tax"
                placeholder="e.g 10%"
              />
              <div className="col-span-3">
                <InputField
                  form={form}
                  name="marketingWallet"
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
                  name="liquidity"
                  type="number"
                  label="Liquidity"
                  placeholder="Enter number"
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="token"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Token</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-[#27272A] bg-[#18181B] border rounded-[6px] text-[#71717A] placeholder:text-[#71717A]">
                            <SelectValue
                              placeholder="Select"
                              className="placeholder:text-[#71717A]"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="m@example.com">ETH</SelectItem>
                          <SelectItem value="m@google.com">BTC</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={cancel}
                className="font-bold text-[#F57C00] text-sm leading-5"
              >
                Cancel
              </button>
              <Button
                disabled={submitting}
                className="flex items-center gap-[8px] bg-[#27272A] hover:bg-[#F57C00] px-8 py-2 rounded-[6px] font-bold text-[#71717A] text-sm hover:text-black leading-5 transition-all duration-150 ease-in-out group"
              >
                Save Project
                {submitting && (
                  <ClipLoader
                    color="#fff"
                    className="color-[black]"
                    size="16px"
                  />
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <div
        className={classNames(
          {
            "py-6": arr.length == 0,
          },
          "relative flex flex-col border-[#3f3f46] bg-[#18181B] px-6 pt-10 border rounded-[12px] w-[719px]"
        )}
      >
        <div className="top-0 left-0 absolute bg-[#27272A] px-8 py-2 rounded-[63px] -translate-y-1/2 translate-x-[16px]">
          <p className="font-bold text-sm text-white leading-5">
            Transaction Logs
          </p>
        </div>
        {arr?.map((_, index) => (
          <div
            key={index}
            className={classNames(
              {
                "border-b border-[#27272A]": index !== arr.length - 1, // remove border bottom for last element
              },
              "flex justify-start items-center gap-2 text-left py-6"
            )}
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
