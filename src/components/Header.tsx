import { useState } from 'react'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <nav className="container-max section-padding py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-accent-600"></div>
            <span className="text-xl font-bold text-gray-900">SkillMatch</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
              Features
            </a>
            <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">
              Testimonials
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
              Pricing
            </a>
            <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">
              About
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button className="btn-outline text-sm">Sign In</button>
            <button className="btn-primary text-sm">Get Started</button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-2 pb-4">
            <a href="#features" className="block px-4 py-2 text-gray-600 hover:text-gray-900">
              Features
            </a>
            <a href="#testimonials" className="block px-4 py-2 text-gray-600 hover:text-gray-900">
              Testimonials
            </a>
            <a href="#pricing" className="block px-4 py-2 text-gray-600 hover:text-gray-900">
              Pricing
            </a>
            <a href="#about" className="block px-4 py-2 text-gray-600 hover:text-gray-900">
              About
            </a>
            <div className="flex gap-2 pt-2">
              <button className="flex-1 btn-outline text-sm">Sign In</button>
              <button className="flex-1 btn-primary text-sm">Get Started</button>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
