import { Button } from '../components/common/Button'
import { TopBar } from '../components/common/TopBar'
import { JOB_CATEGORIES } from '../data/jobCategories'

interface JobCategoryPageProps {
  selectedJobCategories: string[]
  jobCategoryUnknown: boolean
  onJobCategoryToggle: (category: string) => void
  onJobCategoryUnknown: (unknown: boolean) => void
  onNext: () => void
  onPrev: () => void
  currentPage: number
  onPageChange: (page: number) => void
  onHelp?: () => void
}

export function JobCategoryPage({
  selectedJobCategories,
  jobCategoryUnknown,
  onJobCategoryToggle,
  onJobCategoryUnknown,
  onNext,
  onPrev,
  currentPage,
  onPageChange,
  onHelp,
}: JobCategoryPageProps) {
  const itemsPerPage = 4

  const totalPages = Math.ceil(JOB_CATEGORIES.length / itemsPerPage)
  const startIdx = currentPage * itemsPerPage
  const endIdx = startIdx + itemsPerPage
  const displayedCategories = JOB_CATEGORIES.slice(startIdx, endIdx)

  const isNextDisabled = selectedJobCategories.length === 0 && !jobCategoryUnknown
  const isSelectionLimitReached = selectedJobCategories.length >= 3
  const isFirstPage = currentPage === 0
  const isLastPage = currentPage === totalPages - 1

  const handleCategoryClick = (id: string) => {
    if (jobCategoryUnknown) return
    onJobCategoryToggle(id)
  }

  const handleUnknownClick = () => {
    onJobCategoryUnknown(!jobCategoryUnknown)
  }

  const handleNextPage = () => {
    if (!isLastPage) {
      onPageChange(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (!isFirstPage) {
      onPageChange(currentPage - 1)
    }
  }

  return (
    <>
      <TopBar onHelp={onHelp} />
      <div className="min-h-screen bg-white flex flex-col pb-40 px-4 sm:px-6 lg:px-8 pt-32">
        {/* Header Area - Fixed at top */}
        <div className="max-w-3xl mx-auto w-full mb-6">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-3">
            희망 직종 선택
          </h1>
          <p className="text-3xl text-gray-700 font-medium">
            희망 직종을 최대 3개까지 선택해주세요
          </p>
        </div>

        {/* Central Content Group - Centered vertically */}
        <div className="flex-1 flex flex-col justify-center max-w-3xl mx-auto w-full">
          {/* Current Selection Display */}
          <div className="text-center bg-primary-50 rounded-lg py-4 px-6 mb-6" aria-live="polite">
            <p className="text-3xl font-bold text-primary-700">
              현재 선택 <span className="text-4xl">{selectedJobCategories.length}</span> / 3개
            </p>
            {isSelectionLimitReached && !jobCategoryUnknown && (
              <p className="mt-3 text-2xl font-semibold text-primary-600" role="status">
                3개를 모두 선택했습니다
              </p>
            )}
          </div>

          {/* Job Categories Grid Area - Fixed Height (2 columns x 2 rows) */}
          {/* Calculation: button height (132px) × 2 rows + gap (24px) × 1 = 288px */}
          <div className="h-72 mb-6 overflow-hidden">
            <div className="grid grid-cols-2 gap-6 h-full">
              {Array.from({ length: 4 }).map((_, idx) => {
                const category = displayedCategories[idx]
                if (!category) {
                  return (
                    <div
                      key={`empty-${idx}`}
                      className="invisible"
                      aria-hidden="true"
                    />
                  )
                }

                const isSelected = selectedJobCategories.includes(category.id)
                const isDisabled = jobCategoryUnknown
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    disabled={isDisabled}
                    aria-pressed={isSelected}
                    className={`transition-all duration-200 py-6 px-6 rounded-lg border-4 font-bold text-3xl min-h-[8.25rem] flex items-center justify-between focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-600 focus-visible:ring-offset-2 ${
                      isSelected
                        ? 'bg-primary-50 border-primary-600 text-primary-700 shadow-lg'
                        : isDisabled
                          ? 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-white border-gray-300 text-gray-800 hover:border-primary-300'
                    }`}
                  >
                    <span className="text-left">{category.name}</span>
                    {isSelected && <span aria-hidden="true" className="text-4xl font-bold flex-shrink-0">✓</span>}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Category Navigation Area - Fixed Height */}
          <div className="h-32 mb-6 flex items-center justify-center">
            <div className="flex gap-6 justify-center items-center flex-wrap w-full">
              <Button
                variant="outline"
                size="2xl"
                onClick={handlePrevPage}
                disabled={isFirstPage}
                className="text-2xl"
              >
                이전 분야
              </Button>
              <span className="text-3xl font-bold text-gray-800 px-8 py-4 min-w-fit bg-gray-50 rounded-lg">
                {currentPage + 1} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="2xl"
                onClick={handleNextPage}
                disabled={isLastPage}
                className="text-2xl"
              >
                다른 분야 보기
              </Button>
            </div>
          </div>

          {/* Unknown Button Area - Fixed Height */}
          <div className="h-32 mb-8 flex items-center">
            <Button
              variant={jobCategoryUnknown ? 'primary' : 'secondary'}
              size="3xl"
              onClick={handleUnknownClick}
              className="w-full text-3xl"
            >
              {jobCategoryUnknown && '✓ '}아직 희망 직종을 잘 모르겠어요
            </Button>
          </div>

          {/* Flex Spacer - Fills remaining vertical space */}
          <div className="flex-1"></div>
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
              onClick={onNext}
              disabled={isNextDisabled}
              className="flex-1"
            >
              다음
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
