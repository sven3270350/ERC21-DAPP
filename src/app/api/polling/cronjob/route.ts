import { NextResponse, NextRequest } from "next/server"
import { prisma } from "@/../prisma"
import { publicClient } from '@/lib/viem'

export async function GET(request: NextRequest) {
  if (
    request.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const transactions = await prisma.transactionRequest.findMany({
    where: {
      status: "PENDING"
    }
  })

  if (transactions.length === 0) {
    return NextResponse.json("No pending transaction.", { status: 200 })
  }

  const promises = transactions.map(async (value) => {
    return await publicClient.getTransactionReceipt({ 
      hash: value.transactionHash as `0x${string}`
    }) 
  })
  
  const results = await Promise.all(promises);

  try {
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      await prisma.transactionRequest.updateMany({
        where: {
          transactionHash: result.transactionHash as string
        },
        data: {
          status: result.status === "success" ? "COMPLETE" : (result.status === "reverted" ? "FAILED" : "PENDING")
        }
      })
    }
    return NextResponse.json("success", { status: 200 })
  } catch (error) {
    return NextResponse.json(error, { status: 500 })
  }
}