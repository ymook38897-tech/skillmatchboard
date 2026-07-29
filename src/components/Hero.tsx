export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-20 pb-24 sm:pt-32 sm:pb-32">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-y-1/2"></div>

      <div className="container-max section-padding py-0 relative z-10">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <div className="inline-block mb-6 px-4 py-2 bg-primary-50 rounded-full border border-primary-200">
            <span className="text-sm font-semibold gradient-text">
              🚀 Welcome to the Future of Skill Matching
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Find Your Perfect
            <span className="gradient-text"> Skill Match</span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-600 mb-8 leading-relaxed">
            Connect talented professionals with opportunities that match their unique skills and career goals. Powered by AI-driven matching.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="btn-primary">
              Start Matching Today
            </button>
            <button className="btn-secondary">
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-8 border-t border-gray-200">
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="text-3xl sm:text-4xl font-bold gradient-text">10K+</div>
              <p className="text-sm sm:text-base text-gray-600">Active Users</p>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-3xl sm:text-4xl font-bold gradient-text">95%</div>
              <p className="text-sm sm:text-base text-gray-600">Match Success Rate</p>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="text-3xl sm:text-4xl font-bold gradient-text">4.8★</div>
              <p className="text-sm sm:text-base text-gray-600">User Rating</p>
            </div>
          </div>
        </div>

        {/* Hero Image Placeholder */}
        <div className="mt-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl opacity-10 blur-3xl"></div>
          <div className="relative bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl border border-gray-200 h-96 flex items-center justify-center overflow-hidden">
            <div className="text-center">
              <div className="text-6xl mb-4">🎯</div>
              <p className="text-gray-600 font-semibold">Dashboard Preview</p>
              <p className="text-gray-500 text-sm mt-2">See your matches in real-time</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
