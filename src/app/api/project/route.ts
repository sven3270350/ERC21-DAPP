import { prisma } from "@/../prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { encrypt, decrypt } from "@/app/utils/encrypt"
import { NextResponse, NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const data = await request.json()

  const projectData = data.projectData;
  const userId = Number(data.userId);
  const projectIds = Object.keys(projectData)

  try {
    for(let i = 0; i < projectIds.length; i++) {
      const project = projectData[projectIds[i]];
      if (!project.beneficiaryDetails || !project.beneficiaryDetails.wallets) {
        await prisma.project.create({
          data: {
            projectId: projectIds[i],
            userId: userId,
            projectData: JSON.stringify(project)
          }
        })
      } else {
        const encryptedWallets = project.beneficiaryDetails.wallets.map((value: any) => {
          return {...value, privateKey: encrypt(value.privateKey)}
        })
        project.beneficiaryDetails.wallets = encryptedWallets;
        await prisma.project.create({
          data: {
            projectId: projectIds[i],
            userId: userId,
            projectData: JSON.stringify(project)
          }
        })
      }
    }

    return NextResponse.json({ success: true, message: "Projects successfully created." })
  } catch (error) {
    return NextResponse.json({ success: false, error: error })
  }
}
