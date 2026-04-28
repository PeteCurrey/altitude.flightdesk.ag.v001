import { NextResponse } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const [
      activeJobsCount,
      totalPilots,
      recentActivity,
      revenueData
    ] = await Promise.all([
      prisma.job.count({ where: { status: { in: ['PLANNED', 'SCHEDULED', 'FLOWN'] } } }),
      prisma.user.count({ where: { role: 'PILOT' } }),
      prisma.activityLog.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { user: true, job: true }
      }),
      prisma.quote.aggregate({
        where: { status: 'APPROVED' },
        _sum: { total: true }
      })
    ]);

    return NextResponse.json({
      kpis: {
        activeJobs: activeJobsCount,
        activePilots: totalPilots,
        monthlyRevenue: revenueData._sum.total || 0,
        // Mocking trend data for dashboard
        revenueChange: 12.4,
        totalFlightHours: 482,
        flightHoursChange: 8.2
      },
      activity: recentActivity.map(log => ({
        id: log.id,
        title: log.type.replace(/_/g, ' '),
        description: log.message,
        timestamp: log.createdAt,
        user: log.user.name,
        jobRef: log.job.reference
      }))
    });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
