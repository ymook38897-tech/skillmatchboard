const features = [
  {
    id: 1,
    icon: '🤖',
    title: 'AI-Powered Matching',
    description: 'Our advanced AI analyzes skills and preferences to find your perfect professional match.',
  },
  {
    id: 2,
    icon: '⚡',
    title: 'Lightning Fast',
    description: 'Get matched with opportunities in seconds, not days. Real-time notifications keep you updated.',
  },
  {
    id: 3,
    icon: '🔒',
    title: 'Secure & Private',
    description: 'Your data is encrypted and protected. Full control over what information you share.',
  },
  {
    id: 4,
    icon: '📊',
    title: 'Advanced Analytics',
    description: 'Track your matches, acceptance rates, and career growth with detailed insights.',
  },
  {
    id: 5,
    icon: '🌍',
    title: 'Global Network',
    description: 'Connect with professionals and opportunities from around the world.',
  },
  {
    id: 6,
    icon: '🎓',
    title: 'Skill Development',
    description: 'Access resources to develop skills that match your career aspirations.',
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 sm:py-32 bg-white">
      <div className="container-max section-padding py-0">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to find the perfect professional match and advance your career.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className="group p-8 rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6">
            Ready to discover your perfect skill match?
          </p>
          <button className="btn-primary text-lg px-8 py-4">
            Explore All Features
          </button>
        </div>
      </div>
    </section>
  )
}
