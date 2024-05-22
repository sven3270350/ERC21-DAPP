import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import styles from "./checkbox.module.css";

interface Wallet {
    address: string;
    amount: string;
}

interface BeneficiarieDetailsProps {
    setIsValid: (isValid: boolean) => void;
    triggerValidation: boolean;
    setBeneficiaryDetails: (data: BeneficiaryDetailsData) => void;
    BeneficiaryData: BeneficiaryDetailsData
}

interface BeneficiaryDetailsData {
    numWallets: number;
    tokenAmount: string;
    wallets: Wallet[];
}

const BeneficiarieDetails: React.FC<BeneficiarieDetailsProps> = ({ setIsValid, triggerValidation, setBeneficiaryDetails, BeneficiaryData }) => {
    const [numWallets, setNumWallets] = useState<number>(BeneficiaryData?.numWallets || 1);
    const [wallets, setLocalWallets] = useState<Wallet[]>(BeneficiaryData?.wallets || [{ address: "", amount: "" }]);
    const [tokenAmount, setTokenAmount] = useState<string>(BeneficiaryData?.tokenAmount || "");
    const [applyToAll, setApplyToAll] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        setBeneficiaryDetails({ numWallets, tokenAmount, wallets });
    }, [numWallets, tokenAmount, wallets]);

    useEffect(() => {
        if (triggerValidation) {
            validate();
        }
    }, [triggerValidation]);

    useEffect(() => {
        if (applyToAll) {
            setLocalWallets((prevWallets) =>
                prevWallets.map((wallet) => ({
                    ...wallet,
                    amount: tokenAmount,
                }))
            );
        }
    }, [applyToAll, tokenAmount]);

    const validate = () => {
        let isValid = numWallets > 0 && tokenAmount !== "";
        if (!isValid) {
            setError("Token amount is required.");
        } else {
            setError("");
        }
        setIsValid(isValid);
        return isValid;
    };

    const handleNumWalletsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value, 10);
        setNumWallets(isNaN(value) ? 0 : value);
        setLocalWallets(Array(isNaN(value) ? 0 : value).fill({ address: "", amount: "" }));
    };

    const increaseNumWallets = () => {
        setNumWallets((prevNumWallets) => prevNumWallets + 1);
        setLocalWallets((prevWallets) => [...prevWallets, { address: "", amount: "" }]);
    };

    const decreaseNumWallets = () => {
        if (numWallets > 1) {
            setNumWallets((prevNumWallets) => prevNumWallets - 1);
            setLocalWallets((prevWallets) => prevWallets.slice(0, -1));
        }
    };

    const handleAddressChange = (index: number, address: string) => {
        setLocalWallets((prevWallets) => {
            const newWallets = [...prevWallets];
            newWallets[index].address = address;
            return newWallets;
        });
        setError("");
    };

    const handleAmountChange = (index: number, amount: string) => {
        setLocalWallets((prevWallets) => {
            const newWallets = [...prevWallets];
            newWallets[index].amount = amount;
            return newWallets;
        });
        setError("");
    };

    const handleTokenAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setTokenAmount(value);
        if (applyToAll) {
            setLocalWallets((prevWallets) => prevWallets.map(wallet => ({ ...wallet, amount: value })));
        }
        setError("");
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        setApplyToAll(checked);
        if (checked) {
            setLocalWallets((prevWallets) =>
                prevWallets.map((wallet) => ({
                    ...wallet,
                    amount: tokenAmount,
                }))
            );
        }
        setError("");
    };

    const deleteWallet = (index: number) => {
        setLocalWallets((prevWallets) => prevWallets.filter((_, i) => i !== index));
        setNumWallets((prevNumWallets) => prevNumWallets - 1);
        setError("");
    };

    const DownloadAddress = (index: number) => {
        const filename = `wallet_details_${index + 1}.txt`;
        const wallet = wallets[index];
        const keysContent = `Wallet Address: ${wallet.address}\nToken Amount: ${wallet.amount}`;
        const element = document.createElement('a');
        const file = new Blob([keysContent], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = filename;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <div className="mb-4">
            <h2 className="text-xl font-semibold text-white text-center mb-2">Enter Your Beneficiaries Detail</h2>
            <p className="text-[#71717A] text-sm font-medium text-center mb-4">The token supply is <span className="font-bold text-white">150M</span> </p>
            <div className="mb-4 relative">
                <Label className="text-[#A1A1AA] text-sm">Number of wallets</Label>
                <Input
                    className="bg-[#18181B] border-[#27272A] mt-2 text-white"
                    placeholder="Number"
                    value={numWallets > 0 ? numWallets : ""}
                    onChange={handleNumWalletsChange}
                />
                <Button className="absolute right-10 bottom-4 bg-[#18181B] text-gray-400 text-2xl p-1 rounded-l h-3" onClick={decreaseNumWallets}>-</Button>
                <Button className="absolute right-3 bottom-4 bg-[#18181B] text-white text-2xl p-1 rounded-r h-3" onClick={increaseNumWallets}>+</Button>
            </div>
            <div className="mb-4">
                <Label className="text-[#A1A1AA] text-sm">Token Amount</Label>
                <Input
                    className="bg-[#18181B] border-[#27272A] mt-2 text-white"
                    placeholder="Amount"
                    type="number"
                    value={tokenAmount}
                    onChange={handleTokenAmountChange}
                    required
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
            <div className="flex gap-2 items-center mb-4">
                <input type="checkbox" className={styles.checkbox} checked={applyToAll} onChange={handleCheckboxChange} />
                <Label className="text-[#A1A1AA] text-sm">For all wallets</Label>
            </div>
            <hr />
            <div className="mt-4">
                {wallets.map((wallet, index) => (
                    <div key={index} className="flex gap-2 mb-4 items-end">
                        <div className="w-2/3">
                            <Label className="text-[#A1A1AA] text-sm">Wallet Address {index + 1}</Label>
                            <Input
                                className="bg-[#18181B] border-[#27272A] mt-2 text-white"
                                placeholder="Address"
                                value={wallet.address}
                                onChange={(e) => handleAddressChange(index, e.target.value)}
                            />
                        </div>
                        <div className="w-1/3">
                            <Label className="text-[#A1A1AA] text-sm">Token Amount</Label>
                            <Input
                                className="bg-[#18181B] border-[#27272A] mt-2 text-white"
                                placeholder="Amount"
                                value={wallet.amount}
                                onChange={(e) => handleAmountChange(index, e.target.value)}
                            />
                        </div>
                        <Button className="border-[#27272A] bg-inherit border-[1px] p-3 rounded-lg cursor-pointer" onClick={() => DownloadAddress(index)}>
                            <Image
                                src={"/Images/New Project/file-locked.svg"}
                                width={18}
                                height={18}
                                alt="Download"
                            />
                        </Button>
                        <Button className="border-[#27272A] bg-inherit border-[1px] p-3 rounded-lg cursor-pointer" onClick={() => deleteWallet(index)}>
                            <Image
                                src={"/Images/New Project/delete-02.svg"}
                                width={18}
                                height={18}
                                alt="Delete"
                            />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BeneficiarieDetails;

