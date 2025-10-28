"use client";

import { useState } from "react";
import DOComparisonChatbot from "../components/DOComparisonChatbot";

interface Recommendation {
  service: string;
  mapping: {
    doProduct: string;
    doProductDescription: string;
    features: string[];
    pricingHighlights: string;
    migrationComplexity: string;
    migrationDifficulty: number;
    awsDocs: string;
    doDocs: string;
    keyDifferences: string[];
  };
}

export default function ComparePage() {
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [useCase, setUseCase] = useState("");
  const [priorities, setPriorities] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [showChatbot, setShowChatbot] = useState(false);
  const [loading, setLoading] = useState(false);

  const awsServices = [
    "Lambda",
    "EC2",
    "S3",
    "RDS",
    "VPC",
    "CloudFront",
    "Route 53",
    "Elastic Beanstalk",
    "DynamoDB",
    "SNS"
  ];

  const useCases = [
    "Web Application Hosting",
    "API Development",
    "Data Storage & Backups",
    "DevOps & CI/CD",
    "Database Management",
    "Content Delivery",
    "Machine Learning"
  ];

  const priorityOptions = [
    "Cost Optimization",
    "Performance",
    "Simplicity",
    "Migration Ease",
    "Scalability",
    "Security"
  ];

  const handleServiceToggle = (service: string) => {
    setSelectedServices(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const handlePriorityToggle = (priority: string) => {
    setPriorities(prev =>
      prev.includes(priority)
        ? prev.filter(p => p !== priority)
        : [...prev, priority]
    );
  };

  const handleNext = () => {
    if (step === 1 && selectedServices.length === 0) {
      alert("Please select at least one AWS service");
      return;
    }
    if (step === 2 && !useCase) {
      alert("Please select a use case");
      return;
    }
    setStep(step + 1);
  };

  const handleGetRecommendations = async () => {
    if (priorityOptions.length === 0) {
      alert("Please select at least one priority");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ awsServices: selectedServices })
      });
      
      const data = await response.json();
      setRecommendations(data.recommendations);
      setStep(4);
    } catch (error) {
      console.error("Failed to get recommendations:", error);
      alert("Failed to load recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Easy": return "text-green-600 bg-green-100";
      case "Medium": return "text-yellow-600 bg-yellow-100";
      case "Hard": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AWS to DigitalOcean Migration Guide
          </h1>
          <p className="text-gray-600">
            Get personalized recommendations for migrating from AWS to DigitalOcean
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex items-center">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  s <= step ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600"
                }`}>
                  {s}
                </div>
                {s < 4 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    s < step ? "bg-blue-600" : "bg-gray-300"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Select AWS Services */}
        {step === 1 && (
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Which AWS services do you currently use?</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {awsServices.map((service) => (
                <button
                  key={service}
                  onClick={() => handleServiceToggle(service)}
                  className={`p-4 rounded-lg border-2 transition ${
                    selectedServices.includes(service)
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-blue-400"
                  }`}
                >
                  {service}
                </button>
              ))}
            </div>
            <button
              onClick={handleNext}
              className="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 2: Use Case */}
        {step === 2 && (
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">What's your primary use case?</h2>
            <div className="space-y-3">
              {useCases.map((uc) => (
                <button
                  key={uc}
                  onClick={() => setUseCase(uc)}
                  className={`w-full p-4 rounded-lg border-2 transition ${
                    useCase === uc
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-blue-400"
                  }`}
                >
                  {uc}
                </button>
              ))}
            </div>
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition"
              >
                ← Back
              </button>
              <button
                onClick={handleNext}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Priorities */}
        {step === 3 && (
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">What matters most to you? (Select all that apply)</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {priorityOptions.map((priority) => (
                <button
                  key={priority}
                  onClick={() => handlePriorityToggle(priority)}
                  className={`p-4 rounded-lg border-2 transition ${
                    priorities.includes(priority)
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-blue-400"
                  }`}
                >
                  {priority}
                </button>
              ))}
            </div>
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition"
              >
                ← Back
              </button>
              <button
                onClick={handleGetRecommendations}
                disabled={loading || priorities.length === 0}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? "Loading..." : "Get Recommendations →"}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Results */}
        {step === 4 && recommendations.length > 0 && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold mb-6">Your DigitalOcean Recommendations</h2>
              
              {/* Summary */}
              <div className="bg-blue-50 rounded-lg p-6 mb-8">
                <p className="text-lg mb-4">
                  Based on your AWS services ({selectedServices.join(", ")}) and priorities ({priorities.join(", ")}) 
                  in {useCase}, here are the best DigitalOcean alternatives:
                </p>
              </div>

              {/* Recommendations */}
              {recommendations.map((rec, idx) => (
                <div key={idx} className="border-2 border-gray-200 rounded-lg p-6 mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-blue-600">{rec.mapping.doProduct}</h3>
                      <p className="text-gray-600">{rec.mapping.doProductDescription}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full font-semibold ${getComplexityColor(rec.mapping.migrationComplexity)}`}>
                      Migration: {rec.mapping.migrationComplexity}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold mb-2">Key Features</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {rec.mapping.features.map((feature, i) => (
                          <li key={i}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold mb-2">Pricing</h4>
                      <p className="text-gray-700">{rec.mapping.pricingHighlights}</p>
                      
                      <h4 className="font-bold mb-2 mt-4">Differences from AWS</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {rec.mapping.keyDifferences.map((diff, i) => (
                          <li key={i}>{diff}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-4">
                    <a
                      href={rec.mapping.awsDocs}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      AWS Docs →
                    </a>
                    <a
                      href={rec.mapping.doDocs}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      DO Docs →
                    </a>
                  </div>
                </div>
              ))}

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setShowChatbot(true)}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
                >
                  💬 Chat with DO Expert
                </button>
                <button
                  onClick={() => window.location.href = "/"}
                  className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition"
                >
                  Back to Home
                </button>
                <button
                  onClick={() => { setStep(1); setSelectedServices([]); setUseCase(""); setPriorities([]); }}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  New Comparison
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Show chatbot when requested */}
      {showChatbot && (
        <DOComparisonChatbot 
          awsServices={selectedServices}
          priorities={priorities}
        />
      )}
    </div>
  );
}

