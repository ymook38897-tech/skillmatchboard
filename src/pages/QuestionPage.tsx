import { useState } from 'react'
import { NavigationButtons } from '../components/common/NavigationButtons'
import { Button } from '../components/common/Button'
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
}

export function QuestionPage({
  currentQuestionIndex,
  answers,
  onAnswerSelect,
  onUnknownToggle,
  onNext,
  onPrev,
  onLoadingStart,
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
    <div className="min-h-screen bg-white flex flex-col pb-32 px-4 sm:px-6 lg:px-8 pt-8">
      <div className="max-w-3xl mx-auto w-full flex-1">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-gray-700 font-semibold">
              질문 {currentQuestionIndex + 1} / {QUESTIONS.length}
            </h2>
            <span className="text-gray-500 text-sm">
              {Math.round(((currentQuestionIndex + 1) / QUESTIONS.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary-600 to-accent-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentQuestionIndex + 1) / QUESTIONS.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Question Title */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            {question.question}
          </h1>
        </div>

        {/* Answer Options */}
        <div className="space-y-3 mb-8">
          {question.options.map((option) => {
            const isSelected = currentAnswer.selectedOptionId === option.id
            const isDisabled = currentAnswer.isUnknown
            return (
              <button
                key={option.id}
                onClick={() => onAnswerSelect(question.id, option.id)}
                disabled={isDisabled}
                className={`w-full transition-all duration-200 p-5 rounded-xl border-2 text-left font-semibold flex items-center justify-between ${
                  isSelected
                    ? 'bg-primary-50 border-primary-600 text-primary-600'
                    : isDisabled
                      ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                      : 'bg-white border-gray-300 text-gray-900 hover:border-gray-400'
                }`}
              >
                <span>{option.text}</span>
                {isSelected && <span className="text-xl">✓</span>}
              </button>
            )
          })}
        </div>

        {/* Unknown Button */}
        <div>
          <Button
            variant={currentAnswer.isUnknown ? 'primary' : 'secondary'}
            size="lg"
            onClick={() => onUnknownToggle(question.id)}
            className="w-full"
          >
            {currentAnswer.isUnknown && '✓ '}잘 모르겠어요
          </Button>
        </div>
      </div>

      {/* Navigation Buttons */}
      <NavigationButtons
        onPrev={onPrev}
        onNext={handleNext}
        nextDisabled={!isAnswered}
        prevLabel={currentQuestionIndex === 0 ? '이전 페이지' : '이전 질문'}
        nextLabel={isLastQuestion ? '결과 확인' : '다음 질문'}
      />
    </div>
  )
}
