"use client";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ExamSelectionPage() {
  const { exam_id } = useParams();
  const examName = exam_id?.toString().toUpperCase() || "";
  
  const isSAA = exam_id === "saa";
  
  // Define exam options based on exam type
  const examOptions = isSAA
    ? [
        { id: "saa1", name: "Practice Test 1", description: "Full exam questions" },
        { id: "saa3", name: "Practice Test 3", description: "Full exam questions" },
        { id: "saa-mini", name: "Mini Quiz", description: "10 random questions", isMini: true },
      ]
    : [
        { id: "sap2", name: "Practice Test 2", description: "Full exam questions" },
        { id: "sap3", name: "Practice Test 3", description: "Full exam questions" },
        { id: "sap-mini", name: "Mini Quiz", description: "10 random questions", isMini: true },
      ];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6">
      <div className="text-center space-y-6 max-w-2xl w-full">
        <h1 className="text-4xl font-bold">AWS {examName} Practice Exams</h1>
        <p className="text-lg text-blue-100 mb-8">
          Choose your exam format
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {examOptions.map((exam) => (
            <Link
              key={exam.id}
              href={`/test/${exam.id}`}
              className={`p-6 rounded-2xl shadow-lg transition transform hover:scale-105 ${
                exam.isMini
                  ? "bg-green-500 hover:bg-green-400"
                  : "bg-white text-blue-700 hover:bg-blue-50"
              }`}
            >
              <div className="text-center">
                <h2 className={`text-2xl font-bold mb-2 ${exam.isMini ? "text-white" : ""}`}>
                  {exam.isMini ? "🎯" : "📚"} {exam.name}
                </h2>
                <p className={`text-sm ${exam.isMini ? "text-green-50" : "text-gray-600"}`}>
                  {exam.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
        
        <Link
          href="/"
          className="inline-block mt-8 text-blue-100 hover:text-white underline"
        >
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}

