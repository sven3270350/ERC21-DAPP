import { prisma } from "@/../prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const data = await request.json()

  const { transactionHash, userId, transactionType } = data;

  try {
    const userRequest = await prisma.transactionRequest.create({
      data: {
        userId: userId,
        transactionHash: transactionHash,
        transactionType: transactionType
      }
    })

    return NextResponse.json({ success: true, userRequest: userRequest })
  } catch (error) {
    return NextResponse.json({ success: false, error: error })
  }
}
