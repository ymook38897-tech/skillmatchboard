const testimonials = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'Senior Product Designer',
    company: 'TechVentures',
    image: '👩‍💼',
    quote: 'SkillMatch helped me find a role that perfectly matched my design expertise and career goals. The AI matching is incredibly accurate!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    role: 'Full Stack Developer',
    company: 'InnovateLabs',
    image: '👨‍💻',
    quote: 'I was skeptical at first, but the matches I received were exactly what I was looking for. Found my dream job within weeks!',
    rating: 5,
  },
  {
    id: 3,
    name: 'Elena Rodriguez',
    role: 'Data Scientist',
    company: 'DataFlow Systems',
    image: '👩‍🔬',
    quote: 'The platform is intuitive and the matching algorithm is spot-on. Highly recommend to anyone looking to advance their career.',
    rating: 5,
  },
  {
    id: 4,
    name: 'James Wilson',
    role: 'Product Manager',
    company: 'CloudSync',
    image: '👨‍💼',
    quote: 'Best career platform I\'ve used. The analytics and insights helped me understand my market value better.',
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 sm:py-32 bg-gradient-to-br from-gray-50 to-white">
      <div className="container-max section-padding py-0">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Loved by Professionals
          </h2>
          <p className="text-xl text-gray-600">
            Join thousands of satisfied users who found their perfect career match.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="p-8 rounded-xl border border-gray-200 bg-white hover:shadow-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-700 font-medium mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                <div className="text-4xl">{testimonial.image}</div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
