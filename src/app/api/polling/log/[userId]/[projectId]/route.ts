import { prisma } from "../../../../../../../prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string, projectId: string } },
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const userRequests = await prisma.transactionRequest.findMany({
      where: {
        userId: Number(params.userId),
        projectId: params.projectId
      }
    })

    return NextResponse.json({ success: true, userRequests: userRequests })
  } catch (error) {
    return NextResponse.json({ success: false, error: error })
  }
}
