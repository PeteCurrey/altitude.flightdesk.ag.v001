import { NextResponse } from "next/navigation";
import { prisma } from "@/lib/prisma";

const EXTERNAL_API_KEY = process.env.EXTERNAL_ENQUIRY_API_KEY;

export async function POST(req: Request) {
  const apiKey = req.headers.get("x-api-key");

  if (!apiKey || apiKey !== EXTERNAL_API_KEY) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { clientName, company, email, phone, missionTitle, siteAddress, description } = body;

    // 1. Find or create client
    let client = await prisma.client.findUnique({ where: { email } });
    if (!client) {
      client = await prisma.client.create({
        data: { name: clientName, company, email, phone }
      });
    }

    // 2. Create job as ENQUIRY
    const job = await prisma.job.create({
      data: {
        clientId: client.id,
        projectName: missionTitle,
        siteAddress,
        specialRequirements: description,
        status: "ENQUIRY",
        jobType: "Aerial Photography", // Default
        reference: `ALT-EXT-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      }
    });

    // 3. Log activity
    await prisma.activityLog.create({
      data: {
        jobId: job.id,
        userId: "system", // Placeholder for system user
        type: "EXTERNAL_ENQUIRY",
        message: `New mission enquiry received from altitude-hire.com: ${missionTitle}`,
      }
    });

    return NextResponse.json({ success: true, reference: job.reference });
  } catch (error) {
    return new NextResponse("Bad Request", { status: 400 });
  }
}
