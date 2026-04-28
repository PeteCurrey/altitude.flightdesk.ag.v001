import { NextResponse } from "next/navigation";
import { fetchAirspaceIntelligence } from "@/lib/integrations/airspace";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get("lat") || "0");
  const lng = parseFloat(searchParams.get("lng") || "0");
  const radius = parseFloat(searchParams.get("radius") || "5000");

  if (!lat || !lng) {
    return new NextResponse("Missing coordinates", { status: 400 });
  }

  try {
    const data = await fetchAirspaceIntelligence(lat, lng, radius);
    return NextResponse.json(data);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
