import React from 'react';
import Image from 'next/image';

export const ProjectHeadData: React.FC<{ project: any }> = ({ project }) => {
    const totalAmount = project?.beneficiaryDetails?.wallets.reduce(
        (total: number, wallet: { amount?: string }) => {
            const parsedAmount = parseFloat(wallet?.amount || "0");
            return total + parsedAmount;
        },
        0
    );
    return (
        <div>
            <div className="flex items-center gap-4">
                <p className="text-[#F57C00] font-semibold">{project?.projectName}</p>
                <span className="text-[#71717A]">|</span>
                <div className="flex gap-1 items-center">
                    <p className="text-[12px] text-[#71717A]">{project?.tokenDetails?.contractAddress}</p>
                    <Image
                        src={"/Images/New Project/copy-01.svg"}
                        width={14}
                        height={14}
                        alt="Copy"
                        className='cursor-pointer'
                    />
                </div>
                <div className="text-center">
                    <div className="flex gap-1 items-center">
                        <Image
                            src={"/coins-01.svg"}
                            width={14}
                            height={14}
                            alt="Copy"
                            className='cursor-pointer'
                        />
                        <span className="text-white text-sm">{project?.tokenDetails?.maxSupply}</span>
                    </div>
                    <span className="text-sm text-[#71717A] mt-1">MaxSupply</span>
                </div>
                <span className="border-[1px] h-8 border-[#71717A]"></span>
                <div className="text-center">
                    <div className={`flex h-[22px] w-24 py-1 justify-center ${project?.status === "Created" ? "text-[#FFC400] bg-[#FFC400]" : project?.status === "In Progress" ? "text-[#2979FF] bg-[#2979FF]" : "text-[#00E676] bg-[#00E676]"} text-xs font-semibold tracking-[0.06px] items-center px-[6px] bg-opacity-10 rounded gap-1`}>
                        <Image
                            src={`/${project?.status === "Created" ? "nano-technology" : project?.status === "In Progress" ? "codesandbox" : "rocket-01"}.svg`}
                            alt="icon"
                            width={14}
                            height={14}
                        />
                        {project?.status}
                    </div>
                    <p className="text-xs font-medium text-[#71717A] tracking-[0.06px] mt-1">
                        Project Status
                    </p>
                </div>
                <span className="border-[1px] h-8 border-[#71717A]"></span>
                <div className="text-center">
                    <div className="flex gap-1 items-center">
                        <Image
                            src={"/wallet-01-white.svg"}
                            width={14}
                            height={14}
                            alt="Copy"
                            className='cursor-pointer'
                        />
                        <span className="text-white text-sm">{totalAmount}</span>
                    </div>
                    <span className="text-sm text-[#71717A] mt-1">Wallets</span>
                </div>
            </div>

        </div>
    )
};
export default ProjectHeadData;