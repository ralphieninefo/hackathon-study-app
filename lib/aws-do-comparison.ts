import { AWS_DO_MAPPINGS, ServiceMapping } from "./do-aws-mappings";
import { AWS_OPENSOURCE_MAPPINGS, OpenSourceMapping } from "./aws-open-source-mappings";

export type ComparisonType = "DO Product" | "Open Source" | "Self-Hosted" | "Alternative Platform";

export interface ComparisonResult {
  service: string;
  type: ComparisonType;
  doMapping?: ServiceMapping;
  openSourceMapping?: OpenSourceMapping;
}

/**
 * Build comparison results for a list of AWS services by checking
 * DigitalOcean product mappings first, then open-source alternatives.
 */
export function getAWSComparisons(services: string[]): ComparisonResult[] {
  const results: ComparisonResult[] = [];

  for (const service of services) {
    const doMapping = AWS_DO_MAPPINGS[service];
    if (doMapping) {
      results.push({ service, type: "DO Product", doMapping });
      continue;
    }

    const openSourceMapping = AWS_OPENSOURCE_MAPPINGS[service];
    if (openSourceMapping) {
      results.push({ service, type: openSourceMapping.type, openSourceMapping });
      continue;
    }
  }

  return results;
}


