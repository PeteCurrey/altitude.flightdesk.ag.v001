// Stub for What3Words REST API Integration
// Converts precise GPS coordinates to 3-word human-readable addresses

export interface W3WResult {
  success: boolean;
  words?: string;
  nearestPlace?: string;
  error?: string;
}

export async function convertCoordinatesToWords(lat: number, lng: number): Promise<W3WResult> {
  const apiKey = process.env.WHAT3WORDS_API_KEY;

  if (!apiKey) {
    console.warn("[What3Words API] Missing WHAT3WORDS_API_KEY. Returning mock data.");
    
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 400));

    return {
      success: true,
      words: "///drone.flight.desk",
      nearestPlace: "Manchester, UK"
    };
  }

  try {
    console.log(`[What3Words API] Requesting words for ${lat}, ${lng}...`);
    
    // In production, make a GET request to the W3W API
    // const response = await fetch(`https://api.what3words.com/v3/convert-to-3wa?coordinates=${lat},${lng}&key=${apiKey}`);
    // const data = await response.json();
    // return { success: true, words: `///${data.words}`, nearestPlace: data.nearestPlace };

    return {
      success: true,
      words: "///drone.flight.desk",
      nearestPlace: "Manchester, UK"
    };
  } catch (error) {
    console.error("[What3Words API] Error converting coordinates:", error);
    return { success: false, error: "Failed to convert coordinates to What3Words." };
  }
}
