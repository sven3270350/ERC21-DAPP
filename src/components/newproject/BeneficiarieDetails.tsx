import React, { useState } from "react";
import Image from "next/image";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import styles from "./checkbox.module.css";

interface Wallet {
    address: string;
    amount: string;
}

export const BeneficiarieDetails = () => {
    const [numWallets, setNumWallets] = useState<number>(0);
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [totalAmount, setTotalAmount] = useState<string>("");

    const handleNumWalletsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value, 10);
        setNumWallets(isNaN(value) ? 0 : value);
        setWallets(Array(isNaN(value) ? 0 : value).fill({ address: "", amount: "" }));
    };

    const increaseNumWallets = () => {
        setNumWallets(numWallets + 1);
        setWallets([...wallets, { address: "", amount: "" }]);
    };

    const decreaseNumWallets = () => {
        if (numWallets > 0) {
            setNumWallets(numWallets - 1);
            setWallets(wallets.slice(0, -1));
        }
    };

    const handleAddressChange = (index: number, address: string) => {
        const newWallets = [...wallets];
        newWallets[index].address = address;
        setWallets(newWallets);
    };

    const handleAmountChange = (index: number, amount: string) => {
        const newWallets = [...wallets];
        newWallets[index].amount = amount;
        setWallets(newWallets);
    };

    const deleteWallet = (index: number) => {
        const newWallets = wallets.filter((_, i) => i !== index);
        setWallets(newWallets);
        setNumWallets(newWallets.length);
    };

    const copyAddress = (address: string) => {
        navigator.clipboard.writeText(address).then(
            () => alert("Address copied to clipboard!"),
            () => alert("Failed to copy address")
        );
    };

    const handleTotalAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTotalAmount(event.target.value);
    };

    return (
        <div className="mb-4">
            <h2 className="text-xl font-semibold text-white text-center mb-2">Enter Your Beneficiaries Detail</h2>
            <p className="text-[#71717A] text-sm font-medium text-center mb-4">
                The token supply is <span className="font-bold text-white">{totalAmount || "150M"}</span>
            </p>
            <div className="mb-4 relative">
                <Label className="text-[#A1A1AA] text-sm">Number of wallets</Label>
                <Input
                    className="bg-[#18181B] border-[#27272A] mt-2 text-white "
                    placeholder="Number"
                    value={numWallets > 0 ? numWallets : ""}
                    onChange={handleNumWalletsChange}
                />
                <Button className="absolute right-10 bottom-4 bg-[#18181B] text-gray-400 text-2xl p-1 rounded-l h-3" onClick={decreaseNumWallets}>-</Button>
                <Button className="absolute right-3 bottom-4 bg-[#18181B] text-white text-2xl p-1 rounded-r h-3" onClick={increaseNumWallets}>+</Button>
            </div>
            <div className="flex justify-between mb-4">
                <div className="w-[488px]">
                    <Label className="text-[#A1A1AA] text-sm">Token Amount</Label>
                    <Input
                        className="bg-[#18181B] border-[#27272A] mt-2 text-white"
                        placeholder="Amount"
                        type="number"
                        value={totalAmount}
                        onChange={handleTotalAmountChange}
                    />
                </div>
                <div>
                    <Label className="text-[#A1A1AA] text-sm">% of token</Label>
                    <Input className="bg-[#18181B] border-[#27272A] mt-2 text-white" placeholder="Amount" type="number" />
                </div>
            </div>
            <div className="flex gap-2 items-center mb-4">
                <input type="checkbox" className={styles.checkbox} />
                <Label className="text-[#A1A1AA] text-sm">For all wallets</Label>
            </div>
            <hr />
            <div className="mt-4">
                {wallets.map((wallet, index) => (
                    <div key={index} className="flex gap-2 mb-4 items-end">
                        <div className="w-[396px]">
                            <Label className="text-[#A1A1AA] text-sm">Wallet address</Label>
                            <Input
                                className="bg-[#18181B] border-[#27272A] mt-2 text-white"
                                placeholder="0x6774Bcb..86a12DDD8b367"
                                value={wallet.address}
                                onChange={(e) => handleAddressChange(index, e.target.value)}
                            />
                        </div>
                        <div className="w-[167px]">
                            <Label className="text-[#A1A1AA] text-sm">Token amount</Label>
                            <Input
                                className="bg-[#18181B] border-[#27272A] mt-2 text-white"
                                placeholder="Amount"
                                value={wallet.amount}
                                onChange={(e) => handleAmountChange(index, e.target.value)}
                            />
                        </div>
                        <div className="border-[#27272A] border-[1px] p-3 rounded-lg cursor-pointer" onClick={() => copyAddress(wallet.address)}>
                            <Image
                                src={"./Images/New Project/file-locked.svg"}
                                width={18}
                                height={18}
                                alt="Copy"
                            />
                        </div>
                        <div className="border-[#27272A] border-[1px] p-3 rounded-lg cursor-pointer" onClick={() => deleteWallet(index)}>
                            <Image
                                src={"./Images/New Project/delete-02.svg"}
                                width={18}
                                height={18}
                                alt="Delete"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
