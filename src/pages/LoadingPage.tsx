import { useEffect, useState } from 'react'

interface LoadingPageProps {
  onComplete: () => void
}

export function LoadingPage({ onComplete }: LoadingPageProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(onComplete, 500)
          return 100
        }
        const increment = Math.random() * 30
        const next = Math.min(prev + increment, 100)
        if (next >= 100) {
          clearInterval(interval)
          setTimeout(onComplete, 500)
        }
        return next
      })
    }, 500)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 -translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10">
          {/* Animated Icon */}
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center animate-bounce">
              <span className="text-4xl">🔍</span>
            </div>
          </div>

          {/* Loading Text */}
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            분석 중입니다
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            답변을 바탕으로 어울리는 직무를 찾고 있어요.
          </p>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary-600 to-accent-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="mt-4 text-gray-600 font-semibold">
              {Math.round(progress)}%
            </p>
          </div>

          {/* Loading dots animation */}
          <div className="flex justify-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary-600 animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-3 h-3 rounded-full bg-primary-600 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 rounded-full bg-primary-600 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
