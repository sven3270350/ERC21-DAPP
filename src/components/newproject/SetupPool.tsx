import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface SetupPoolProps {
    poolData: {
        liquidityToken: string;
        liquidityAmount: string;
    };
    setPoolData: (data: { liquidityToken: string; liquidityAmount: string }) => void;
    setIsValid: (isValid: boolean) => void;
    triggerValidation: boolean;
}

const SetupPool: React.FC<SetupPoolProps> = ({ poolData, setPoolData, setIsValid, triggerValidation }) => {
    const [error, setError] = useState<{ liquidityToken?: string; liquidityAmount?: string }>({});
    const [touched, setTouched] = useState<boolean>(false);

    const validate = (): boolean => {
        const errors: { liquidityToken?: string; liquidityAmount?: string } = {};
        if (!poolData.liquidityToken) {
            errors.liquidityToken = "Liquidity token is required.";
        }
        if (!poolData.liquidityAmount) {
            errors.liquidityAmount = "Liquidity amount is required.";
        }
        setError(errors);

        const isValid = Object.keys(errors).length === 0;
        setIsValid(isValid);
        return isValid;
    };

    useEffect(() => {
        if (triggerValidation) {
            setTouched(true);
            validate();
        }
    }, [triggerValidation]);

    const handleTokenChange = (value: string) => {
        setPoolData({ ...poolData, liquidityToken: value });
        if (touched) {
            validate();
        }
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPoolData({ ...poolData, liquidityAmount: e.target.value });
        if (touched) {
            validate();
        }
    };

    function renderTooltip(text: string) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Image
                            src={"/Images/New Project/information-circle.svg"}
                            width={14}
                            height={14}
                            alt="info"
                            className="cursor-pointer"
                        />
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#18181B] text-[#5a5a5a] border-[#27272A]">
                        <p>{text}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    return (
        <div className="mb-4">
            <h2 className="text-xl font-semibold text-white text-center mb-2">Setup Pool</h2>
            <p className="text-[#71717A] text-sm font-medium text-center mb-4">
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
            </p>
            <div className="grid grid-cols-2 gap-5">
                {/* Liquidity Token Field */}
                <div>
                    <Label className="text-[#A1A1AA] text-sm flex gap-2 items-center">
                        Liquidity Token
                        {renderTooltip("Lorem ipsum dolor sit amet, consectetuer adipiscing elit")}
                    </Label>
                    <Select value={poolData.liquidityToken} onValueChange={handleTokenChange}>
                        <SelectTrigger className="w-full mt-2 bg-[#18181B] border-[#27272A] text-[#F57C00]">
                            <SelectValue placeholder="Select a token" />
                        </SelectTrigger>
                        <SelectContent className='bg-[#18181B] border-[#27272A] text-[#F57C00] hover:bg-[#18181B]'>
                            <SelectGroup>
                                <SelectItem value="ETH">ETH</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {error.liquidityToken && <p className="text-red-500 text-sm mt-1">{error.liquidityToken}</p>}
                </div>

                {/* Liquidity Amount Field */}
                <div>
                    <Label className="text-[#A1A1AA] text-sm flex gap-2 items-center">
                        Liquidity Amount
                        {renderTooltip("Lorem ipsum dolor sit amet, consectetuer adipiscing elit")}
                    </Label>
                    <Input
                        className="bg-[#18181B] border-[#27272A] mt-2 text-[#F57C00]"
                        placeholder="Enter amount"
                        value={poolData.liquidityAmount}
                        onChange={handleAmountChange}
                    />
                    {error.liquidityAmount && <p className="text-red-500 text-sm mt-1">{error.liquidityAmount}</p>}
                </div>
            </div>
        </div>
    );
};

export default SetupPool;
