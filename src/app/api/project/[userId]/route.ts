import { prisma } from "../../../../../prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"
import { decrypt } from "@/app/utils/encrypt"

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } },
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const projects = await prisma.project.findMany({
      where: {
        userId: Number(params.userId)
      }
    })
  
    const decryptedProjects = projects.map((value) => {
      const parsedData = JSON.parse(value.projectData);
      if (parsedData.bundleWallet) {
        parsedData.bundleWallet.privateKey = decrypt(parsedData.bundleWallet.privateKey)
      }
      if (parsedData.beneficiaryDetails.length !== 0) {
        const encryptedWallets = parsedData.beneficiaryDetails.map((value: any) => {
          return { ...value, privateKey: decrypt(value.privateKey) };
        });
        parsedData.beneficiaryDetails = encryptedWallets;
      }
      return JSON.stringify(parsedData);
    })
  
    return NextResponse.json({ success: true, projects: decryptedProjects })
  } catch (error) {
    return NextResponse.json({ success: false, error: error })
  }
}
