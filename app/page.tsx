export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Hi, I’m your Study Assistant</h1>
        <p className="text-lg text-blue-100">
          Which AWS exam are you preparing for?
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <a
            href="/test/saa"
            className="bg-white text-blue-700 font-semibold py-3 px-8 rounded-2xl shadow-lg hover:bg-blue-100 transition"
          >
            AWS Solutions Architect Associate
          </a>
          <a
            href="/test/sap"
            className="bg-white text-blue-700 font-semibold py-3 px-8 rounded-2xl shadow-lg hover:bg-blue-100 transition"
          >
            AWS Solutions Architect Professional
          </a>
        </div>
      </div>
    </main>
  );
}
