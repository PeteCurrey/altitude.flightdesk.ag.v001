export interface SplatStatus {
  id: string;
  jobId: string;
  status: "DRAFT" | "QUEUED" | "UPLOADING" | "PROCESSING" | "COMPLETE" | "FAILED";
  progress: number; // 0-100
  splatUrl?: string;
  plyUrl?: string;
  glbUrl?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SplatIntelligence {
  coverageScore: number;
  diversityScore: number;
  imageCount: number;
  warnings: string[];
}

export async function createSplatReconstruction(jobId: string, assetIds: string[]): Promise<string> {
  // Mocking dispatch to Polycam/Splatware API
  console.log(`Dispatching 3DGS Reconstruction for Job: ${jobId} with ${assetIds.length} assets.`);
  await new Promise(resolve => setTimeout(resolve, 1000));
  return "splat_req_8812_ax";
}

export async function fetchSplatStatus(requestId: string): Promise<SplatStatus> {
  return {
    id: requestId,
    jobId: "job_1",
    status: "PROCESSING",
    progress: 64,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}
