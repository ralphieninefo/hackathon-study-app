export interface ServiceMapping {
  doProduct: string;
  doProductDescription: string;
  features: string[];
  pricingHighlights: string;
  migrationComplexity: "Easy" | "Medium" | "Hard";
  migrationDifficulty: number; // 1-10 scale
  useCaseRecommendations: string[];
  awsDocs: string;
  doDocs: string;
  keyDifferences: string[];
}

export interface Mappings {
  [awsService: string]: ServiceMapping;
}

export const AWS_DO_MAPPINGS: Mappings = {
  "Lambda": {
    doProduct: "App Platform Functions",
    doProductDescription: "Serverless functions built on App Platform with automatic scaling",
    features: ["Serverless execution", "Automatic scaling", "Built-in monitoring", "Custom domains"],
    pricingHighlights: "$5/month for 1M requests + compute time vs AWS's variable pricing",
    migrationComplexity: "Easy",
    migrationDifficulty: 3,
    useCaseRecommendations: ["API endpoints", "Event-driven processing", "Microservices"],
    awsDocs: "https://docs.aws.amazon.com/lambda/",
    doDocs: "https://docs.digitalocean.com/products/app-platform/concepts/functions/",
    keyDifferences: ["Simpler configuration", "No cold starts", "Integrated with App Platform ecosystem"]
  },
  "EC2": {
    doProduct: "Droplets",
    doProductDescription: "Cloud compute instances with predictable pricing",
    features: ["SSD storage", "99.99% uptime SLA", "Snapshots & backups", "One-click apps"],
    pricingHighlights: "Starting at $4/month for basic plan vs AWS's complex pricing tiers",
    migrationComplexity: "Easy",
    migrationDifficulty: 2,
    useCaseRecommendations: ["Web applications", "Development environments", "Small-medium workloads"],
    awsDocs: "https://docs.aws.amazon.com/ec2/",
    doDocs: "https://docs.digitalocean.com/products/droplets/",
    keyDifferences: ["Simpler pricing model", "Better documentation", "More straightforward networking"]
  },
  "S3": {
    doProduct: "Spaces",
    doProductDescription: "Object storage with built-in CDN and API compatibility",
    features: ["S3-compatible API", "Free CDN", "Custom domains", "Automatic HTTPS"],
    pricingHighlights: "$5/month for 250GB + free transfer vs AWS's pay-per-GB model",
    migrationComplexity: "Easy",
    migrationDifficulty: 2,
    useCaseRecommendations: ["Static websites", "Media storage", "Backups", "File serving"],
    awsDocs: "https://docs.aws.amazon.com/s3/",
    doDocs: "https://docs.digitalocean.com/products/spaces/",
    keyDifferences: ["S3-compatible API", "Free CDN included", "No egress fees", "Simpler pricing"]
  },
  "RDS": {
    doProduct: "Managed Databases",
    doProductDescription: "Fully managed database clusters with automated backups and scaling",
    features: ["PostgreSQL, MySQL, MongoDB, Redis", "Automated backups", "Read replicas", "Point-in-time recovery"],
    pricingHighlights: "$15/month for 1GB RAM, 10GB storage vs AWS's $13+ instance hours",
    migrationComplexity: "Medium",
    migrationDifficulty: 4,
    useCaseRecommendations: ["Web applications", "Data analytics", "Content management"],
    awsDocs: "https://docs.aws.amazon.com/rds/",
    doDocs: "https://docs.digitalocean.com/products/databases/",
    keyDifferences: ["Lower base pricing", "Simpler cluster management", "Transparent resource allocation"]
  },
  "VPC": {
    doProduct: "VPC",
    doProductDescription: "Private networking with built-in security and isolation",
    features: ["Private networking", "Floating IPs", "Load balancing", "Firewalls"],
    pricingHighlights: "All networking features included at no extra charge",
    migrationComplexity: "Medium",
    migrationDifficulty: 5,
    useCaseRecommendations: ["Secure applications", "Multi-tier architectures", "VPN connections"],
    awsDocs: "https://docs.aws.amazon.com/vpc/",
    doDocs: "https://docs.digitalocean.com/products/networking/",
    keyDifferences: ["Simpler network topology", "No per-GB transfer fees", "Integrated firewall rules"]
  },
  "CloudFront": {
    doProduct: "Spaces CDN",
    doProductDescription: "Built-in CDN with global edge locations",
    features: ["Free CDN included", "Automatic HTTPS", "HTTP/2 support", "Global edge locations"],
    pricingHighlights: "Free CDN with Spaces, no separate CDN product needed",
    migrationComplexity: "Easy",
    migrationDifficulty: 2,
    useCaseRecommendations: ["Static websites", "Media delivery", "Global content distribution"],
    awsDocs: "https://docs.aws.amazon.com/cloudfront/",
    doDocs: "https://docs.digitalocean.com/products/spaces/",
    keyDifferences: ["No separate CDN product", "Free with Spaces", "Simpler configuration"]
  },
  "Route 53": {
    doProduct: "Managed DNS",
    doProductDescription: "Reliable DNS service with fast propagation",
    features: ["Fast DNS resolution", "Automated failover", "Geo-routing", "Simple API"],
    pricingHighlights: "Free DNS management included with all domains",
    migrationComplexity: "Easy",
    migrationDifficulty: 3,
    useCaseRecommendations: ["Domain management", "Subdomain routing", "DNS-based load balancing"],
    awsDocs: "https://docs.aws.amazon.com/route53/",
    doDocs: "https://docs.digitalocean.com/products/networking/dns/",
    keyDifferences: ["Simpler DNS records", "No per-hosted-zone fee", "Free for all domains"]
  },
  "Elastic Beanstalk": {
    doProduct: "App Platform",
    doProductDescription: "Platform-as-a-Service for apps with automatic scaling and zero-downtime deploys",
    features: ["Zero-downtime deployments", "Auto-scaling", "Built-in monitoring", "Git-based deployments"],
    pricingHighlights: "$5/month for starter vs AWS's EC2-based pricing",
    migrationComplexity: "Medium",
    migrationDifficulty: 4,
    useCaseRecommendations: ["Web applications", "API services", "Containerized apps"],
    awsDocs: "https://docs.aws.amazon.com/elasticbeanstalk/",
    doDocs: "https://docs.digitalocean.com/products/app-platform/",
    keyDifferences: ["Simpler than EB", "Git-based deployments", "Transparent pricing", "Integrated with DO ecosystem"]
  },
  "DynamoDB": {
    doProduct: "Managed MongoDB",
    doProductDescription: "Fully managed NoSQL database with automatic scaling",
    features: ["Auto-scaling", "Automated backups", "High availability", "Point-in-time recovery"],
    pricingHighlights: "$15/month for 1GB RAM vs AWS's variable RCU/WCU pricing",
    migrationComplexity: "Hard",
    migrationDifficulty: 7,
    useCaseRecommendations: ["Document storage", "Key-value stores", "Real-time applications"],
    awsDocs: "https://docs.aws.amazon.com/dynamodb/",
    doDocs: "https://docs.digitalocean.com/products/databases/mongodb/",
    keyDifferences: ["Standard MongoDB (easier migration)", "Predictable pricing", "Open-source compatible"]
  },
  "SNS": {
    doProduct: "Managed Kafka",
    doProductDescription: "Fully managed streaming and messaging platform",
    features: ["High throughput", "Real-time processing", "Fault tolerance", "Event streaming"],
    pricingHighlights: "$15/month for starter cluster",
    migrationComplexity: "Hard",
    migrationDifficulty: 6,
    useCaseRecommendations: ["Real-time analytics", "Event streaming", "Microservices communication"],
    awsDocs: "https://docs.aws.amazon.com/sns/",
    doDocs: "https://docs.digitalocean.com/products/databases/kafka/",
    keyDifferences: ["Open-source Apache Kafka", "Predictable pricing", "Both streaming and queuing"]
  }
};

export function getDoRecommendations(awsServices: string[]): { service: string; mapping: ServiceMapping }[] {
  return awsServices
    .map(service => ({
      service,
      mapping: AWS_DO_MAPPINGS[service]
    }))
    .filter(item => item.mapping !== undefined);
}

export function getMigrationComplexity(services: { service: string; mapping: ServiceMapping }[]): {
  overall: "Easy" | "Medium" | "Hard";
  averageDifficulty: number;
} {
  if (services.length === 0) {
    return { overall: "Easy", averageDifficulty: 0 };
  }

  const avgDifficulty = services.reduce((sum, s) => sum + s.mapping.migrationDifficulty, 0) / services.length;
  
  let overall: "Easy" | "Medium" | "Hard";
  if (avgDifficulty <= 3) overall = "Easy";
  else if (avgDifficulty <= 6) overall = "Medium";
  else overall = "Hard";

  return { overall, averageDifficulty: Math.round(avgDifficulty * 10) / 10 };
}

