import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface TokenDetailsProps {
    setIsValid: (isValid: boolean) => void;
    triggerValidation: boolean;
    allFieldsEntered: (entered: boolean) => void;
    setTokenDetails: (details: {
        tokenName: string;
        tokenSymbol: string;
        maxSupply: string;
        initialSupply: string;
    }) => void;
    projectId: string;
    tokenDetailsData?: {
        tokenName: string;
        tokenSymbol: string;
        maxSupply: string;
        initialSupply: string;
    }; 
}

const TokenDetails: React.FC<TokenDetailsProps> = ({ setIsValid, triggerValidation, allFieldsEntered, setTokenDetails, projectId, tokenDetailsData }) => {
    const [tokenName, setTokenName] = useState<string>(tokenDetailsData?.tokenName || '');
    const [tokenSymbol, setTokenSymbol] = useState<string>(tokenDetailsData?.tokenSymbol || '');
    const [maxSupply, setMaxSupply] = useState<string>(tokenDetailsData?.maxSupply || '');
    const [initialSupply, setInitialSupply] = useState<string>(tokenDetailsData?.initialSupply || '');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (triggerValidation) {
            validateInputs();
        }
    }, [triggerValidation]);

    useEffect(() => {
        const fieldsEntered = !!tokenName && !!tokenSymbol && !!maxSupply && !!initialSupply;
        allFieldsEntered(fieldsEntered);
    }, [tokenName, tokenSymbol, maxSupply, initialSupply]);

    useEffect(() => {
        setTokenDetails({ tokenName, tokenSymbol, maxSupply, initialSupply });
    }, [tokenName, tokenSymbol, maxSupply, initialSupply, setTokenDetails]);

    const handleTokenNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (!/\s/.test(value)) {
            setTokenName(value);
        }
    };

    const handleTokenSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toUpperCase();
        if (/^[A-Z]*$/.test(value)) {
            setTokenSymbol(value);
        }
    };

    const handleMaxSupplyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMaxSupply(e.target.value);
    };

    const handleInitialSupplyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInitialSupply(e.target.value);
    };

    const validateInputs = () => {
        let errors: { [key: string]: string } = {};
        if (!tokenName) errors.tokenName = "Token name cannot be empty.";
        if (!tokenSymbol) errors.tokenSymbol = "Token symbol cannot be empty.";
        if (!maxSupply) errors.maxSupply = "Max supply cannot be empty.";
        if (!initialSupply) errors.initialSupply = "Initial supply cannot be empty.";

        setErrors(errors);
        setIsValid(Object.keys(errors).length === 0);
    };

    const saveTokenDetails = () => {
        const tokenDetails = { tokenName, tokenSymbol, maxSupply, initialSupply };
        // Save token details with the project ID
        // Implement your save logic here, e.g., using localStorage or API calls
        console.log(`Saving token details for project ${projectId}:`, tokenDetails);
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
            <h2 className="text-xl font-semibold text-white text-center mb-2">Enter Your Token Details</h2>
            <p className="text-[#71717A] text-sm font-medium text-center mb-4">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam</p>

            <div className="grid grid-cols-4 gap-5">
                <div>
                    <Label className="text-[#A1A1AA] text-sm flex gap-2 items-center">
                        Token name
                        {renderTooltip("Lorem ipsum dolor sit amet, consectetuer adipiscing elit")}
                    </Label>
                    <Input
                        className="bg-[#18181B] border-[#27272A] mt-2 text-[#F57C00]"
                        placeholder="Example..."
                        value={tokenName}
                        onChange={handleTokenNameChange}
                    />
                    {errors.tokenName && <p className="text-red-500 text-xs mt-1">{errors.tokenName}</p>}
                </div>
                <div>
                    <Label className="text-[#A1A1AA] text-sm flex gap-2 items-center">
                        Token Symbol
                        {renderTooltip("Lorem ipsum dolor sit amet, consectetuer adipiscing elit")}
                    </Label>
                    <Input
                        className="bg-[#18181B] border-[#27272A] mt-2 text-[#F57C00]"
                        placeholder="Enter symbol..."
                        value={tokenSymbol}
                        onChange={handleTokenSymbolChange}
                    />
                    {errors.tokenSymbol && <p className="text-red-500 text-xs mt-1">{errors.tokenSymbol}</p>}
                </div>
                <div>
                    <Label className="text-[#A1A1AA] text-sm flex gap-2 items-center">
                        Max supply
                        {renderTooltip("Lorem ipsum dolor sit amet, consectetuer adipiscing elit")}
                    </Label>
                    <Input
                        type="number"
                        className="bg-[#18181B] border-[#27272A] mt-2 text-[#F57C00]"
                        placeholder="Enter number..."
                        value={maxSupply}
                        onChange={handleMaxSupplyChange}
                    />
                    {errors.maxSupply && <p className="text-red-500 text-xs mt-1">{errors.maxSupply}</p>}
                </div>
                <div>
                    <Label className="text-[#A1A1AA] text-sm flex gap-2 items-center">
                        Initial supply
                        {renderTooltip("Lorem ipsum dolor sit amet, consectetuer adipiscing elit")}
                    </Label>
                    <Input
                        type="number"
                        className="bg-[#18181B] border-[#27272A] mt-2 text-[#F57C00]"
                        placeholder="Enter number..."
                        value={initialSupply}
                        onChange={handleInitialSupplyChange}
                    />
                    {errors.initialSupply && <p className="text-red-500 text-xs mt-1">{errors.initialSupply}</p>}
                </div>
            </div>
        </div>
    );
};

export default TokenDetails;

