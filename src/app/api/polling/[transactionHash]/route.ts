import { prisma } from "../../../../../prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"
import { publicClient } from '@/lib/viem'

export async function GET(
  request: NextRequest,
  { params }: { params: { transactionHash: string } },
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const result = await publicClient.getTransactionReceipt({ 
    hash: params.transactionHash as `0x${string}`
  }) 

  const status = result.status === "success" ? "COMPLETE" : (result.status === "reverted" ? "FAILED" : "PENDING")

  try {
    await prisma.transactionRequest.updateMany({
      where: {
        transactionHash: params.transactionHash as string
      },
      data: {
        status: status
      }
    })

    return NextResponse.json({ success: true, transactionResult: { ...result, status: status } })
  } catch (error) {
    return NextResponse.json({ success: false, error: error })
  }
}
