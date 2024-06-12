import { prisma } from "../../../../prisma"
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
      const projectResult = await prisma.project.findFirst({
        where: {
          projectId: projectIds[i]
        }
      })

      if (projectResult) {
        continue
      }

      if (!project.beneficiaryDetails) {
        await prisma.project.create({
          data: {
            projectId: projectIds[i],
            userId: userId,
            projectData: JSON.stringify(project)
          }
        })
      } else {
        const encryptedWallets = project.beneficiaryDetails.map((value: any) => {
          return {...value, privateKey: encrypt(value.privateKey)}
        })
        project.beneficiaryDetails = encryptedWallets;
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

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const data = await request.json()

  const projectData = data.projectData;
  const userId = Number(data.userId);
  const projectId = data.projectId;
  const projectIds = Object.keys(projectData)

  if (!projectId) {
    return NextResponse.json({ message: "ProjectId is required." }, { status: 401 })
  }

  if (!projectData) {
    return NextResponse.json({ message: "ProjectData is required." }, { status: 401 })
  }

  if (!userId) {
    return NextResponse.json({ message: "userId is required." }, { status: 401 })
  }


  try {
    for(let i = 0; i < projectIds.length; i++) {
      const project = projectData[projectIds[i]];
      const projectResult = await prisma.project.findFirst({
        where: {
          projectId: projectIds[i]
        }
      })

      if (!projectResult) {
        return NextResponse.json({ message: "Invalid projectId." }, { status: 401 })
      }

      if (!project.beneficiaryDetails) {
        await prisma.project.updateMany({
          where: {
            projectId: projectId,
            userId: userId
          },
          data: {
            projectId: projectIds[i],
            userId: userId,
            projectData: JSON.stringify(project)
          }
        })
      } else {
        const encryptedWallets = project.beneficiaryDetails.map((value: any) => {
          return {...value, privateKey: encrypt(value.privateKey)}
        })
        project.beneficiaryDetails = encryptedWallets;
        await prisma.project.updateMany({
          where: {
            projectId: projectId,
            userId: userId
          },
          data: {
            projectId: projectIds[i],
            userId: userId,
            projectData: JSON.stringify(project)
          }
        })
      }
    }
  
    return NextResponse.json({ success: true, message: "Projects successfully updated." })
  } catch (error) {
    return NextResponse.json({ success: false, error: error })
  }
}
