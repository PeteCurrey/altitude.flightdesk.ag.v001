"use server";

import Anthropic from "@anthropic-ai/sdk";

// Stub for Anthropic Claude REST API Integration
// Handles report generation, mission analysis, and automated media tagging

export interface AIAnalysisResult {
  success: boolean;
  content?: string;
  tags?: string[];
  confidence?: number;
  error?: string;
}

export async function generateMissionReport(missionData: any): Promise<AIAnalysisResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.warn("[Claude API] Missing ANTHROPIC_API_KEY. Returning mock mission report.");
    
    await new Promise(resolve => setTimeout(resolve, 1200));

    return {
      success: true,
      content: "### Automated Mission Report\n\nBased on the flight telemetry and captured media, the mission was executed nominally. The target structure was fully captured with sufficient overlap for 3D reconstruction. No safety violations or airspace incursions were detected. Environmental conditions remained within operational limits throughout the flight envelope."
    };
  }

  try {
    const anthropic = new Anthropic({ apiKey });
    console.log("[Claude API] Generating mission report via Claude...");

    // In production, we construct a prompt combining telemetry, metadata, and weather.
    const prompt = `Analyze the following drone mission data and generate a professional post-flight summary report:\n\n${JSON.stringify(missionData)}`;

    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1000,
      temperature: 0.2,
      system: "You are an expert aviation safety and data analyst for a commercial drone operation.",
      messages: [{ role: "user", content: prompt }]
    });

    return {
      success: true,
      content: response.content[0].type === 'text' ? response.content[0].text : "Report generated but format not recognized."
    };
  } catch (error) {
    console.error("[Claude API] Error generating report:", error);
    return { success: false, error: "Failed to communicate with AI service." };
  }
}

export async function extractMediaTags(imageMetadata: any): Promise<AIAnalysisResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.warn("[Claude API] Missing ANTHROPIC_API_KEY. Returning mock image tags.");
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      tags: ["INDUSTRIAL", "FACADE", "OBLIQUE", "SHARP"],
      confidence: 0.94
    };
  }

  try {
    const anthropic = new Anthropic({ apiKey });
    
    // In production, we might pass a low-res base64 image or just rich EXIF/telemetry metadata.
    const prompt = `Based on the following metadata, extract 3-5 concise, uppercase tags describing the shot context:\n\n${JSON.stringify(imageMetadata)}`;

    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 100,
      temperature: 0.1,
      messages: [{ role: "user", content: prompt }]
    });

    // Parse the response into an array of strings (simplified for stub)
    const text = response.content[0].type === 'text' ? response.content[0].text : "";
    const tags = text.split('\n').filter(t => t.trim().length > 0).map(t => t.replace(/^- /, '').trim().toUpperCase());

    return {
      success: true,
      tags,
      confidence: 0.88
    };
  } catch (error) {
    console.error("[Claude API] Error extracting tags:", error);
    return { success: false, error: "Failed to extract tags." };
  }
}
