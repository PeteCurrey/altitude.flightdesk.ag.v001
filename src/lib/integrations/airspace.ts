export interface AirspaceFeature {
  id: string;
  type: "CONTROLLED" | "RESTRICTED" | "NOTAM" | "FRZ";
  name: string;
  level: string;
  geometry: any; // GeoJSON
  warning?: string;
}

export interface WeatherData {
  temp: number;
  windSpeed: number;
  windDeg: number;
  visibility: number;
  precip: number;
  timestamp: string;
}

export async function fetchAirspaceIntelligence(lat: number, lng: number, radius: number = 5000): Promise<AirspaceFeature[]> {
  // Mocking CAA/NATS data for Phase 05
  return [
    {
      id: "FRZ-4412",
      type: "FRZ",
      name: "Manchester Airport FRZ",
      level: "SFC - 2000ft",
      warning: "Flight Restricted Zone - Mandatory Authorization Required",
      geometry: {
        type: "Polygon",
        coordinates: [
           // Mock circle-ish around site
           [
             [lng - 0.02, lat - 0.02],
             [lng + 0.02, lat - 0.02],
             [lng + 0.02, lat + 0.02],
             [lng - 0.02, lat + 0.02],
             [lng - 0.02, lat - 0.02]
           ]
        ]
      }
    },
    {
      id: "NOTAM-881",
      type: "NOTAM",
      name: "Heli-Ops Training Area",
      level: "SFC - 500ft",
      geometry: {
        type: "Point",
        coordinates: [lng + 0.01, lat + 0.01]
      }
    }
  ];
}

export async function fetchWeatherData(lat: number, lng: number): Promise<WeatherData> {
  return {
    temp: 14.5,
    windSpeed: 4.2,
    windDeg: 310,
    visibility: 12000,
    precip: 0,
    timestamp: new Date().toISOString()
  };
}
