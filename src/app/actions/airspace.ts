"use server";

// Stub for UK CAA NATS REST API (SWIM) Integration
// Handles querying airspace restrictions and NOTAMs for flight planning

export interface AirspaceFeature {
  type: string;
  properties: {
    id: string;
    type: "NOTAM" | "FRZ" | "RESTRICTED";
    name: string;
    description: string;
    startTime?: string;
    endTime?: string;
    minAltitude?: number;
    maxAltitude?: number;
    severity: "HIGH" | "MEDIUM" | "LOW";
  };
  geometry: any; // GeoJSON geometry
}

export interface AirspaceData {
  success: boolean;
  features: AirspaceFeature[];
  error?: string;
}

export async function checkAirspace(lat: number, lng: number, radiusKm: number = 5): Promise<AirspaceData> {
  const apiKey = process.env.NATS_API_KEY;

  if (!apiKey) {
    console.warn("[Airspace API] Missing NATS_API_KEY. Returning mock airspace data.");
    
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 800));

    // Return a mock Flight Restriction Zone (FRZ) near the coordinate
    return {
      success: true,
      features: [
        {
          type: "Feature",
          properties: {
            id: "FRZ-MOCK-1",
            type: "FRZ",
            name: "Mock Airport FRZ",
            description: "Flight Restriction Zone. Authorization required for all UAV operations.",
            minAltitude: 0,
            maxAltitude: 2000,
            severity: "HIGH"
          },
          geometry: {
            type: "Polygon",
            coordinates: [[
              [lng - 0.02, lat - 0.02],
              [lng + 0.02, lat - 0.02],
              [lng + 0.02, lat + 0.02],
              [lng - 0.02, lat + 0.02],
              [lng - 0.02, lat - 0.02]
            ]]
          }
        },
        {
          type: "Feature",
          properties: {
            id: "NOTAM-MOCK-1",
            type: "NOTAM",
            name: "Temporary Crane Operation",
            description: "Tall equipment operating in area. Max height 150ft AGL.",
            startTime: new Date().toISOString(),
            endTime: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days
            minAltitude: 0,
            maxAltitude: 150,
            severity: "MEDIUM"
          },
          geometry: {
            type: "Point",
            coordinates: [lng + 0.005, lat + 0.005]
          }
        }
      ]
    };
  }

  try {
    console.log(`[Airspace API] Querying NATS SWIM for lat:${lat}, lng:${lng}, r:${radiusKm}km`);
    
    // In production, this would make a request to the UK NATS REST API.
    // Example:
    // const bbox = calculateBoundingBox(lat, lng, radiusKm);
    // const response = await fetch(`https://api.nats.aero/swim/v1/airspace?bbox=${bbox}`, {
    //   headers: { 'Ocp-Apim-Subscription-Key': apiKey }
    // });
    // const data = await response.json();
    // return { success: true, features: parseNatsToGeoJson(data) };

    return { success: true, features: [] };
  } catch (error) {
    console.error("[Airspace API] Error fetching airspace data:", error);
    return { success: false, features: [], error: "Failed to fetch airspace restrictions." };
  }
}
