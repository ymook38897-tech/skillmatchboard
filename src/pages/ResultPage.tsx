import { useState } from 'react'
import { Button } from '../components/common/Button'
import { Modal } from '../components/common/Modal'
import { Result } from '../types'

interface ResultPageProps {
  results: Result[]
  onReset: () => void
}

export function ResultPage({ results, onReset }: ResultPageProps) {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const selectedJob = results.find((r) => r.id === selectedJobId)

  const handleCardClick = (jobId: string) => {
    setSelectedJobId(jobId)
  }

  const handleCloseModal = () => {
    setSelectedJobId(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            당신에게 맞는 직무입니다!
          </h1>
          <p className="text-3xl text-gray-700 font-semibold">
            추천 직업을 누르면 정보를 볼 수 있습니다
          </p>
        </div>

        {/* Results Cards */}
        <div className="space-y-6 mb-16">
          {results.map((result, index) => {
            const rankColor =
              index === 0
                ? 'from-yellow-400 to-yellow-600'
                : index === 1
                  ? 'from-gray-300 to-gray-500'
                  : 'from-orange-300 to-orange-600'

            return (
              <button
                key={result.id}
                onClick={() => handleCardClick(result.id)}
                className="w-full rounded-lg overflow-hidden border-3 border-gray-300 bg-white shadow-md hover:shadow-lg transition-all duration-200 text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-600 focus-visible:ring-offset-2 min-h-[9.375rem]"
              >
                <div className="p-8 flex flex-col sm:flex-row gap-8 items-start h-full">
                  {/* Rank Badge */}
                  <div
                    className={`w-20 h-20 rounded-full bg-gradient-to-br ${rankColor} flex-shrink-0 flex items-center justify-center text-white font-bold text-4xl`}
                  >
                    {index + 1}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    {/* Job Title */}
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
                      {result.jobTitle}
                    </h2>
                    <p className="text-2xl text-gray-600 mb-6">
                      {result.description}
                    </p>

                    {/* Compatibility */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex-1 max-w-xs bg-gray-300 rounded-full h-4">
                        <div
                          className="bg-gradient-to-r from-primary-600 to-accent-600 h-4 rounded-full"
                          style={{ width: `${result.compatibility}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-3xl text-gray-900 w-20 text-right">
                        {result.compatibility}%
                      </span>
                    </div>

                    {/* Action Text */}
                    <div className="text-2xl font-bold text-primary-600">
                      눌러서 직업 정보 보기 →
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Reset Button */}
        <div className="mt-16">
          <Button
            variant="primary"
            size="2xl"
            onClick={onReset}
            className="w-full text-3xl"
          >
            처음부터 다시 하기
          </Button>
        </div>
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <Modal
          isOpen={!!selectedJob}
          onClose={handleCloseModal}
          title={selectedJob.jobTitle}
          closeButtonLabel="닫기"
        >
          <div className="space-y-12">
            {/* What does this job do? */}
            <div>
              <h3 className="text-4xl sm:text-5xl font-semibold text-gray-900 mb-8">
                이 직업은 어떤 일을 하나요?
              </h3>
              <p className="text-3xl text-gray-700 leading-relaxed mb-8">
                {selectedJob.description}
              </p>
              {selectedJob.mainDuties.slice(0, 3).length > 0 && (
                <div className="space-y-4">
                  {selectedJob.mainDuties.slice(0, 3).map((duty, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <span className="text-accent-600 font-bold text-3xl flex-shrink-0">
                        •
                      </span>
                      <span className="text-3xl text-gray-700">{duty}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Why this job? */}
            <div>
              <h3 className="text-4xl sm:text-5xl font-semibold text-gray-900 mb-8">
                왜 이 직업을 추천했나요?
              </h3>
              <p className="text-3xl text-gray-700 leading-relaxed">
                {selectedJob.reason}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
