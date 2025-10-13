export default function InterviewLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 px-4 sm:px-6 py-6">
      <div className="w-full mx-auto">
        {/* Header */}
        <header className="mb-8 text-center sm:text-left">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">🎯</span>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Interview Practice
              </h1>
              <p className="text-gray-600 mt-1">
                Practice smart. Improve with every assessment.
              </p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="space-y-6">{children}</main>
      </div>
    </div>
  );
}
