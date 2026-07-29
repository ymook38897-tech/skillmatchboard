export function CTA() {
  return (
    <section className="py-24 sm:py-32 bg-gradient-to-r from-primary-600 to-accent-600 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-white opacity-10 rounded-full -translate-y-1/2 -translate-x-1/2"></div>
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-white opacity-10 rounded-full translate-y-1/2"></div>

      <div className="container-max section-padding py-0 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Find Your Perfect Match?
          </h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Join thousands of professionals who have already transformed their careers with SkillMatch.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center justify-center px-8 py-4 font-semibold text-primary-600 bg-white rounded-lg hover:bg-gray-50 transition-colors duration-200 active:scale-95">
              Get Started Free
            </button>
            <button className="inline-flex items-center justify-center px-8 py-4 font-semibold text-white border-2 border-white rounded-lg hover:bg-white/10 transition-all duration-200 active:scale-95">
              Schedule Demo
            </button>
          </div>

          {/* Trust badge */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-white/70 text-sm mb-4">Trusted by leading companies</p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              <div className="text-white/60 font-semibold">TechCorp</div>
              <div className="text-white/60 font-semibold">CloudVenture</div>
              <div className="text-white/60 font-semibold">DataFlow</div>
              <div className="text-white/60 font-semibold">InnovateLabs</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
