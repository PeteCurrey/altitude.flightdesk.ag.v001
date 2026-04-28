export interface MediaMetadata {
  lat?: number;
  lng?: number;
  altitude?: number;
  timestamp: string;
  camera: string;
  lens?: string;
  focalLength?: string;
  iso: number;
  shutterSpeed: string;
  aperture: string;
  dimensions: string;
  fileSize: number;
  fileType: string;
}

export interface AiAnalysis {
  sceneType: string;
  subject: string;
  perspective: "NADIR" | "OBLIQUE" | "HERO" | "OTHER";
  quality: number; // 0-100
  tags: string[];
  suggestedShotMatch?: string;
  notes?: string;
}

export async function analyseMediaWithClaude(imageUrl: string): Promise<AiAnalysis> {
  // Mocking Claude Vision AI analysis
  console.log(`Analysing media with AI: ${imageUrl}`);
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    sceneType: "Urban Industrial",
    subject: "Structure Facade",
    perspective: "OBLIQUE",
    quality: 94,
    tags: ["sharp", "oblique", "infrastructure", "industrial", "hero"],
    suggestedShotMatch: "SHOT-02",
    notes: "Excellent clarity on structural joins. Minimal motion blur."
  };
}
