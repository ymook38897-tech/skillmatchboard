import { Button } from '../components/common/Button'

interface StartPageProps {
  onStart: () => void
}

export function StartPage({ onStart }: StartPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 -translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10 text-center">
          {/* Logo */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 mb-4">
              <span className="text-white text-2xl font-bold">SM</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Skill Match
            <span className="block gradient-text">Board</span>
          </h1>

          {/* Main message */}
          <p className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6">
            막연했던 희망 직무를 구체적으로 찾아보세요.
          </p>

          {/* Description */}
          <p className="text-lg sm:text-xl text-gray-600 mb-12 leading-relaxed">
            간단한 질문에 답하면 관심 분야와 업무 성향을 분석해
            <br />
            나에게 맞는 직무를 추천해드립니다.
          </p>

          {/* CTA Button */}
          <Button
            variant="primary"
            size="lg"
            onClick={onStart}
            className="w-full sm:w-auto"
          >
            직무 찾기 시작
          </Button>

          {/* Info cards */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
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
