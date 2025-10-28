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
  Reference: string;
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
      // For mini quizzes, try to use the saved questions from the test
      const savedQuestions = localStorage.getItem("testQuestions");
      if (savedQuestions) {
        setQuestions(JSON.parse(savedQuestions));
        setLoading(false);
        return;
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
    
    if (question["Option A"]) optionMap['A'] = question["Option A"];
    if (question["Option B"]) optionMap['B'] = question["Option B"];
    if (question["Option C"]) optionMap['C'] = question["Option C"];
    if (question["Option D"]) optionMap['D'] = question["Option D"];
    if (question["Option E"]) optionMap['E'] = question["Option E"];
    if (question["Option F"]) optionMap['F'] = question["Option F"];
    
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
    localStorage.removeItem("answers");
    localStorage.removeItem("testQuestions");
    localStorage.removeItem("isMiniQuiz");
    const miniType = examType.replace('saa', 'saa-mini').replace('sap', 'sap-mini');
    router.push(`/test/${miniType}`);
  };

  const goHome = () => {
    localStorage.removeItem("answers");
    localStorage.removeItem("testQuestions");
    localStorage.removeItem("examType");
    localStorage.removeItem("isMiniQuiz");
    router.push("/");
  };

  // Helper function to parse and render links
  const renderLinks = (text: string | undefined) => {
    if (!text) return null;
    
    // Split by semicolon to handle multiple URLs
    const parts = text.split(';').map(p => p.trim()).filter(Boolean);
    
    return (
      <span className="space-x-2">
        {parts.map((part, idx) => {
          // Check if it's a URL
          if (part.startsWith('http://') || part.startsWith('https://')) {
            return (
              <a 
                key={idx}
                href={part} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline text-xs"
              >
                {part.length > 50 ? part.substring(0, 50) + '...' : part}
              </a>
            );
          }
          return <span key={idx} className="text-gray-700 text-xs">{part}</span>;
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
                  <div key={questionId} className={`border-l-4 p-4 rounded-r-lg ${
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
                        <p className="font-semibold text-gray-900 mb-2">Correct Answer:</p>
                        <p className="p-3 rounded-lg bg-blue-100 text-blue-900 border border-blue-300 text-sm leading-relaxed">
                          {correctAnswerText}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4 bg-gray-50 p-3 rounded-lg">
                      <p className="font-semibold text-gray-900 mb-2">Explanation:</p>
                      <p className="text-gray-700 text-sm leading-relaxed">{question.Explanation}</p>
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-4 text-xs">
                      {question.Domain && (
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-gray-600">Domain:</span>
                          <span className="text-blue-700">{getCleanDomainName(question.Domain)}</span>
                        </div>
                      )}
                      {question.Reference && (
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-gray-600">References:</span>
                          <div className="flex gap-2">{renderLinks(question.Reference)}</div>
                        </div>
                      )}
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
      />
    </>
  );
}

