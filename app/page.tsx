import Chatbot from "./components/Chatbot";

export default function Home() {
  return (
    <>
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-700 text-white p-6">
        <div className="text-center space-y-8 max-w-7xl w-full">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              Raph Hackathon: AWS Study Shop and feature comparison
            </h1>
            <p className="text-xl text-blue-100">
              SAA and SAP study buddy and help deciphering all those AWS features to the DO tool stack
            </p>
          </div>
          
          {/* Three Equal Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {/* DO <> AWS Comparison Card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl hover:bg-white/15 transition-all transform hover:scale-105 flex flex-col h-full">
              <div className="flex flex-col items-center space-y-4 flex-grow">
                <h2 className="text-3xl font-bold text-center">DO &lt;&gt; AWS Comparison</h2>
                <p className="text-blue-100 text-center">
                  Compare AWS services to DigitalOcean products first, or open-source alternatives when DO doesn't have a native solution.
                </p>
              </div>
              <a
                href="/compare"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition text-lg text-center mt-6"
              >
                Search Alternatives →
              </a>
            </div>

            {/* Practice AWS Certifications Card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl hover:bg-white/15 transition-all transform hover:scale-105 flex flex-col h-full">
              <div className="flex flex-col items-center space-y-4 flex-grow">
                <h2 className="text-3xl font-bold text-center">Practice AWS Certifications</h2>
                <p className="text-blue-100 text-center">
                  Prepare for AWS Solutions Architect (Associate & Professional) exams with practice tests, mini quizzes, and detailed explanations.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full mt-6">
                <a
                  href="/exam/saa"
                  className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition text-center"
                >
                  SAA
                </a>
                <a
                  href="/exam/sap"
                  className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition text-center"
                >
                  SAP
                </a>
              </div>
            </div>

            {/* Flashcards Card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl hover:bg-white/15 transition-all transform hover:scale-105 flex flex-col h-full">
              <div className="flex flex-col items-center space-y-4 flex-grow">
                <h2 className="text-3xl font-bold text-center">Interactive Flashcards</h2>
                <p className="text-blue-100 text-center">
                  Study AWS concepts with interactive flip cards. Filter by category, search quickly, and shuffle for dynamic learning.
                </p>
              </div>
              <a
                href="/flashcards"
                className="w-full bg-violet-500 hover:bg-violet-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition text-lg text-center mt-6"
              >
                Start Studying →
              </a>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-sm text-blue-100 space-y-2">
            <p>Built with Next.js, Tailwind CSS, and DigitalOcean Gradient Agents</p>
            <p>Comprehensive practice tests with real AWS exam questions</p>
          </div>
        </div>
      </main>
      <Chatbot />
    </>
  );
}
