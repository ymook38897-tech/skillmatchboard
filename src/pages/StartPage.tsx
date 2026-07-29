import { Button } from '../components/common/Button'

interface StartPageProps {
  onStart: () => void
}

export function StartPage({ onStart }: StartPageProps) {
  return (
    <div className="relative isolate min-h-screen overflow-x-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-start sm:items-center justify-center px-4 py-6 sm:py-8">
      <div className="max-w-2xl w-full">
        {/* Decorative background elements */}
        <div aria-hidden="true" className="pointer-events-none absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 -translate-x-1/2"></div>
        <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 w-96 h-96 bg-accent-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10 text-center">
          {/* Logo */}
          <div className="mb-4 sm:mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-primary-600 to-accent-600">
              <span className="text-white text-xl sm:text-2xl font-bold">SM</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            Skill Match
            <span className="block gradient-text">Board</span>
          </h1>

          {/* Main message */}
          <p className="text-xl sm:text-3xl font-semibold text-gray-800 mb-6">
            막연했던 희망 직무를 구체적으로 찾아보세요.
          </p>

          {/* CTA Button */}
          <div className="relative z-20 mb-6">
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={onStart}
              className="relative z-20 min-h-14 w-full sm:w-auto sm:min-w-64 shadow-lg"
            >
              직무 찾기 시작
            </Button>
          </div>

          {/* Description */}
          <p className="text-base sm:text-xl text-gray-600 leading-relaxed">
            간단한 질문에 답하면 관심 분야와 업무 성향을 분석해
            <br />
            나에게 맞는 직무를 추천해드립니다.
          </p>

          {/* Info cards */}
          <div className="mt-8 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-white border border-gray-200">
              <div className="text-3xl mb-3">⏱️</div>
              <p className="text-sm text-gray-600">약 5분이 소요됩니다</p>
            </div>
            <div className="p-6 rounded-xl bg-white border border-gray-200">
              <div className="text-3xl mb-3">🎯</div>
              <p className="text-sm text-gray-600">3개의 맞춤형 직무를 추천받습니다</p>
            </div>
            <div className="p-6 rounded-xl bg-white border border-gray-200">
              <div className="text-3xl mb-3">🔒</div>
              <p className="text-sm text-gray-600">모든 정보는 안전하게 보호됩니다</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
