import Chatbot from "./components/Chatbot";

export default function Home() {
  return (
    <>
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-700 text-white p-6">
        <div className="text-center space-y-8 max-w-4xl">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold">AWS One Stop</h1>
            <p className="text-xl text-blue-100">
              Master AWS certifications and discover DigitalOcean alternatives
            </p>
          </div>
          
          {/* Two Equal Feature Cards */}
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            {/* Compare DO-AWS Card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl hover:bg-white/15 transition-all transform hover:scale-105">
              <div className="flex flex-col items-center space-y-4">
                <div className="text-6xl mb-4">🔄</div>
                <h2 className="text-3xl font-bold mb-2">Compare DigitalOcean to AWS</h2>
                <p className="text-blue-100 text-center mb-6">
                  Find the perfect DigitalOcean alternatives to your AWS services. Get personalized recommendations, pricing comparisons, and migration guidance.
                </p>
                <a
                  href="/compare"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition text-lg"
                >
                  Start Comparison →
                </a>
              </div>
            </div>

            {/* Practice AWS Certifications Card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl hover:bg-white/15 transition-all transform hover:scale-105">
              <div className="flex flex-col items-center space-y-4">
                <div className="text-6xl mb-4">🎓</div>
                <h2 className="text-3xl font-bold mb-2">Practice AWS Certifications</h2>
                <p className="text-blue-100 text-center mb-6">
                  Prepare for AWS Solutions Architect (Associate & Professional) exams with practice tests, mini quizzes, and detailed explanations.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <a
                    href="/exam/saa"
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition text-center"
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
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-sm text-blue-100 space-y-2">
            <p>✨ Built with Next.js, Tailwind CSS, and DigitalOcean Gradient Agents</p>
            <p>📚 Comprehensive practice tests with real AWS exam questions</p>npm
          </div>
        </div>
      </main>
      <Chatbot />
    </>
  );
}
