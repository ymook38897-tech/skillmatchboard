import { useEffect, useRef, useState } from 'react'
import { NavigationButtons } from '../components/common/NavigationButtons'
import { AgeGroup, Gender } from '../types'

const AGE_GROUPS: AgeGroup[] = ['10대', '20대', '30대', '40대', '50대', '60대 이상']
const GENDERS: Gender[] = ['남성', '여성', '선택하지 않음']

interface BasicInfoPageProps {
  selectedAgeGroup: AgeGroup | null
  selectedGender: Gender | null
  onAgeGroupChange: (age: AgeGroup) => void
  onGenderChange: (gender: Gender) => void
  onNext: () => void
  onPrev: () => void
}

export function BasicInfoPage({
  selectedAgeGroup,
  selectedGender,
  onAgeGroupChange,
  onGenderChange,
  onNext,
  onPrev,
}: BasicInfoPageProps) {
  const [scrollIndex, setScrollIndex] = useState(
    selectedAgeGroup ? AGE_GROUPS.indexOf(selectedAgeGroup) : 2
  )
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const wheelTimeoutRef = useRef<any>(null)

  const isNextDisabled = selectedAgeGroup === null

  // Scroll to center selected item
  useEffect(() => {
    if (scrollContainerRef.current) {
      const itemHeight = 80 + 16 // height + gap
      const containerHeight = scrollContainerRef.current.clientHeight
      const scrollTarget = itemHeight * scrollIndex - containerHeight / 2 + itemHeight / 2
      scrollContainerRef.current.scrollTop = scrollTarget
    }
  }, [scrollIndex])

  // Update selected age group when scroll changes
  useEffect(() => {
    onAgeGroupChange(AGE_GROUPS[scrollIndex])
  }, [scrollIndex, onAgeGroupChange])

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault()

    if (wheelTimeoutRef.current) {
      clearTimeout(wheelTimeoutRef.current)
    }

    const direction = e.deltaY > 0 ? 1 : -1
    setScrollIndex((prev) => {
      let newIndex = prev + direction
      if (newIndex < 0) newIndex = AGE_GROUPS.length - 1
      if (newIndex >= AGE_GROUPS.length) newIndex = 0
      return newIndex
    })

    wheelTimeoutRef.current = setTimeout(() => {
      // Allow next wheel event after delay
    }, 100)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault()
      setScrollIndex((prev) => (prev + 1) % AGE_GROUPS.length)
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault()
      setScrollIndex((prev) => (prev - 1 + AGE_GROUPS.length) % AGE_GROUPS.length)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col pb-32 px-4 sm:px-6 lg:px-8 pt-8">
      <div className="max-w-2xl mx-auto w-full flex-1">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
            기본정보 입력
          </h1>
          <p className="text-gray-600 text-lg">
            당신에 대해 알려주세요.
          </p>
        </div>

        {/* Age Group Selection */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            연령대를 선택해주세요
          </h2>
          <div
            ref={scrollContainerRef}
            onWheel={handleWheel}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            className="h-80 overflow-hidden flex flex-col items-center justify-center focus:outline-none"
          >
            <div className="flex flex-col items-center justify-center gap-4">
              {AGE_GROUPS.map((age, idx) => {
                const isSelected = idx === scrollIndex
                return (
                  <button
                    key={age}
                    onClick={() => setScrollIndex(idx)}
                    className={`transition-all duration-300 font-semibold text-center w-full sm:w-64 py-5 px-6 rounded-xl border-2 ${
                      isSelected
                        ? 'bg-primary-600 border-primary-600 text-white text-2xl scale-110'
                        : 'bg-white border-gray-200 text-gray-600 text-lg'
                    }`}
                  >
                    {age}
                  </button>
                )
              })}
            </div>
          </div>
          <p className="text-center text-gray-500 text-sm mt-4">
            마우스 휠, 화살표 키, 또는 탭을 눌러 선택할 수 있습니다
          </p>
        </div>

        {/* Gender Selection */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            성별을 선택해주세요 <span className="text-gray-400 text-base font-normal">(선택사항)</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {GENDERS.map((gender) => {
              const isSelected = selectedGender === gender
              return (
                <button
                  key={gender}
                  onClick={() => onGenderChange(gender)}
                  className={`transition-all duration-200 font-semibold py-6 px-4 rounded-xl border-2 flex items-center justify-center gap-3 ${
                    isSelected
                      ? 'bg-primary-50 border-primary-600 text-primary-600'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {isSelected && <span className="text-lg">✓</span>}
                  {gender}
                </button>
              )
            })}
          </div>
        </div>
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
