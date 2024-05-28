import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { ProjectName } from "./ProjectName";
import { TaskDone } from "./TaskDone";
import { DraftModal } from "./DraftModal";
import SetupPool from "./SetupPool";
import Overview from "./OverView";
import { saveProjectData, getProjectData, generateUniqueId } from "@/app/utils/utils";
import { useRouter } from 'next/navigation';
import TokenDetails from "./TokenDetails";
import BeneficiarieDetails from "./BeneficiarieDetails";
import CreateWallet from "./CreateWallet/CreateWallet";

interface Props { }
interface Wallet {
    address: string;
    privateKey: string;
}

const MultipleSteps: React.FC<Props> = () => {
    const [step, setStep] = useState<number>(1);
    const [isValid, setIsValid] = useState<boolean>(false);
    const [showError, setShowError] = useState<boolean>(false);
    const [triggerValidation, setTriggerValidation] = useState<boolean>(false);
    const [allFieldsEnteredInTokenDetails, setAllFieldsEnteredInTokenDetails] = useState<boolean>(false);
    const [projectName, setProjectName] = useState<string>("");
    const [tokenDetails, setTokenDetails] = useState<any>(null);
    const [beneficiaryDetails, setBeneficiaryDetails] = useState<any>(null);
    const [projectId, setProjectId] = useState<string>(generateUniqueId());
    const [fundingWalletData, setFundingWalletData] = useState<any>(null);
    const [adminWalletData, setAdminWalletData] = useState<any>(null);
    const [poolData, setPoolData] = useState<{ liquidityToken: string; liquidityAmount: string }>({
        liquidityToken: "",
        liquidityAmount: ""
    });

    const router = useRouter();
    const { queryProjectId } = router.query || {};

    useEffect(() => {
        if (queryProjectId) {
            const data = getProjectData(queryProjectId as string);
            if (data) {
                setProjectId(queryProjectId as string);
                setProjectName(data.projectName || '');
                setTokenDetails(data.tokenDetails || {});
                setBeneficiaryDetails(data.beneficiaryDetails || {});
                setFundingWalletData(data.fundingWallet || null);
                setAdminWalletData(data.adminWallet || null);
                setPoolData({
                    liquidityToken: data.poolData?.liquidityToken || "",
                    liquidityAmount: data.poolData?.liquidityAmount || ""
                });
            }
        } else {
            setProjectId(generateUniqueId());
            setProjectName('');
            setTokenDetails({});
            setBeneficiaryDetails({});
            setFundingWalletData(null);
            setAdminWalletData(null);
            setPoolData({
                liquidityToken: "",
                liquidityAmount: ""
            });
        }
    }, [queryProjectId]);

    const handleNextClick = () => {
        setTriggerValidation(true); 
        setTimeout(() => {
            if (isValid && (step !== 3 || allFieldsEnteredInTokenDetails)) {
                const currentData = {
                    projectName,
                    tokenDetails,
                    beneficiaryDetails,
                    fundingWallet: fundingWalletData,
                    adminWallet: adminWalletData,
                    poolData 
                };
                const status = step === 1 ? "Created" : "In Progress";
                saveProjectData(projectId, { ...currentData, status });
                setStep(step + 1);
                setShowError(false);
            } else {
                setShowError(true);
            }
            setTriggerValidation(false); 
        }, 100);
    };

    const handleBackClick = () => {
        if (step > 1) {
            setStep(step - 1);
            setShowError(false);
        }
    };

    const downloadCSV = () => {
        const filename = 'wallet_details.csv';
        const keysContent = beneficiaryDetails?.wallets.map((item: Wallet) => `${item.address},${item.privateKey}`).join('\n');
        const csvContent = 'data:text/csv;charset=utf-8,Wallet Address, Privet Key\n' + keysContent;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', filename);
        document.body.appendChild(link); 
        link.click();
        document.body.removeChild(link);
    };

    return (
        <section className="mb-5">
            <div className="border-[1px] border-[#18181B] rounded-lg p-4 w-[719px] m-auto mb-4">
                <h2 className="text-xl font-semibold text-white text-center mb-4">Steps to set up a new project</h2>
                <div className="flex items-center justify-between">
                    <div>
                        <div className={`border-[#27272A] border-[1px] rounded-lg p-3 w-[50px] m-auto mb-2 ${step > 1 ? 'bg-[#F57C00]' : ''}`}>
                            <Image
                                src={step > 1 ? "/Images/New Project/tick-02.svg" : (step === 1 ? "/Images/New Project/add-square.svg" : "")}
                                width={18}
                                height={18}
                                alt="logo"
                                className="cursor-pointer m-auto"
                            />
                        </div>
                        <span className="text-xs text-white font-normal">Basic Info</span>
                    </div>
                    {Array.from({ length: 5 }, (_, i) => i + 2).map((index) => (
                        <React.Fragment key={index}>
                            <div className={`border-[1px] border-[#3F3F46] border-x-[25px] mb-5 ${step > index ? 'bg-[#F57C00]' : ''}`}></div>
                            <div>
                                <div className={`border-[#27272A] border-[1px] p-3 rounded-lg w-[50px] m-auto mb-2 ${step > index ? 'bg-[#F57C00]' : ''}`}>
                                    <Image
                                        src={step > index ? "/Images/New Project/tick-02.svg" : (step === index ? `/Images/New Project/${getStepImage(index)}-active.svg` : `/Images/New Project/${getStepImage(index)}.svg`)}
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

            <div className="border-[1px] border-[#18181B] rounded-lg p-4 w-[719px] m-auto">
                {step === 1 && <ProjectName setIsValid={setIsValid} triggerValidation={triggerValidation} setProjectName={setProjectName} projectName={projectName} />}
                {step === 2 && (
                    <CreateWallet
                        setIsValid={setIsValid}
                        showError={showError}
                        projectId={projectId}
                        fundingWalletData={fundingWalletData}
                        adminWalletData={adminWalletData}
                        setFundingWalletData={setFundingWalletData}
                        setAdminWalletData={setAdminWalletData}
                    />
                )}
                {step === 3 && (
                    <TokenDetails
                        setIsValid={setIsValid}
                        triggerValidation={triggerValidation}
                        allFieldsEntered={(entered) => setAllFieldsEnteredInTokenDetails(entered)}
                        setTokenDetails={setTokenDetails}
                        projectId={projectId}
                        tokenDetailsData={tokenDetails}
                    />
                )}
                {step === 4 && (
                    <BeneficiarieDetails
                        setIsValid={setIsValid}
                        triggerValidation={triggerValidation}
                        setBeneficiaryDetails={setBeneficiaryDetails}
                        BeneficiaryData={beneficiaryDetails}
                    />
                )}
                {step === 5 && (
                    <SetupPool
                        poolData={poolData}
                        setPoolData={setPoolData}
                        setIsValid={setIsValid}
                        triggerValidation={triggerValidation}
                    />
                )}
                {step === 6 && (
                    <Overview
                        projectName={projectName}
                        tokenDetails={tokenDetails}
                        beneficiaryDetails={beneficiaryDetails}
                        fundingWalletData={fundingWalletData}
                        adminWalletData={adminWalletData}
                        poolData={poolData}
                    />
                )}
                {step === 7 && <TaskDone />}

                {step !== 7 && (
                    <div className="flex justify-between">
                        <DraftModal />
                        <div className="flex gap-2">
                            {step === 4 && (
                                <Button className="bg-[#09090B] border-none text-[#F57C00] text-sm font-normal" onClick={downloadCSV}>
                                    <Image
                                        src={"/Images/New Project/download-02.svg"}
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
                                        src={"/Images/New Project/arrow-left-02.svg"}
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
                                            src={"/Images/New Project/tick-02.svg"}
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
                                            src={"/Images/New Project/arrow-right-02.svg"}
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

export default MultipleSteps;
