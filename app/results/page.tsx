"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Chatbot from "../components/Chatbot";

interface Question {
  "Q#": string;
  Question: string;
  "Correct Answer"?: string;
  "Correct Text"?: string;
  "Correct Letters"?: string;
  "Option A"?: string;
  "Option B"?: string;
  "Option C"?: string;
  "Option D"?: string;
  "Option E"?: string;
  "Option F"?: string;
  "Other Options"?: string;
  Explanation: string;
  Domain: string;
  Reference?: string;
  [key: string]: any; // Allow for case variations
}

interface Answer {
  [questionId: string]: string;
}

export default function ResultsPage() {
  const [answers, setAnswers] = useState<Answer>({});
  const [questions, setQuestions] = useState<Question[]>([]);
  const [examType, setExamType] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [domainBreakdown, setDomainBreakdown] = useState<Record<string, {correct: number, total: number}>>({});
  const [isMiniQuiz, setIsMiniQuiz] = useState(false);
  const [chatbotContext, setChatbotContext] = useState<string | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    // Get exam type from URL or localStorage
    const urlExamType = window.location.pathname.includes('saa') ? 'saa' : 'sap';
    const storedExamType = localStorage.getItem('examType') || urlExamType;
    setExamType(storedExamType);

    // Check if this was a mini quiz
    const isMini = localStorage.getItem('isMiniQuiz') === 'true';
    setIsMiniQuiz(isMini);

    // Get stored answers
    const storedAnswers = localStorage.getItem("answers");
    if (storedAnswers) {
      setAnswers(JSON.parse(storedAnswers));
    }

    // Fetch questions to compare answers
    fetchQuestions(storedExamType);
  }, []);

  const fetchQuestions = async (examType: string) => {
    try {
      // Only use saved mini-quiz questions if we were in mini-quiz mode
      const wasMiniQuiz = localStorage.getItem('isMiniQuiz') === 'true';
      if (wasMiniQuiz) {
        const savedQuestions = localStorage.getItem("testQuestions");
        if (savedQuestions) {
          setQuestions(JSON.parse(savedQuestions));
          setLoading(false);
          return;
        }
      } else {
        // Ensure stale mini-quiz questions don't leak into full exam results
        localStorage.removeItem("testQuestions");
      }
      
      // Otherwise fetch from API
      const res = await fetch(`/api/test/${examType}`);
      const data = await res.json();
      setQuestions(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error loading questions", e);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (questions.length > 0 && Object.keys(answers).length > 0) {
      calculateResults();
    }
  }, [questions, answers]);

  const calculateResults = () => {
    let correctCount = 0;
    const domainStats: Record<string, {correct: number, total: number}> = {};

    questions.forEach((question) => {
      const questionId = question["Q#"];
      const userAnswer = answers[questionId];
      const correctAnswer = question["Correct Answer"] || question["Correct Text"];
      const domain = question.Domain || "Unknown";

      // Initialize domain stats
      if (!domainStats[domain]) {
        domainStats[domain] = { correct: 0, total: 0 };
      }
      domainStats[domain].total++;

      // Check if answer is correct
      // User answer is now stored as letters (A, B, C, etc.)
      const userLetters = userAnswer?.trim().toUpperCase();
      const correctLetters = question["Correct Letters"]?.trim().toUpperCase();
      const correctText = question["Correct Text"]?.trim();
      
      // Check if there's a correct answer to compare against
      if (userLetters && correctLetters) {
        // Sort both to compare (for multi-select questions)
        const normalizedUser = userLetters.split('').sort().join('');
        const normalizedCorrect = correctLetters.split('').sort().join('');
        
        // Check for exact match
        const isCorrect = normalizedUser === normalizedCorrect;
        
        if (isCorrect) {
          correctCount++;
          domainStats[domain].correct++;
        }
      } else if (userLetters && correctText) {
        // Fall back to text comparison if no correct letters field
        // This handles older CSV formats
        const isCorrect = userLetters === correctText.toUpperCase();
        if (isCorrect) {
          correctCount++;
          domainStats[domain].correct++;
        }
      }
    });

    setScore(correctCount);
    setTotalQuestions(questions.length);
    setDomainBreakdown(domainStats);
  };

  const getScorePercentage = () => {
    return totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 80) return "Excellent! You're well prepared for the exam.";
    if (percentage >= 70) return "Good job! Review the areas you missed.";
    if (percentage >= 60) return "Not bad, but you need more study.";
    return "Keep studying! Focus on the fundamentals.";
  };

  // Helper function to get full option text from letter
  const getOptionText = (question: Question, answerStr: string): string => {
    const optionMap: Record<string, string> = {};
    
    const addIf = (letter: string, value: unknown) => {
      if (typeof value === 'string' && value.trim()) optionMap[letter] = value.trim();
    };
    // Populate from common columns
    addIf('A', (question as any)["Option A"] || (question as any)["Option a"] || (question as any)["A"] || (question as any)["Answer A"] || (question as any)["Choice A"]);
    addIf('B', (question as any)["Option B"] || (question as any)["Option b"] || (question as any)["B"] || (question as any)["Answer B"] || (question as any)["Choice B"]);
    addIf('C', (question as any)["Option C"] || (question as any)["Option c"] || (question as any)["C"] || (question as any)["Answer C"] || (question as any)["Choice C"]);
    addIf('D', (question as any)["Option D"] || (question as any)["Option d"] || (question as any)["D"] || (question as any)["Answer D"] || (question as any)["Choice D"]);
    addIf('E', (question as any)["Option E"] || (question as any)["Option e"] || (question as any)["E"] || (question as any)["Answer E"] || (question as any)["Choice E"]);
    addIf('F', (question as any)["Option F"] || (question as any)["Option f"] || (question as any)["F"] || (question as any)["Answer F"] || (question as any)["Choice F"]);

    // Fallback: combined options parsing
    if (Object.keys(optionMap).length === 0) {
      const combined = (question as any)["Other Options"] || (question as any)["Options"] || (question as any)["Choices"];
      if (typeof combined === 'string') {
        const regex = /\b([A-Fa-f])\s*[\)\-:\.]\s*([^\n;]+)/g;
        let m: RegExpExecArray | null;
        while ((m = regex.exec(combined)) !== null) {
          optionMap[m[1].toUpperCase()] = m[2].trim();
        }
      }
    }
    
    // If it's already formatted, return as is
    if (answerStr.includes(' - ')) {
      return answerStr;
    }
    
    // If the answer is very long (looks like full text), return as is
    if (answerStr.length > 50) {
      return answerStr;
    }
    
    // Check if it's a single letter answer
    if (answerStr.length === 1 && /[A-Fa-f]/.test(answerStr)) {
      const text = optionMap[answerStr.toUpperCase()];
      if (text) {
        return `${answerStr.toUpperCase()} - ${text}`;
      }
      return answerStr;
    }
    
    // Check if it's multiple letters (e.g., "BC", "ADE")
    const letters = answerStr.split('').filter(c => /[A-Fa-f]/.test(c));
    if (letters.length > 0 && letters.length <= 5 && letters.length === answerStr.trim().length) {
      const texts = letters.map(l => {
        const text = optionMap[l.toUpperCase()];
        return text ? `${l.toUpperCase()} - ${text}` : l;
      });
      return texts.join(' | ');
    }
    
    // If it doesn't match any pattern, return as is
    return answerStr;
  };

  // Helper function to get clean domain name
  const getCleanDomainName = (domain: string): string => {
    // Standard AWS certification domains
    const domainMap: Record<string, string> = {
      'resilient': 'Design Resilient Architectures',
      'high-performing': 'Design High-Performing Architectures',
      'secure': 'Design Secure Architectures',
      'cost-optimized': 'Design Cost-Optimized Architectures',
      'operational-excellence': 'Design Operational Excellence',
      's3': 'Storage & Data Management',
      'ec2': 'Compute',
      'vpc': 'Networking & Content Delivery',
      'rds': 'Databases',
      'waf': 'Security & Compliance',
      'cloudfront': 'Content Delivery',
      'iam': 'Security & Compliance',
      'organizations': 'Governance & Management',
    };

    // Check if it's already a clean domain name
    if (/^[A-Z]/.test(domain) && !domain.includes('http')) {
      return domain;
    }

    // Try to extract from URL
    const parts = domain.split(';');
    const url = parts.find(p => p.includes('aws.amazon.com') || p.includes('docs.aws'));
    
    if (url) {
      try {
        const urlObj = new URL(url.trim());
        const pathParts = urlObj.pathname.split('/').filter(p => p);
        
        // Check domain mapping first
        for (const [key, value] of Object.entries(domainMap)) {
          if (urlObj.pathname.toLowerCase().includes(key)) {
            return value;
          }
        }
        
        // Extract service name
        const lastPart = pathParts[pathParts.length - 1] || pathParts[0] || 'AWS Service';
        return lastPart.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
      } catch (e) {
        return domain;
      }
    }

    // Check if domain contains key terms
    const lowerDomain = domain.toLowerCase();
    for (const [key, value] of Object.entries(domainMap)) {
      if (lowerDomain.includes(key)) {
        return value;
      }
    }

    return domain;
  };

  const retakeTest = () => {
    localStorage.removeItem("answers");
    localStorage.removeItem("testQuestions");
    localStorage.removeItem("isMiniQuiz");
    router.push(`/test/${examType}`);
  };

  const nextQuiz = () => {
    // Extract base exam type (saa or sap) regardless of suffix (1, 2, 3, -mini, etc.)
    const baseType = examType.toLowerCase().startsWith('saa') ? 'saa' : 
                     examType.toLowerCase().startsWith('sap') ? 'sap' : examType;
    const miniType = `${baseType}-mini`;
    
    // Clear all localStorage keys for both current exam and new mini quiz
    localStorage.removeItem("answers");
    localStorage.removeItem("testQuestions");
    localStorage.removeItem("isMiniQuiz");
    
    // Clear exam-specific localStorage keys for the mini quiz (so we get fresh questions)
    localStorage.removeItem(`answers-${miniType}`);
    localStorage.removeItem(`questions-${miniType}`);
    localStorage.removeItem(`flags-${miniType}`);
    localStorage.removeItem(`current-${miniType}`);
    
    // Clear current exam keys too if they exist
    localStorage.removeItem(`answers-${examType}`);
    localStorage.removeItem(`questions-${examType}`);
    localStorage.removeItem(`flags-${examType}`);
    localStorage.removeItem(`current-${examType}`);
    
    router.push(`/test/${miniType}`);
  };

  const goHome = () => {
    localStorage.removeItem("answers");
    localStorage.removeItem("testQuestions");
    localStorage.removeItem("examType");
    localStorage.removeItem("isMiniQuiz");
    router.push("/");
  };

  // Helper function to get reference field (case-insensitive, multiple possible column names)
  const getReference = (question: Question): string | undefined => {
    // Try different case variations and column name variations
    // Check for: Reference, References, Links, Docs, Documentation, Source, Sources
    const possibleKeys = [
      "Reference", "reference", "REFERENCE",
      "References", "references", "REFERENCES",
      "Links", "links", "LINKS",
      "Docs", "docs", "DOCS",
      "Documentation", "documentation", "DOCUMENTATION",
      "Source", "source", "SOURCE",
      "Sources", "sources", "SOURCES"
    ];
    
    // First, try exact matches with common names
    for (const key of possibleKeys) {
      const value = (question as any)[key];
      if (value && typeof value === 'string' && value.trim()) {
        return value.trim();
      }
    }
    
    // Also check bracket notation for all keys
    for (const key of possibleKeys) {
      const value = question[key as keyof Question];
      if (value && typeof value === 'string' && value.trim()) {
        return value.trim();
      }
    }
    
    // Fallback: search all properties for any key containing ref, link, doc, or source
    const lowerKeyTerms = ['ref', 'link', 'doc', 'source'];
    for (const key in question) {
      if (question.hasOwnProperty(key)) {
        const lowerKey = key.toLowerCase();
        // Check if key contains any of our search terms
        if (lowerKeyTerms.some(term => lowerKey.includes(term))) {
          const value = (question as any)[key];
          if (value && typeof value === 'string' && value.trim()) {
            return value.trim();
          }
        }
      }
    }
    
    return undefined;
  };

  // Helper function to parse and render links
  const renderLinks = (text: string | undefined) => {
    if (!text || !text.trim()) return null;
    
    // Split by semicolon to handle multiple URLs, or by comma
    const separators = [';', ',', '\n'];
    let parts: string[] = [text];
    
    for (const sep of separators) {
      if (text.includes(sep)) {
        parts = text.split(sep).map(p => p.trim()).filter(Boolean);
        break;
      }
    }
    
    if (parts.length === 0) return null;
    
    return (
      <span className="space-x-2 flex flex-wrap gap-2">
        {parts.map((part, idx) => {
          const cleanPart = part.trim().replace(/[\s]+/g, ' ');
          const containsEllipsis = /\.\.\.|\u2026/.test(cleanPart);
          const displayText = cleanPart.length > 60 ? cleanPart.substring(0, 60) + '...' : cleanPart;

          const toHttps = (val: string) => val.startsWith('www.') ? `https://${val}` : val;
          const isExplicitUrl = cleanPart.startsWith('http://') || cleanPart.startsWith('https://') || cleanPart.startsWith('www.');
          const looksLikeAwsDocs = cleanPart.includes('.') && (cleanPart.includes('aws.amazon.com') || cleanPart.includes('docs.aws'));

          // If the reference appears truncated with ellipsis, avoid creating a broken link.
          if (containsEllipsis) {
            const query = encodeURIComponent(cleanPart.replace(/\u2026|\.\.\./g, ''));
            const searchUrl = `https://www.google.com/search?q=${query}+site:docs.aws.amazon.com`;
            return (
              <span key={idx} className="text-xs text-gray-700 flex items-center gap-2">
                {displayText}
                <a
                  href={searchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  search
                </a>
              </span>
            );
          }

          if (isExplicitUrl) {
            const url = toHttps(cleanPart);
            return (
              <a
                key={idx}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline text-xs break-all"
              >
                {displayText}
              </a>
            );
          }

          if (looksLikeAwsDocs) {
            const url = 'https://' + cleanPart.replace(/^https?:\/\//, '');
            return (
              <a
                key={idx}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline text-xs break-all"
              >
                {displayText}
              </a>
            );
          }

          // Plain text fallback
          return <span key={idx} className="text-gray-700 text-xs">{displayText}</span>;
        })}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Calculating your results...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0 || Object.keys(answers).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Results Found</h1>
          <p className="text-gray-600 mb-6">It looks like you haven't completed a test yet.</p>
          <button
            onClick={goHome}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Take a Test
          </button>
        </div>
      </div>
    );
  }

  const percentage = getScorePercentage();

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {examType.toUpperCase()} Practice Test Results
            </h1>
            <p className="text-gray-600">Here's how you performed</p>
          </div>

          {/* Chatbot RAG Tip */}
          <div className="mb-6">
            <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4 text-indigo-900">
              <p className="text-sm leading-relaxed">
                <span className="font-semibold">Tip:</span> The chatbot in the bottom-right corner uses RAG and includes access to the test questions and correct answers for review.
              </p>
              <p className="text-sm leading-relaxed mt-2">
                Because the DigitalOcean AI Agent is embedded via an iframe sandbox, it cannot directly access or reference the live page context (such as your score or exam state). This is a product limitation, not an application limitation.
              </p>
              <p className="text-sm leading-relaxed mt-2">
                👉 <a href="https://docs.digitalocean.com/products/gradient-ai-platform/how-to/use-agents/?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer" className="text-blue-700 underline hover:text-blue-900">DigitalOcean AI Agents Documentation</a>
              </p>
            </div>
          </div>

          {/* Score Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="text-center">
              <div className={`text-6xl font-bold mb-4 ${getScoreColor(percentage)}`}>
                {percentage}%
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {score} out of {totalQuestions} correct
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                {getScoreMessage(percentage)}
              </p>
              
              <div className="flex gap-4 justify-center flex-wrap">
                {isMiniQuiz && (
                  <button
                    onClick={nextQuiz}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
                  >
                    Next Quiz
                  </button>
                )}
                <button
                  onClick={() => router.push(`/exam/${examType.replace('-mini', '')}`)}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
                >
                  Back to Exams
                </button>
                <button
                  onClick={retakeTest}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  Retake Test
                </button>
                <button
                  onClick={goHome}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>

          {/* Detailed Review */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Question Review</h3>
            <div className="space-y-6">
              {questions.map((question, index) => {
                const questionId = question["Q#"];
                const userAnswer = answers[questionId];
                
                // Determine if answer is correct by comparing letters
                const userLetters = userAnswer?.trim().toUpperCase() || '';
                const correctLettersStr = question["Correct Letters"]?.trim().toUpperCase() || '';
                const isCorrect = userLetters && correctLettersStr && 
                  userLetters.split('').sort().join('') === correctLettersStr.split('').sort().join('');
                
                // Get full option text for user answer
                const userAnswerText = userAnswer ? getOptionText(question, userAnswer) : 'No answer provided';
                
                // Get correct answer text
                const correctLetters = question["Correct Letters"] || question["Correct Answer"] || question["Correct Text"] || '';
                const correctAnswerText = correctLetters ? getOptionText(question, correctLetters) : 'No correct answer data available';
                
                return (
                  <div key={`${questionId ?? 'q'}-${index}`} className={`border-l-4 p-4 rounded-r-lg ${
                    isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">
                        Question {index + 1}
                      </h4>
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        isCorrect 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-4 text-base leading-relaxed">{question.Question}</p>
                    
                    <div className="grid grid-cols-1 gap-4 mb-3">
                      <div className="border-t pt-3">
                        <p className="font-semibold text-gray-900 mb-2">Your Answer:</p>
                        <p className={`p-3 rounded-lg text-sm leading-relaxed ${isCorrect ? 'bg-green-100 text-green-900 border border-green-300' : 'bg-red-100 text-red-900 border border-red-300'}`}>
                          {userAnswerText}
                        </p>
                      </div>
                      <div className="border-t pt-3">
                        <p className="font-semibold text-gray-900 mb-2">Correct Answer (full text):</p>
                        <p className="p-3 rounded-lg bg-blue-100 text-blue-900 border border-blue-300 text-sm leading-relaxed">
                          {correctAnswerText}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4 bg-gray-50 p-3 rounded-lg">
                      <p className="font-semibold text-gray-900 mb-2">Why this is correct:</p>
                      <p className="text-gray-700 text-sm leading-relaxed">{question.Explanation}</p>
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-4 text-xs">
                      {question.Domain && (
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-gray-600">Domain:</span>
                          <span className="text-blue-700">{getCleanDomainName(question.Domain)}</span>
                        </div>
                      )}
                      {(() => {
                        const reference = getReference(question);
                        return reference && (
                          <div className="flex items-center gap-1 flex-wrap">
                            <span className="font-semibold text-gray-600">References:</span>
                            {renderLinks(reference)}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <Chatbot 
        score={score} 
        totalQuestions={totalQuestions} 
        examType={examType} 
        domainBreakdown={domainBreakdown}
        context={chatbotContext}
      />
    </>
  );
}

