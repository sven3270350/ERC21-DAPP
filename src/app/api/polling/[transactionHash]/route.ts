import { prisma } from "@/../prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { transactionHash: string } },
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const transactionResult = await prisma.transactionRequest.findFirst({
      where: {
        transactionHash: params.transactionHash,
      }
    })

    return NextResponse.json({ success: true, transactionResult: transactionResult })
  } catch (error) {
    return NextResponse.json({ success: false, error: error })
  }
}
