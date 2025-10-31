import { NextResponse } from "next/server";
import { getAWSComparisons } from "@/lib/aws-do-comparison";

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

    const comparisons = getAWSComparisons(awsServices);

    return NextResponse.json({
      recommendations: comparisons,
      totalServices: awsServices.length,
      mappedServices: comparisons.length
    });
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}

