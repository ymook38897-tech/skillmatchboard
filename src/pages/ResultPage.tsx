import { useState } from 'react'
import { Button } from '../components/common/Button'
import { Result } from '../types'

interface ResultPageProps {
  results: Result[]
  onReset: () => void
}

export function ResultPage({ results, onReset }: ResultPageProps) {
  const [expandedId, setExpandedId] = useState<string | null>(results[0]?.id)

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            당신에게 맞는 직무입니다!
          </h1>
          <p className="text-xl text-gray-600">
            질문 답변을 바탕으로 분석한 3가지 추천 직무입니다
          </p>
        </div>

        {/* Results Cards */}
        <div className="space-y-4 mb-12">
          {results.map((result, index) => {
            const isExpanded = expandedId === result.id
            const rankColor =
              index === 0
                ? 'from-yellow-400 to-yellow-600'
                : index === 1
                  ? 'from-gray-300 to-gray-500'
                  : 'from-orange-300 to-orange-600'

            return (
              <div
                key={result.id}
                className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-200"
              >
                {/* Card Header - Always visible */}
                <button
                  onClick={() => toggleExpand(result.id)}
                  aria-expanded={isExpanded}
                  className="w-full text-left p-6 flex items-start justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      {/* Rank Badge */}
                      <div
                        className={`w-12 h-12 rounded-full bg-gradient-to-br ${rankColor} flex items-center justify-center text-white font-bold text-lg`}
                      >
                        {index + 1}
                      </div>

                      {/* Job Title */}
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {result.jobTitle}
                        </h2>
                        <p className="text-gray-600 mt-1">
                          {result.description}
                        </p>
                      </div>
                    </div>

                    {/* Compatibility */}
                    <div className="mt-3 ml-16">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                          <div
                            className="bg-gradient-to-r from-primary-600 to-accent-600 h-2 rounded-full"
                            style={{ width: `${result.compatibility}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold text-gray-900 w-12 text-right">
                          {result.compatibility}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expand Icon */}
                  <div className="ml-4 mt-2">
                    <span
                      className={`inline-block transition-transform duration-300 text-2xl ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    >
                      ▼
                    </span>
                  </div>
                </button>

                {/* Expandable Content */}
                {isExpanded && (
                  <div className="border-t border-gray-200 px-6 py-6 bg-gray-50 space-y-6">
                    {/* Reason */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        추천 이유
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {result.reason}
                      </p>
                    </div>

                    {/* Connected Answers */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">
                        당신의 답변과의 연결
                      </h3>
                      <div className="space-y-2">
                        {result.connectedAnswers.map((answer, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-3 text-gray-700"
                          >
                            <span className="text-primary-600 font-semibold mt-1">
                              •
                            </span>
                            <span>{answer}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Main Duties */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">
                        주요 업무
                      </h3>
                      <div className="space-y-2">
                        {result.mainDuties.map((duty, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-3 text-gray-700"
                          >
                            <span className="text-accent-600 font-semibold mt-1">
                              •
                            </span>
                            <span>{duty}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Required Skills */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">
                        필요한 역량
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {result.requiredSkills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="inline-block px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
                          >
                            #{skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Reset Button */}
        <div className="text-center">
          <Button
            variant="primary"
            size="lg"
            onClick={onReset}
            className="w-full sm:w-auto"
          >
            처음부터 다시 하기
          </Button>
        </div>
      </div>
    </div>
  )
}
