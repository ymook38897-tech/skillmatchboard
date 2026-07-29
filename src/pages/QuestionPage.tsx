import { Button } from '../components/common/Button'
import { TopBar } from '../components/common/TopBar'
import { QUESTIONS } from '../data/questions'
import { QuestionAnswer } from '../types'

interface QuestionPageProps {
  currentQuestionIndex: number
  answers: QuestionAnswer[]
  onAnswerSelect: (questionId: number, optionId: string) => void
  onUnknownToggle: (questionId: number) => void
  onNext: () => void
  onPrev: () => void
  onLoadingStart: () => void
  onHelp?: () => void
}

export function QuestionPage({
  currentQuestionIndex,
  answers,
  onAnswerSelect,
  onUnknownToggle,
  onNext,
  onPrev,
  onLoadingStart,
  onHelp,
}: QuestionPageProps) {
  const question = QUESTIONS[currentQuestionIndex]
  const currentAnswer = answers.find((a) => a.questionId === question.id) || {
    questionId: question.id,
    selectedOptionId: null,
    isUnknown: false,
  }

  const isLastQuestion = currentQuestionIndex === QUESTIONS.length - 1
  const isAnswered = currentAnswer.selectedOptionId !== null || currentAnswer.isUnknown

  const handleNext = () => {
    if (isLastQuestion) {
      onLoadingStart()
      onNext()
    } else {
      onNext()
    }
  }

  return (
    <>
      <TopBar onHelp={onHelp} />
      <div className="min-h-screen bg-white flex flex-col pb-40 px-4 sm:px-6 lg:px-8 pt-32">
        <div className="max-w-3xl mx-auto w-full flex-1">
          {/* Progress Bar */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                질문 {currentQuestionIndex + 1} / {QUESTIONS.length}
              </h2>
              <span className="text-2xl font-bold text-gray-800">
                {Math.round(((currentQuestionIndex + 1) / QUESTIONS.length) * 100)}%
              </span>
            </div>
            <div
              className="w-full bg-gray-300 rounded-full h-4"
              role="progressbar"
              aria-valuenow={Math.round(((currentQuestionIndex + 1) / QUESTIONS.length) * 100)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`진행 상황: ${currentQuestionIndex + 1}/${QUESTIONS.length}`}
            >
              <div
                className="bg-gradient-to-r from-primary-600 to-accent-600 h-4 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentQuestionIndex + 1) / QUESTIONS.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Question Title */}
          <div className="mb-12">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight">
              {question.question}
            </h1>
          </div>

          {/* Answer Options */}
          <div className="space-y-6 mb-10">
            {question.options.map((option) => {
              const isSelected = currentAnswer.selectedOptionId === option.id
              const isDisabled = currentAnswer.isUnknown
              return (
                <button
                  key={option.id}
                  onClick={() => onAnswerSelect(question.id, option.id)}
                  disabled={isDisabled}
                  aria-pressed={isSelected}
                  className={`w-full transition-all duration-200 py-6 px-6 rounded-lg border-4 text-left font-bold text-3xl min-h-28 flex items-center justify-between focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-600 focus-visible:ring-offset-2 ${
                    isSelected
                      ? 'bg-primary-50 border-primary-600 text-primary-700 shadow-lg'
                      : isDisabled
                        ? 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-white border-gray-300 text-gray-800 hover:border-primary-300'
                  }`}
                >
                  <span>{option.text}</span>
                  {isSelected && <span aria-hidden="true" className="text-4xl font-bold flex-shrink-0">✓</span>}
                </button>
              )
            })}
          </div>

          {/* Unknown Button */}
          <div>
            <Button
              variant={currentAnswer.isUnknown ? 'primary' : 'secondary'}
              size="3xl"
              onClick={() => onUnknownToggle(question.id)}
              className="w-full text-3xl"
            >
              {currentAnswer.isUnknown && '✓ '}잘 모르겠어요
            </Button>
          </div>
        </div>

        {/* Bottom Navigation Area */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-3xl mx-auto flex gap-6">
            <Button
              variant="outline"
              size="2xl"
              onClick={onPrev}
              className="flex-1"
            >
              이전
            </Button>
            <Button
              variant="primary"
              size="2xl"
              onClick={handleNext}
              disabled={!isAnswered}
              className="flex-1"
            >
              {isLastQuestion ? '결과 확인' : '다음'}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
