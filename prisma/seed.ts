import { PrismaClient, Role, JobStatus, QuoteStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning database...");
  // Note: Order matters for deletion due to foreign keys
  await prisma.activityLog.deleteMany();
  await prisma.mediaAsset.deleteMany();
  await prisma.jobSheet.deleteMany();
  await prisma.report.deleteMany();
  await prisma.quoteLineItem.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.waypoint.deleteMany();
  await prisma.flightPlan.deleteMany();
  await prisma.job.deleteMany();
  await prisma.client.deleteMany();
  await prisma.battery.deleteMany();
  await prisma.equipment.deleteMany();
  await prisma.user.deleteMany();
  await prisma.operatorProfile.deleteMany();

  console.log("Seeding platform foundation...");

  // 1. Operator Profile
  const operator = await prisma.operatorProfile.create({
    data: {
      businessName: "Avorria Flight Systems",
      contactEmail: "ops@avorria.com",
      phone: "+44 20 7946 0123",
      address: "Unit 12, Salford Quays, Manchester, M50 3AZ",
      caaOperatorId: "OP-8821-391",
      gvcNumber: "GVC-UK-99120",
      gvcExpiry: new Date("2026-12-31"),
      primaryBrandColour: "#00D4FF",
    },
  });

  // 2. Users (Pilots & Admin)
  const owner = await prisma.user.create({
    data: {
      name: "Pete Currey",
      email: "pete@avorria.com",
      role: Role.OWNER,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pete",
    },
  });

  const pilot1 = await prisma.user.create({
    data: {
      name: "Marcus Webb",
      email: "marcus@avorria.com",
      role: Role.PILOT,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
    },
  });

  const pilot2 = await prisma.user.create({
    data: {
      name: "Sarah Chen",
      email: "sarah@avorria.com",
      role: Role.PILOT,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
  });

  // 3. Equipment (Aircraft & Batteries)
  const drone1 = await prisma.equipment.create({
    data: {
      type: "DRONE",
      name: "Valkyrie-01",
      manufacturer: "DJI",
      model: "Matrice 350 RTK",
      serialNumber: "M350-99812-X",
      status: "OPERATIONAL",
      totalFlightHours: 142.5,
    },
  });

  const drone2 = await prisma.equipment.create({
    data: {
      type: "DRONE",
      name: "Shadow-04",
      manufacturer: "DJI",
      model: "Mavic 3 Enterprise",
      serialNumber: "M3E-88120-P",
      status: "OPERATIONAL",
      totalFlightHours: 84.2,
    },
  });

  for (let i = 1; i <= 12; i++) {
    await prisma.battery.create({
      data: {
        serialNumber: `TB65-BATT-${i.toString().padStart(3, '0')}`,
        cycleCount: Math.floor(Math.random() * 50) + 10,
        healthPercent: 95 + (Math.random() * 5),
        status: "HEALTHY",
        equipmentId: i <= 6 ? drone1.id : drone2.id,
      },
    });
  }

  // 4. Clients
  const clients = await Promise.all([
    prisma.client.create({ data: { name: "James Wilson", company: "Canary Wharf Group", email: "j.wilson@cwg.com", phone: "+44 20 7418 2000" } }),
    prisma.client.create({ data: { name: "Alice Thorne", company: "National Trust", email: "a.thorne@nationaltrust.org.uk", phone: "+44 1793 817400" } }),
    prisma.client.create({ data: { name: "Robert Vance", company: "Skanska UK", email: "r.vance@skanska.co.uk" } }),
    prisma.client.create({ data: { name: "Elena Rossi", company: "Enel Green Power", email: "e.rossi@enel.com" } }),
    prisma.client.create({ data: { name: "Tom Hardy", company: "BBC Natural History", email: "t.hardy@bbc.co.uk" } }),
  ]);

  // 5. Jobs across different statuses
  const jobTemplates = [
    { title: "North Tower Inspection", status: JobStatus.ENQUIRY, ref: "ALT-25-001" },
    { title: "Coastal Erosion Survey", status: JobStatus.BRIEFED, ref: "ALT-25-002" },
    { title: "M4 Junction 12 Volumetrics", status: JobStatus.PLANNED, ref: "ALT-25-003" },
    { title: "Peak District Heritage Mapping", status: JobStatus.SCHEDULED, ref: "ALT-25-004" },
    { title: "Solar Array Thermal Analysis", status: JobStatus.FLOWN, ref: "ALT-25-005" },
    { title: "City Centre Progress Aerials", status: JobStatus.IN_POST, ref: "ALT-25-006" },
    { title: "Estate Marketing Package", status: JobStatus.DELIVERED, ref: "ALT-25-007" },
    { title: "Bridge Structural Scan", status: JobStatus.INVOICED, ref: "ALT-25-008" },
    { title: "Archive Mission 2024", status: JobStatus.ARCHIVED, ref: "ALT-25-009" },
    { title: "Wind Farm Blade Inspection", status: JobStatus.PLANNED, ref: "ALT-25-010" },
    { title: "Port Security Mapping", status: JobStatus.SCHEDULED, ref: "ALT-25-011" },
    { title: "Quarry Stockpile Volume", status: JobStatus.ENQUIRY, ref: "ALT-25-012" },
  ];

  for (const [index, template] of jobTemplates.entries()) {
    const job = await prisma.job.create({
      data: {
        reference: template.ref,
        projectName: template.title,
        clientId: clients[index % clients.length].id,
        status: template.status,
        jobType: "Aerial Survey",
        deliverables: ["High-Res Images", "Technical Report", "3D Model"],
        assignedPilotId: index % 2 === 0 ? pilot1.id : pilot2.id,
        siteAddress: "London, UK",
        postcode: "E14 5AB",
        latitude: 51.505,
        longitude: -0.02,
      },
    });

    // Add activity log for each job
    await prisma.activityLog.create({
      data: {
        jobId: job.id,
        userId: owner.id,
        type: "MISSION_CREATED",
        message: `Mission ${template.ref} initialised in Command Centre.`,
      },
    });

    // Create a Flight Plan for planned/scheduled jobs
    if ([JobStatus.PLANNED, JobStatus.SCHEDULED].includes(template.status)) {
       const fp = await prisma.flightPlan.create({
         data: {
           jobId: job.id,
           estimatedDistance: 1200,
           estimatedFlightTime: 18,
           estimatedBatteryCount: 2,
         }
       });
       
       await prisma.waypoint.createMany({
         data: [
           { flightPlanId: fp.id, sequence: 1, latitude: 51.505, longitude: -0.02, altitudeAgl: 0, action: "TAKEOFF" },
           { flightPlanId: fp.id, sequence: 2, latitude: 51.506, longitude: -0.021, altitudeAgl: 100, action: "WP" },
           { flightPlanId: fp.id, sequence: 3, latitude: 51.507, longitude: -0.02, altitudeAgl: 120, action: "WP" },
         ]
       });
    }

    // Create Media for flown/delivered jobs
    if ([JobStatus.FLOWN, JobStatus.IN_POST, JobStatus.DELIVERED].includes(template.status)) {
       await prisma.mediaAsset.create({
         data: {
           jobId: job.id,
           fileName: `DJI_001_${template.ref}.JPG`,
           fileType: "IMAGE",
           fileUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
           sizeBytes: 12400000,
           aiTags: ["Tower", "Facade", "Concrete"],
         }
       });
    }

    // Create Report for delivered jobs
    if (template.status === JobStatus.DELIVERED) {
       await prisma.report.create({
         data: {
           jobId: job.id,
           type: "TECHNICAL_INSPECTION",
           status: "COMPLETED",
           portalPublished: true,
         }
       });
    }
  }

  console.log("Seed data created successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
