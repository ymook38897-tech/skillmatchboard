import { Button } from '../components/common/Button'
import { TopBar } from '../components/common/TopBar'
import { QUESTIONS } from '../data/questions'
import {
  QuestionAnswer,
  QuestionId,
  QuestionOptionId,
  QuestionProcessingStatus,
  QuestionProcessingError,
} from '../types'

interface QuestionPageProps {
  currentQuestionIndex: number
  answers: QuestionAnswer[]
  onAnswerSelect: (questionId: QuestionId, optionId: QuestionOptionId) => void
  onUnknownToggle: (questionId: QuestionId) => void
  onNext: () => void
  onPrev: () => void
  onResultConfirm: () => void
  processingStatus?: QuestionProcessingStatus
  processingError?: QuestionProcessingError | null
  onRetryAnswer?: () => void
  onSelectAnswerAgain?: () => void
  onHelp?: () => void
}

export function QuestionPage({
  currentQuestionIndex,
  answers,
  onAnswerSelect,
  onUnknownToggle,
  onNext,
  onPrev,
  onResultConfirm,
  processingStatus = 'idle',
  processingError = null,
  onRetryAnswer,
  onSelectAnswerAgain,
  onHelp,
}: QuestionPageProps) {
  const question = QUESTIONS[currentQuestionIndex]
  const currentAnswer = answers.find((a) => a.questionId === question.id) || {
    questionId: question.id,
    selectedOptionIds: [],
    isUnknown: false,
  }

  const isLastQuestion = currentQuestionIndex === QUESTIONS.length - 1
  const isAnswered =
    currentAnswer.selectedOptionIds.length > 0 || currentAnswer.isUnknown
  const isLoading = processingStatus === 'submitting'
  const hasError = processingStatus === 'error'

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

          {/* Loading State */}
          {isLoading && (
            <div
              className="min-h-[28rem] flex flex-col items-center justify-center mb-10 animate-fade-in"
              role="status"
              aria-live="polite"
              aria-busy="true"
            >
              <div className="mb-8">
                <div className="flex justify-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full bg-primary-600 animate-pulse"
                    style={{ animationDelay: '0s' }}
                  ></div>
                  <div
                    className="w-4 h-4 rounded-full bg-primary-600 animate-pulse"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                  <div
                    className="w-4 h-4 rounded-full bg-primary-600 animate-pulse"
                    style={{ animationDelay: '0.4s' }}
                  ></div>
                </div>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                답변을 살펴보고 있어요
              </h2>
              <p className="text-2xl text-gray-700 mb-3">
                답변을 바탕으로 다음 질문을 준비하고 있습니다.
              </p>
              <p className="text-xl text-gray-600">잠시만 기다려주세요.</p>
              <p className="text-xl text-gray-500 mt-6">
                {currentQuestionIndex + 1} / {QUESTIONS.length} 질문 준비 중
              </p>
            </div>
          )}

          {/* Error State */}
          {hasError && processingError && (
            <div
              className="min-h-[28rem] flex flex-col items-center justify-center mb-10"
              role="alert"
            >
              <div className="text-center">
                <p className="text-6xl mb-6" aria-hidden="true">
                  ⚠️
                </p>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  다음 질문을 준비하지 못했어요
                </h2>
                <p className="text-2xl text-gray-700 mb-8">
                  {processingError.userMessage}
                </p>
                <p className="text-xl text-gray-600">
                  선택한 답변은 저장되어 있습니다.
                </p>
              </div>
            </div>
          )}

          {/* Answer Options */}
          {!isLoading && !hasError && (
            <>
              <div className="space-y-6 mb-10">
                {question.options.map((option) => {
                  const isSelected = currentAnswer.selectedOptionIds.includes(
                    option.id,
                  )
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
                      {isSelected && (
                        <span
                          aria-hidden="true"
                          className="text-4xl font-bold flex-shrink-0"
                        >
                          ✓
                        </span>
                      )}
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
            </>
          )}

        </div>

        {/* Bottom Navigation Area */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-3xl mx-auto flex gap-6">
            {/* Error State Buttons */}
            {hasError && (
              <>
                <Button
                  variant="outline"
                  size="2xl"
                  onClick={onSelectAnswerAgain || (() => {})}
                  disabled={!onSelectAnswerAgain}
                  className="flex-1"
                >
                  답변 다시 선택
                </Button>
                <Button
                  variant="primary"
                  size="2xl"
                  onClick={onRetryAnswer || (() => {})}
                  disabled={!onRetryAnswer}
                  className="flex-1"
                >
                  다시 시도
                </Button>
              </>
            )}

            {/* Normal State Buttons */}
            {!hasError && (
              <>
                <Button
                  variant="outline"
                  size="2xl"
                  onClick={onPrev}
                  disabled={isLoading}
                  className="flex-1"
                >
                  이전
                </Button>
                <Button
                  variant="primary"
                  size="2xl"
                  onClick={isLastQuestion ? onResultConfirm : onNext}
                  disabled={!isAnswered || isLoading}
                  className="flex-1"
                >
                  {isLastQuestion ? '결과 확인' : '다음'}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
