import { NextResponse } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  try {
    const jobs = await prisma.job.findMany({
      where: status ? { status: status as any } : {},
      include: {
        client: true,
        assignedPilot: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(jobs);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const body = await req.json();
    const job = await prisma.job.create({
      data: {
        ...body,
        reference: `ALT-${new Date().getFullYear().toString().slice(-2)}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      },
    });
    
    await prisma.activityLog.create({
      data: {
        jobId: job.id,
        userId: (session.user as any).id,
        type: "JOB_CREATED",
        message: `New mission ${job.reference} created by ${session.user?.name}.`,
      }
    });

    return NextResponse.json(job);
  } catch (error) {
    return new NextResponse("Bad Request", { status: 400 });
  }
}
