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
import { useEffect, useState } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { useSession } from "next-auth/react";
import { ExtendedUser } from "@/types/user";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

import { DeployToken } from "../executeProject/deploy-token";

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
  data?: any;
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
  tokenAmountA: z.string().min(1, { message: "Required*" }),
  tokenAmountB: z.string().min(1, { message: "Required*" }),
  tokenA: z.string({ required_error: "Required*." }),
  tokenB: z.string({ required_error: "Required*." }),
});

const ProjectForm = ({ projectId, data }: Props) => {
  const session = useSession();
  const userId = (session?.data?.user as ExtendedUser)?.id;
  const router = useRouter();
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
      tokenAmountA: "",
      tokenAmountB: "",
      tokenA: "",
      tokenB: "",
    },
  });
  const { isConnected, address } = useAccount();
  const [submitting, setSubmitting] = useState(false);
  const [price, setPrice] = useState(0);

  function cancel() {
    form.reset();
    form.setValue("maxSupply", "");
    form.setValue("initialSupply", "");
    form.setValue("tokenAmountA", "");
    form.setValue("tokenAmountB", "");
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
    if (!userId) {
      console.log("User ID is missing");
      return;
    }
    try {
      setSubmitting(true);
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
          // liquidityAmount: values.liquidity,
          // liquidityToken: values.token,
          tokenAmountA: values.tokenAmountA,
          tokenAmountB: values.tokenAmountB,
          liquidityToken: values.tokenB,
          liquidityAmount: values.tokenAmountB,
        },
        beneficiaryDetails: wallets?.data?.beneficiaryDetails,
        status: "In Progress",
      };

      const projects: Projects = {};

      // Create the key with the desired format
      const projectKey = `project-${projectId}`;

      projects[projectKey] = data;
      // console.log(projects);

      // Save the data to the database
      const res: any = await axios.post("/api/project", {
        userId,
        projectData: projects,
      });
      if (res?.error) {
        console.log("Error saving project data");
        return;
      }

      // Save the data to loal storage
      if (typeof window !== "undefined") {
        const storedProjectsString = localStorage.getItem("allProjects");
        const storedProjects: Array<Record<string, any>> = storedProjectsString
          ? JSON.parse(storedProjectsString)
          : [];
        console.log(storedProjects);
        const projectIds = storedProjects.map((project) => {
          // Extract the project ID
          const projectId = Object.keys(project)[0];
          return projectId;
        });
        const isProjectIdExisting = projectIds.includes(`project-${projectId}`);
        if (isProjectIdExisting) {
          console.log("Project ID already exists");
          return;
        }
        storedProjects.push(projects);
        localStorage.setItem("allProjects", JSON.stringify(storedProjects));
      }
      router.push(`/`);
    } catch (error) {
      console.log("Something went wrong!");
    } finally {
      setSubmitting(false);
    }
  }

  const tokenAmountA = form.watch("tokenAmountA");
  const tokenAmountB = form.watch("tokenAmountB");

  useEffect(() => {
    function calculateTokenPrice() {
      const tokenAamount = parseFloat(form.getValues("tokenAmountA"));
      const tokenBamount = parseFloat(form.getValues("tokenAmountB"));

      if (!isNaN(tokenAamount) && !isNaN(tokenBamount) && tokenAamount > 0) {
        setPrice(tokenBamount / tokenAamount);
        console.log(tokenBamount / tokenAamount);
      }
    }

    calculateTokenPrice();
  }, [tokenAmountA, tokenAmountB]);

  let arr: number[] = [1, 2];

  useEffect(() => {
    if (!data) return;
    form.setValue("tokenName", data.tokendetails.tokenName);
    form.setValue("tokenSymbol", data.tokendetails.tokenSymbol);
    form.setValue("maxSupply", data.tokendetails.maxSupply);
    form.setValue("initialSupply", data.tokendetails.initialSupply);
    form.setValue("devBuyTax", data.devWallet.devBuyTax);
    form.setValue("devSellTax", data.devWallet.devSellTax);
    form.setValue("devWallet", data.devWallet.devWallet);
    form.setValue("marketingBuyTax", data.marketingWallet.marketingBuyTax);
    form.setValue("marketingSellTax", data.marketingWallet.marketingSellTax);
    form.setValue("marketingWallet", data.marketingWallet.marketingWallet);
    form.setValue("tokenAmountB", data.poolData.liquidityAmount);
    form.setValue("tokenB", data.poolData.liquidityToken);
  }, []);

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
                disabled={data?.status === "In Progress"}
                form={form}
                name="tokenName"
                label="Token name"
                placeholder="Example..."
              />
              <InputField
                disabled={data?.status === "In Progress"}
                form={form}
                name="tokenSymbol"
                label="Token Symbol"
                placeholder="Example..."
              />
              <InputField
                disabled={data?.status === "In Progress"}
                form={form}
                name="maxSupply"
                type="number"
                label="Max supply"
                placeholder="Enter number"
              />
              <InputField
                disabled={data?.status === "In Progress"}
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
                disabled={data?.status === "In Progress"}
                form={form}
                type="number"
                name="devBuyTax"
                label="Dev buy tax"
                placeholder="e.g 10%"
              />
              <InputField
                disabled={data?.status === "In Progress"}
                form={form}
                type="number"
                name="devSellTax"
                label="Dev sell tax"
                placeholder="e.g 10%"
              />
              <div className="col-span-3">
                <InputField
                  disabled={data?.status === "In Progress"}
                  form={form}
                  name="devWallet"
                  label="Dev wallet"
                  placeholder="0x...."
                />
              </div>
              <InputField
                disabled={data?.status === "In Progress"}
                form={form}
                type="number"
                name="marketingBuyTax"
                label="Marketing buy tax"
                placeholder="e.g 10%"
              />
              <InputField
                disabled={data?.status === "In Progress"}
                form={form}
                type="number"
                name="marketingSellTax"
                label="Marketing sell tax"
                placeholder="e.g 10%"
              />
              <div className="col-span-3">
                <InputField
                  disabled={data?.status === "In Progress"}
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
                  name="tokenAmountA"
                  type="number"
                  label="LiquidityA"
                  placeholder="Enter number"
                />
              </div>
              <div className="text-white">
                <div>Your Token</div>
                {form.getValues("tokenSymbol") == "" ? (
                  <div className="pt-4"> Enter Token Details </div>
                ) : (
                  <div className="pt-4 text-[#F57C00]">
                    {form.getValues("tokenSymbol")}{" "}
                  </div>
                )}
              </div>
              <div className="col-span-3">
                <InputField
                  form={form}
                  name="tokenAmountB"
                  type="number"
                  label="LiquidityB"
                  placeholder="Enter number"
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="tokenB"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Token</FormLabel>
                      <Select
                        disabled={data?.status === "In Progress"}
                        onValueChange={field.onChange}
                        defaultValue={
                          data ? data.poolData.liquidityToken : field.value
                        }
                      >
                        <FormControl>
                          <SelectTrigger className="border-[#27272A] bg-[#18181B] border rounded-[6px] text-[#bcbcca] placeholder:text-[#71717A]">
                            <SelectValue
                              placeholder="Select"
                              className="placeholder:text-[#71717A]"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ETH">ETH</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {form.getValues("tokenSymbol") != "" &&
              form.getValues("tokenB") != "" ? (
                <div className="flex items-center w-fit min-w-[300px]">
                  <h1> Price of </h1>
                  <div className="flex items-center px-1 text-[#F57C00]">
                    {form.getValues("tokenSymbol")}
                    <span className="px-1 text-white">:</span>
                    {price}
                  </div>
                  <div> {form.getValues("tokenB")}</div>
                </div>
              ) : (
                <div></div>
              )}
            </div>

            <div className="flex justify-between items-center">
              <button
                type="button"
                disabled={data?.status === "In Progress"}
                onClick={cancel}
                className="font-bold text-[#F57C00] text-sm leading-5"
              >
                Cancel
              </button>
              {data && data?.status === "In Progress" ? (
                <DeployToken
                  tokenName={form.getValues("tokenName")}
                  tokenSymbol={form.getValues("tokenSymbol")}
                  maxSupply={form.getValues("maxSupply")}
                  initialSupply={form.getValues("initialSupply")}
                  devBuyTax={form.getValues("devBuyTax")}
                  devSellTax={form.getValues("devSellTax")}
                  marketingBuyTax={form.getValues("marketingBuyTax")}
                  marketingSellTax={form.getValues("marketingSellTax")}
                  devWallet={form.getValues("devWallet")}
                  marketingWallet={form.getValues("marketingWallet")}
                />
              ) : (
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
              )}
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
