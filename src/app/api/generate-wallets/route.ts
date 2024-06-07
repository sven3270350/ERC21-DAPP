import { generateBeneficiaryDetails } from "@/utils/generate-wallet";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { numWallets, tokenAmount } = await req.json();
    try {
        const beneficiaryDetails = await generateBeneficiaryDetails(numWallets, tokenAmount);
        return NextResponse.json({ beneficiaryDetails }, { status: 200 });
    } catch (error) {
        console.error("Error generating beneficiary details:", error);
        NextResponse.json({ message: "Error generating beneficiary details" }, { status: 500 });
    }
}