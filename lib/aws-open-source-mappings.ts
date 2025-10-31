export interface OpenSourceMapping {
  alternative: string;
  description: string;
  type: "Open Source" | "Self-Hosted" | "Alternative Platform";
  category: string;
  features: string[];
  awsDocs: string;
  alternativeDocs: string;
  keyDifferences: string[];
  useCases: string[];
}

export interface OpenSourceMappings {
  [awsService: string]: OpenSourceMapping;
}

export const AWS_OPENSOURCE_MAPPINGS: OpenSourceMappings = {
  "CloudFormation": {
    alternative: "Terraform",
    description: "Infrastructure as Code tool that supports multiple cloud providers",
    type: "Open Source",
    category: "Infrastructure as Code",
    features: ["Multi-cloud support", "State management", "Provider ecosystem", "HashiCorp language"],
    awsDocs: "https://docs.aws.amazon.com/cloudformation/",
    alternativeDocs: "https://www.terraform.io/docs",
    keyDifferences: ["Works across AWS, Azure, GCP", "Stronger state management", "Larger provider ecosystem", "HCL syntax"],
    useCases: ["Multi-cloud deployments", "Infrastructure automation", "Disaster recovery across clouds"]
  },
  "Lambda": {
    alternative: "OpenFaaS / Knative",
    description: "Open-source serverless platforms for containerized functions",
    type: "Open Source",
    category: "Serverless",
    features: ["Container-based", "Self-hosted", "Kubernetes native", "Multi-cloud"],
    awsDocs: "https://docs.aws.amazon.com/lambda/",
    alternativeDocs: "https://www.openfaas.com/",
    keyDifferences: ["No vendor lock-in", "Portable across clouds", "Full control over runtime", "Cost-effective at scale"],
    useCases: ["Avoiding vendor lock-in", "Multi-cloud strategies", "Cost optimization", "Custom requirements"]
  },
  "S3": {
    alternative: "MinIO",
    description: "High-performance, S3-compatible object storage server",
    type: "Open Source",
    category: "Object Storage",
    features: ["S3-compatible API", "High performance", "Self-hosted or managed", "Multi-tenant"],
    awsDocs: "https://docs.aws.amazon.com/s3/",
    alternativeDocs: "https://min.io/docs/",
    keyDifferences: ["S3 API compatible", "No egress fees", "Can run on-premises", "Multi-cloud deployment"],
    useCases: ["Hybrid cloud", "Cost reduction", "Compliance requirements", "Multi-region deployments"]
  },
  "RDS": {
    alternative: "PostgreSQL / MySQL (Self-Hosted)",
    description: "Open-source databases you can run on your own infrastructure",
    type: "Open Source",
    category: "Database",
    features: ["Open source", "Full control", "No vendor lock-in", "Community support"],
    awsDocs: "https://docs.aws.amazon.com/rds/",
    alternativeDocs: "https://www.postgresql.org/docs/",
    keyDifferences: ["No licensing fees", "Full control over configuration", "Portable", "Cost-effective"],
    useCases: ["Budget constraints", "Custom requirements", "Multi-cloud", "On-premises deployments"]
  },
  "ECS": {
    alternative: "Kubernetes",
    description: "Open-source container orchestration platform",
    type: "Open Source",
    category: "Container Orchestration",
    features: ["Multi-cloud", "Large ecosystem", "Self-hosted", "CNCF project"],
    awsDocs: "https://docs.aws.amazon.com/ecs/",
    alternativeDocs: "https://kubernetes.io/docs/",
    keyDifferences: ["Industry standard", "Portable across clouds", "Rich ecosystem", "Community-driven"],
    useCases: ["Multi-cloud strategies", "Avoiding lock-in", "Standardization", "Hybrid deployments"]
  },
  "EC2": {
    alternative: "QEMU / KVM (Self-Hosted)",
    description: "Open-source virtualization solutions for self-hosted compute",
    type: "Open Source",
    category: "Compute",
    features: ["Full control", "No cloud fees", "Custom hardware", "Open source"],
    awsDocs: "https://docs.aws.amazon.com/ec2/",
    alternativeDocs: "https://www.qemu.org/",
    keyDifferences: ["No per-instance charges", "Full hardware control", "On-premises or colocation", "Custom configurations"],
    useCases: ["Cost reduction", "Compliance", "Legacy systems", "Predictable workloads"]
  },
  "IAM": {
    alternative: "Keycloak / Ory Hydra",
    description: "Open-source identity and access management solutions",
    type: "Open Source",
    category: "Identity & Access",
    features: ["OpenID Connect", "OAuth 2.0", "LDAP integration", "Self-hosted"],
    awsDocs: "https://docs.aws.amazon.com/iam/",
    alternativeDocs: "https://www.keycloak.org/",
    keyDifferences: ["Standard protocols", "Multi-cloud support", "No vendor lock-in", "Self-hosted"],
    useCases: ["Multi-cloud IAM", "Standard compliance", "On-premises", "Custom requirements"]
  },
  "CloudWatch": {
    alternative: "Prometheus + Grafana",
    description: "Open-source monitoring and observability stack",
    type: "Open Source",
    category: "Monitoring",
    features: ["Metrics collection", "Alerting", "Visualization", "Time-series database"],
    awsDocs: "https://docs.aws.amazon.com/cloudwatch/",
    alternativeDocs: "https://prometheus.io/docs/",
    keyDifferences: ["Prometheus metrics standard", "Rich visualization", "Self-hosted or managed", "Large ecosystem"],
    useCases: ["Multi-cloud monitoring", "Standard metrics", "Cost-effective", "Custom dashboards"]
  },
  "Route 53": {
    alternative: "PowerDNS / Unbound",
    description: "Open-source DNS servers",
    type: "Open Source",
    category: "Networking",
    features: ["Open source", "Self-hosted", "Full control", "No per-query fees"],
    awsDocs: "https://docs.aws.amazon.com/route53/",
    alternativeDocs: "https://www.powerdns.com/",
    keyDifferences: ["No per-query charges", "Full DNS control", "On-premises capable", "Standard DNS"],
    useCases: ["Cost reduction", "Full control", "On-premises", "Custom DNS requirements"]
  },
  "DynamoDB": {
    alternative: "CouchDB / MongoDB",
    description: "Open-source NoSQL databases",
    type: "Open Source",
    category: "Database",
    features: ["Open source", "Self-hosted", "Flexible schemas", "Community support"],
    awsDocs: "https://docs.aws.amazon.com/dynamodb/",
    alternativeDocs: "https://couchdb.apache.org/",
    keyDifferences: ["No vendor lock-in", "Portable", "Open source license", "Full control"],
    useCases: ["Avoiding lock-in", "Multi-cloud", "Cost optimization", "Custom requirements"]
  },
  "CodePipeline": {
    alternative: "Jenkins / GitLab CI / GitHub Actions",
    description: "Open-source CI/CD platforms",
    type: "Open Source",
    category: "DevOps",
    features: ["Open source", "Extensible", "Plugin ecosystem", "Self-hosted options"],
    awsDocs: "https://docs.aws.amazon.com/codepipeline/",
    alternativeDocs: "https://www.jenkins.io/",
    keyDifferences: ["Vendor agnostic", "Extensible plugins", "Self-hosted option", "Industry standard"],
    useCases: ["Multi-cloud CI/CD", "Standardization", "Cost control", "Custom workflows"]
  },
  "VPC": {
    alternative: "OpenStack Networking / Calico",
    description: "Open-source networking solutions",
    type: "Open Source",
    category: "Networking",
    features: ["Open source", "Software-defined networking", "Self-hosted", "Multi-tenant"],
    awsDocs: "https://docs.aws.amazon.com/vpc/",
    alternativeDocs: "https://www.projectcalico.org/",
    keyDifferences: ["Standard protocols", "No vendor lock-in", "Portable", "Full control"],
    useCases: ["Hybrid cloud", "Standard networking", "Multi-cloud", "On-premises"]
  },
  "Managed VPN": {
    alternative: "Tailscale",
    description: "Zero-config VPN built on WireGuard that creates secure mesh networks. Perfect for connecting teams and devices across cloud providers.",
    type: "Open Source",
    category: "Networking",
    features: ["Zero-config VPN", "WireGuard-based", "Mesh networking", "Cross-platform"],
    awsDocs: "https://docs.aws.amazon.com/vpc/latest/userguide/vpn-connections.html",
    alternativeDocs: "https://tailscale.com/kb/",
    keyDifferences: ["No AWS account required", "Works across all clouds", "Easier setup", "Mesh networking"],
    useCases: ["Team VPN access", "Multi-cloud connectivity", "Secure remote access", "Device networking"]
  },
  "VPN": {
    alternative: "Tailscale",
    description: "Zero-config VPN built on WireGuard that creates secure mesh networks. Perfect for connecting teams and devices across cloud providers.",
    type: "Open Source",
    category: "Networking",
    features: ["Zero-config VPN", "WireGuard-based", "Mesh networking", "Cross-platform"],
    awsDocs: "https://docs.aws.amazon.com/vpc/latest/userguide/vpn-connections.html",
    alternativeDocs: "https://tailscale.com/kb/",
    keyDifferences: ["No AWS account required", "Works across all clouds", "Easier setup", "Mesh networking"],
    useCases: ["Team VPN access", "Multi-cloud connectivity", "Secure remote access", "Device networking"]
  },
  "AWS VPN": {
    alternative: "Tailscale",
    description: "Zero-config VPN built on WireGuard that creates secure mesh networks. Perfect for connecting teams and devices across cloud providers.",
    type: "Open Source",
    category: "Networking",
    features: ["Zero-config VPN", "WireGuard-based", "Mesh networking", "Cross-platform"],
    awsDocs: "https://docs.aws.amazon.com/vpc/latest/userguide/vpn-connections.html",
    alternativeDocs: "https://tailscale.com/kb/",
    keyDifferences: ["No AWS account required", "Works across all clouds", "Easier setup", "Mesh networking"],
    useCases: ["Team VPN access", "Multi-cloud connectivity", "Secure remote access", "Device networking"]
  }
};

export function getOpenSourceAlternatives(awsServices: string[]): { service: string; mapping: OpenSourceMapping }[] {
  return awsServices
    .map(service => ({
      service,
      mapping: AWS_OPENSOURCE_MAPPINGS[service]
    }))
    .filter(item => item.mapping !== undefined);
}

