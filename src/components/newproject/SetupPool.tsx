import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import Image from 'next/image';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const SetupPool = () => {
    return (
        <div className="mb-4">
            <h2 className="text-xl font-semibold text-white text-center mb-2">Setup Pool</h2>
            <p className="text-[#71717A] text-sm font-medium text-center mb-4">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam</p>
            <div className="grid grid-cols-3 gap-5">
                {["Liquidity", "Trading price", "???"].map((label, index) => (
                    <div key={index}>
                        <Label className="text-[#A1A1AA] text-sm flex gap-2 items-center">
                            {label}
                            <div className="relative">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Image
                                                src={"./Images/New Project/information-circle.svg"}
                                                width={14}
                                                height={14}
                                                alt="logo"
                                                className="cursor-pointer"
                                            />
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-[#18181B] text-[#5a5a5a] border-[#27272A]">
                                            <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </Label>
                        <Input className="bg-[#18181B] border-[#27272A] mt-2 text-[#F57C00]" placeholder="Enter number" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SetupPool;
