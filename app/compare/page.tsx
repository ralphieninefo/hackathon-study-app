"use client";

import { useState, useMemo } from "react";
import { getAWSComparisons, ComparisonResult } from "@/lib/aws-do-comparison";
import { AWS_DO_MAPPINGS } from "@/lib/do-aws-mappings";
import { AWS_OPENSOURCE_MAPPINGS } from "@/lib/aws-open-source-mappings";

export default function ComparePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<ComparisonResult[]>([]);

  // Get all available AWS services (both DO and open-source)
  const availableServices = useMemo(() => {
    const doServices = Object.keys(AWS_DO_MAPPINGS);
    const openSourceServices = Object.keys(AWS_OPENSOURCE_MAPPINGS);
    // Combine and deduplicate
    const all = [...new Set([...doServices, ...openSourceServices])];
    return all.sort();
  }, []);

  // Filter services based on search
  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }

    const query = searchQuery.toLowerCase().trim();
    const matched = availableServices.filter(service =>
      service.toLowerCase().includes(query)
    );

    return matched;
  }, [searchQuery, availableServices]);

  const handleShowAlternative = (service: string) => {
    const comparisons = getAWSComparisons([service]);
    setResults(comparisons);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "DO Product": return "bg-blue-600 text-white";
      case "Open Source": return "bg-green-900 text-green-200";
      case "Self-Hosted": return "bg-blue-900 text-blue-200";
      case "Alternative Platform": return "bg-purple-900 text-purple-200";
      default: return "bg-gray-700 text-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            DigitalOcean &lt;&gt; AWS Comparison
          </h1>
          <p className="text-gray-300 text-lg">
            Find DigitalOcean products or open-source alternatives to AWS services
          </p>
        </div>

        {/* Search */}
        <div className="bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border border-gray-700">
          <label className="block text-sm font-semibold text-gray-300 mb-3">
            Enter an AWS service (e.g., CloudFormation)
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Type AWS service name (e.g., CloudFormation, Lambda, S3)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-4 bg-gray-700 border-2 border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none transition text-lg text-white placeholder-gray-400"
            />
          </div>

          {/* Search Suggestions */}
          {filteredServices.length > 0 && (
            <div className="mt-4 bg-gray-700 rounded-lg p-4 border border-gray-600">
              <p className="text-sm font-semibold text-gray-300 mb-2">Matching services:</p>
              <div className="flex flex-wrap gap-2">
                {filteredServices.map((service) => (
                  <button
                    key={service}
                    onClick={() => {
                      setSearchQuery(service);
                      handleShowAlternative(service);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm font-medium"
                  >
                    {service} →
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Available Services Hint */}
          {searchQuery.length === 0 && (
            <div className="mt-4 text-sm text-gray-400">
              <p className="mb-2">Available services:</p>
              <div className="flex flex-wrap gap-2">
                {availableServices.map((service) => (
                  <button
                    key={service}
                    onClick={() => {
                      setSearchQuery(service);
                      handleShowAlternative(service);
                    }}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded text-xs transition"
                  >
                    {service}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-6">
            {results.map((result, idx) => {
              const { service, type, doMapping, openSourceMapping } = result;
              const isDOProduct = type === "DO Product";
              const mapping = doMapping || openSourceMapping;
              
              return (
                <div 
                  key={idx} 
                  className={`bg-gray-800 rounded-2xl shadow-lg p-8 border-2 ${
                    isDOProduct ? 'border-blue-500' : 'border-green-600'
                  }`}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-center flex-1">
                      <h3 className="text-2xl font-bold text-white mb-1">{service}</h3>
                      <p className="text-gray-400">AWS Service</p>
                    </div>
                    <div className="text-4xl text-gray-500">→</div>
                    <div className="text-center flex-1">
                      <h3 className={`text-2xl font-bold mb-1 ${
                        isDOProduct ? 'text-blue-400' : 'text-green-400'
                      }`}>
                        {isDOProduct ? doMapping?.doProduct : openSourceMapping?.alternative}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(type)}`}>
                        {type}
                      </span>
                      {!isDOProduct && openSourceMapping && (
                        <p className="text-gray-400 text-sm mt-1">{openSourceMapping.category}</p>
                      )}
                    </div>
                  </div>

                  <div className={`rounded-lg p-6 mb-6 border ${
                    isDOProduct 
                      ? 'bg-blue-900/30 border-blue-800' 
                      : 'bg-green-900/30 border-green-800'
                  }`}>
                    <p className="text-gray-200 leading-relaxed">
                      {isDOProduct ? doMapping?.doProductDescription : openSourceMapping?.description}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold text-lg mb-3 text-white">Key Features</h4>
                      <ul className="list-disc list-inside space-y-2 text-gray-300">
                        {mapping?.features?.map((feature: string, i: number) => (
                          <li key={i}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-3 text-white">
                        {isDOProduct ? "Key Differences" : "Key Differences"}
                      </h4>
                      <ul className="list-disc list-inside space-y-2 text-gray-300">
                        {(isDOProduct ? doMapping?.keyDifferences : openSourceMapping?.keyDifferences)?.map((diff: string, i: number) => (
                          <li key={i}>{diff}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {isDOProduct && doMapping?.pricingHighlights && (
                    <div className="mt-6 pt-6 border-t border-gray-700">
                      <h4 className="font-bold text-lg mb-2 text-white">Pricing</h4>
                      <p className="text-blue-300 text-sm">{doMapping.pricingHighlights}</p>
                    </div>
                  )}

                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <h4 className="font-bold text-lg mb-3 text-white">Use Cases</h4>
                    <div className="flex flex-wrap gap-2">
                      {(isDOProduct ? doMapping?.useCaseRecommendations : openSourceMapping?.useCases)?.map((useCase: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-indigo-900 text-indigo-200 rounded-full text-sm">
                          {useCase}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <a
                      href={isDOProduct ? doMapping?.awsDocs : openSourceMapping?.awsDocs}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
                    >
                      AWS Docs
                    </a>
                    <a
                      href={isDOProduct ? doMapping?.doDocs : openSourceMapping?.alternativeDocs}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-4 py-2 text-white rounded-lg transition ${
                        isDOProduct 
                          ? 'bg-blue-600 hover:bg-blue-700' 
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {isDOProduct ? 'DO Docs' : `${openSourceMapping?.alternative} Docs`}
                    </a>
                  </div>
                </div>
              );
            })}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setSearchQuery("");
                  setResults([]);
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg transition font-semibold"
              >
                New Search
              </button>
              <button
                onClick={() => window.location.href = "/"}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition font-semibold"
              >
                Back to Home
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {searchQuery.length > 0 && results.length === 0 && filteredServices.length === 0 && (
          <div className="bg-gray-800 rounded-2xl shadow-lg p-12 text-center border border-gray-700">
            <p className="text-xl text-gray-300 mb-4">
              No DigitalOcean product or open-source alternative found for "{searchQuery}"
            </p>
            <p className="text-gray-400 mb-6">
              Try searching for: EC2, Lambda, S3, RDS, CloudFormation, CloudWatch, Route 53, Managed VPN, or DynamoDB
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
