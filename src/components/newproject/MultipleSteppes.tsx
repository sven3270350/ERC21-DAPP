import * as React from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { ProjectName } from "./ProjectName";
import { BeneficiarieDetails } from "./BeneficiarieDetails";
import { TaskDone } from "./TaskDone";
import { DraftModal } from "./DraftModal";
import { CreateWallet } from "./CreateWallet/CreateWallet";
import SetupPool from "./SetupPool";
import Overview from "./OverView";
import TokenDetails from "./TokenDetails";

interface Props { }

const MultipleSteppes: React.FC<Props> = () => {
    const [step, setStep] = React.useState<number>(1);

    const handleNextClick = () => {
        setStep(step + 1);
    };

    const handleBackClick = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    return (
        <section className="mb-5">
            <div className="border-[1px] border-[#18181B] rounded-lg p-4 w-[719px] m-auto mb-4">
                <h2 className="text-xl font-semibold text-white text-center mb-4">Steps to set up a new project</h2>
                <div className="flex items-center justify-between">
                    {/* Steps */}
                    <div>
                        <div className={`border-[#27272A] border-[1px] rounded-lg p-3 w-[50px] m-auto mb-2 ${step > 1 ? 'bg-[#F57C00]' : ''}`}>
                            <Image
                                src={step > 1 ? "./Images/New Project/tick-02.svg" : (step === 1 ? "./Images/New Project/add-square.svg" : "")}
                                width={18}
                                height={18}
                                alt="logo"
                                className="cursor-pointer m-auto"
                            />
                        </div>
                        <span className="text-xs text-white font-normal">Basic Info</span>
                    </div>
                    {/* Steps 2 to 6 */}
                    {Array.from({ length: 5 }, (_, i) => i + 2).map((index) => (
                        <React.Fragment key={index}>
                            <div className={`border-[1px] border-[#3F3F46] border-x-[25px] mb-5 ${step > index ? 'bg-[#F57C00]' : ''}`}></div>
                            <div>
                                <div className={`border-[#27272A] border-[1px] p-3 rounded-lg w-[50px] m-auto mb-2 ${step > index ? 'bg-[#F57C00]' : ''}`}>
                                    <Image
                                        src={step > index ? "./Images/New Project/tick-02.svg" : (step === index ? `./Images/New Project/${getStepImage(index)}-active.svg` : `./Images/New Project/${getStepImage(index)}.svg`)}
                                        width={18}
                                        height={18}
                                        alt="logo"
                                        className="cursor-pointer m-auto"
                                    />
                                </div>
                                <span className="text-xs text-white font-normal">{getStepName(index)}</span>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div className="border-[1px] border-[#18181B] rounded-lg p-4 w-[719px] m-auto ">
                {step === 1 && <ProjectName />}
                {step === 2 && <CreateWallet />}
                {step === 3 && <TokenDetails />}
                {step === 4 && <BeneficiarieDetails />}
                {step === 5 && <SetupPool />}
                {step === 6 && <Overview />}
                {step === 7 && <TaskDone />}

                {step === 7 ? "" : (
                    <div className="flex justify-between">
                        <DraftModal />
                        <div className="flex gap-2">
                            {step === 4 && (
                                <Button className="bg-[#09090B] border-none text-[#F57C00] text-sm font-normal">
                                    <Image
                                        src={"./Images/New Project/download-02.svg"}
                                        width={18}
                                        height={18}
                                        alt="logo"
                                        className="cursor-pointer m-auto mr-1"
                                    />
                                    All private keys in .CSV
                                </Button>
                            )}
                            {step > 1 && (
                                <Button className="bg-[#09090B] border-none text-[#F57C00] text-sm font-normal" onClick={handleBackClick}>
                                    <Image
                                        src={"./Images/New Project/arrow-left-02.svg"}
                                        width={18}
                                        height={18}
                                        alt="logo"
                                        className="cursor-pointer m-auto mr-1"
                                    />
                                    Back
                                </Button>
                            )}
                            <Button className="bg-[#F57C00] text-black text-base font-bold flex gap-2 hover:bg-[#F57C00] w-[123px]" onClick={handleNextClick}>
                                {step > 5 ? (
                                    <>
                                        <Image
                                            src={"./Images/New Project/tick-02.svg"}
                                            width={18}
                                            height={18}
                                            alt="logo"
                                            className=""
                                        />
                                        Confirm
                                    </>
                                ) : (
                                    <>
                                        Next
                                        <Image
                                            src={"./Images/New Project/arrow-right-02.svg"}
                                            width={18}
                                            height={18}
                                            alt="logo"
                                            className=""
                                        />
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

// Helper functions to get step name and image
const getStepName = (step: number): string => {
    switch (step) {
        case 2:
            return "Create wallets";
        case 3:
            return "Token detail";
        case 4:
            return "Beneficiaries";
        case 5:
            return "Pool detail";
        case 6:
            return "Overview";
        default:
            return "";
    }
};

const getStepImage = (step: number): string => {
    switch (step) {
        case 2:
            return "wallet-01";
        case 3:
            return "information-square";
        case 4:
            return "user-group";
        case 5:
            return "pool";
        case 6:
            return "view";
        default:
            return "";
    }
};

export default MultipleSteppes;
