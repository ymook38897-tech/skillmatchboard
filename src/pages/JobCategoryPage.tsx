import { useState } from 'react'
import { NavigationButtons } from '../components/common/NavigationButtons'
import { Button } from '../components/common/Button'
import { JOB_CATEGORIES } from '../data/jobCategories'

interface JobCategoryPageProps {
  selectedJobCategory: string | null
  jobCategoryUnknown: boolean
  onJobCategoryChange: (category: string | null) => void
  onJobCategoryUnknown: (unknown: boolean) => void
  onNext: () => void
  onPrev: () => void
}

export function JobCategoryPage({
  selectedJobCategory,
  jobCategoryUnknown,
  onJobCategoryChange,
  onJobCategoryUnknown,
  onNext,
  onPrev,
}: JobCategoryPageProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 4

  const totalPages = Math.ceil(JOB_CATEGORIES.length / itemsPerPage)
  const startIdx = currentPage * itemsPerPage
  const endIdx = startIdx + itemsPerPage
  const displayedCategories = JOB_CATEGORIES.slice(startIdx, endIdx)

  const isNextDisabled = selectedJobCategory === null && !jobCategoryUnknown

  const handleCategoryClick = (id: string) => {
    if (jobCategoryUnknown) return
    if (selectedJobCategory === id) {
      onJobCategoryChange(null)
    } else {
      onJobCategoryChange(id)
    }
  }

  const handleUnknownClick = () => {
    if (jobCategoryUnknown) {
      onJobCategoryUnknown(false)
    } else {
      onJobCategoryChange(null)
      onJobCategoryUnknown(true)
    }
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages)
  }

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col pb-32 px-4 sm:px-6 lg:px-8 pt-8">
      <div className="max-w-3xl mx-auto w-full flex-1">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
            희망 직종 선택
          </h1>
          <p className="text-gray-600 text-lg">
            관심 있는 직종 분야를 선택해주세요.
          </p>
        </div>

        {/* Job Categories Grid */}
        <div className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {displayedCategories.map((category) => {
              const isSelected = selectedJobCategory === category.id
              const isDisabled = jobCategoryUnknown
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  disabled={isDisabled}
                  className={`transition-all duration-200 p-6 rounded-xl border-2 font-semibold text-lg flex items-center justify-between ${
                    isSelected
                      ? 'bg-primary-50 border-primary-600 text-primary-600'
                      : isDisabled
                        ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                        : 'bg-white border-gray-300 text-gray-900 hover:border-gray-400'
                  }`}
                >
                  <span>{category.name}</span>
                  {isSelected && <span className="text-xl">✓</span>}
                </button>
              )
            })}
          </div>
        </div>

        {/* Category Navigation */}
        <div className="flex gap-3 mb-8 justify-center">
          <Button
            variant="outline"
            onClick={handlePrevPage}
            className="px-4 py-2 text-sm"
          >
            이전 분야
          </Button>
          <span className="px-4 py-2 text-gray-600 font-medium">
            {currentPage + 1} / {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={handleNextPage}
            className="px-4 py-2 text-sm"
          >
            다른 분야 보기
          </Button>
        </div>

        {/* Unknown Button */}
        <div className="mb-8">
          <Button
            variant={jobCategoryUnknown ? 'primary' : 'secondary'}
            size="lg"
            onClick={handleUnknownClick}
            className="w-full"
          >
            {jobCategoryUnknown && '✓ '}아직 희망 직종을 잘 모르겠어요
          </Button>
        </div>

        {/* Helper Text */}
        <p className="text-center text-gray-500 text-sm">
          {jobCategoryUnknown
            ? '잘 모르겠어요를 선택하면 질문 답변을 기준으로 추천받습니다.'
            : '직종을 다시 누르면 선택이 해제됩니다.'}
        </p>
      </div>

      {/* Navigation Buttons */}
      <NavigationButtons
        onPrev={onPrev}
        onNext={onNext}
        nextDisabled={isNextDisabled}
        prevLabel="이전"
        nextLabel="다음"
      />
    </div>
  )
}
