import Image from "next/image";
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import styles from './checkbox.module.css';

export const BeneficiarieDetails = () => {
    return (
        <div className="mb-4">
            <h2 className="text-xl font-semibold text-white text-center mb-2">Enter Your Beneficiaries Detail</h2>
            <p className="text-[#71717A] text-sm font-medium text-center mb-4">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam</p>
            <div className="mb-4">
                <Label className="text-[#A1A1AA] text-sm">Number of wallets</Label>
                <Input className="bg-[#18181B] border-[#27272A] mt-2 text-white" placeholder="Number" type="number" />
            </div>
            <div className="flex gap-2 mb-4">
                <div className="w-[488px]">
                    <Label className="text-[#A1A1AA] text-sm">Token Amount</Label>
                    <Input className="bg-[#18181B] border-[#27272A] mt-2 text-white" placeholder="Amount" type="number" />
                </div>
                <div>
                    <Label className="text-[#A1A1AA] text-sm">% of token</Label>
                    <Input className="bg-[#18181B] border-[#27272A] mt-2 text-white" placeholder="Amount" type="number" />
                </div>
            </div>
            <div className="flex gap-2 item-center mb-4">
                <input type="checkbox" className={styles.checkbox} />
                <Label className="text-[#A1A1AA] text-sm">For all wallets</Label>
            </div>
            <hr />
            <div className="mt-4">
                <div className="flex gap-2 mb-4 items-end">
                    <div className="w-[396px]">
                        <Label className="text-[#A1A1AA] text-sm">Wallet address</Label>
                        <Input className="bg-[#18181B] border-[#27272A] mt-2 text-white" placeholder="0x6774Bcb..86a12DDD8b367" />
                    </div>
                    <div className="w-[167px]">
                        <Label className="text-[#A1A1AA] text-sm">Token amount</Label>
                        <Input className="bg-[#18181B] border-[#27272A] mt-2 text-white" placeholder="Amount" />
                    </div>
                    <div className="border-[#27272A] border-[1px] p-3 rounded-lg">
                        <Image
                            src={"./Images/New Project/file-locked.svg"}
                            width={18}
                            height={18}
                            alt="logo"
                            className="cursor-pointer"
                        />
                    </div>
                    <div className="border-[#27272A] border-[1px] p-3 rounded-lg">
                        <Image
                            src={"./Images/New Project/delete-02.svg"}
                            width={18}
                            height={18}
                            alt="logo"
                            className="cursor-pointer"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
