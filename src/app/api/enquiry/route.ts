import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const apiKey = req.headers.get("x-altitude-api-key");
    if (apiKey !== process.env.ENQUIRY_API_KEY) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { 
      clientName, company, email, phone, 
      siteAddress, postcode, what3Words, 
      projectName, jobType, deliverables, 
      targetDate, message, budgetBand 
    } = body;

    // Validate payload
    if (!email || !projectName || !siteAddress) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // 1. Create or match client
    let client = await prisma.client.findFirst({
      where: { email }
    });

    if (!client) {
      client = await prisma.client.create({
        data: {
          name: clientName,
          company: company || "Private Client",
          email,
          phone: phone || "N/A"
        }
      });
    }

    // 2. Generate Reference (ALT-YYYY-XXXX)
    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const reference = `ALT-${year}-${randomSuffix}`;

    // 3. Create Brief/Job with status ENQUIRY
    const brief = await prisma.brief.create({
      data: {
        reference,
        title: projectName,
        status: "ENQUIRY",
        clientId: client.id,
        location: siteAddress,
        coordinates: [51.5074, -0.1278], // Default to center for now
        requirements: message,
        jobType,
        deliverables: deliverables.split(",").map((s: string) => s.trim()),
        targetDate: new Date(targetDate),
        budget: budgetBand || "To be quoted"
      }
    });

    // 4. Return success and job reference
    return NextResponse.json({
      success: true,
      jobReference: reference,
      jobId: brief.id,
      portalUrl: `${process.env.NEXTAUTH_URL}/portal/${reference}?token=init_${randomSuffix}`
    });

  } catch (error) {
    console.error("Enquiry API Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
