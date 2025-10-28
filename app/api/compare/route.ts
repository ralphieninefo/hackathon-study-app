import { NextResponse } from "next/server";
import { getDoRecommendations, getMigrationComplexity } from "@/lib/do-aws-mappings";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { awsServices } = body;

    if (!Array.isArray(awsServices)) {
      return NextResponse.json(
        { error: "AWS services must be an array" },
        { status: 400 }
      );
    }

    const recommendations = getDoRecommendations(awsServices);
    const complexity = getMigrationComplexity(recommendations);

    return NextResponse.json({
      recommendations,
      complexity,
      totalServices: awsServices.length,
      mappedServices: recommendations.length
    });
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}

