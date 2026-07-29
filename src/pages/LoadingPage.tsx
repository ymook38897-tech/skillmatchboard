import { useEffect, useState } from 'react'
import { Button } from '../components/common/Button'

interface LoadingPageProps {
  status: 'loading' | 'error'
  onRetry: () => void
}

export function LoadingPage({ status, onRetry }: LoadingPageProps) {
  const [progress, setProgress] = useState(8)
  const hasError = status === 'error'

  useEffect(() => {
    if (hasError) {
      setProgress(0)
      return
    }

    setProgress(8)
    const interval = window.setInterval(() => {
      setProgress((previous) => Math.min(previous + 7, 92))
    }, 500)

    return () => window.clearInterval(interval)
  }, [hasError])

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center px-4"
      aria-busy={!hasError}
    >
      <div className="max-w-2xl w-full text-center">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 -translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10" role={hasError ? 'alert' : undefined}>
          {/* Animated Icon */}
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center animate-bounce">
              <span className="text-4xl" aria-hidden="true">
                {hasError ? '!' : '🔍'}
              </span>
            </div>
          </div>

          {/* Loading Text */}
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {hasError ? '직무 정보를 불러오지 못했습니다.' : '분석 중입니다'}
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            {hasError
              ? '잠시 후 다시 시도해주세요.'
              : '답변을 바탕으로 어울리는 직무를 찾고 있어요.'}
          </p>

          {hasError ? (
            <div>
              <Button
                variant="primary"
                size="xl"
                onClick={onRetry}
                className="w-full sm:w-auto min-w-64"
              >
                다시 시도
              </Button>
            </div>
          ) : (
            <>
              {/* Progress Bar */}
              <div className="mb-6">
                <div
                  className="w-full bg-gray-200 rounded-full h-3 overflow-hidden"
                  role="progressbar"
                  aria-label="직무 정보 불러오는 중"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={progress}
                >
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
            </>
          )}
        </div>
      </div>
    </div>
  )
}
