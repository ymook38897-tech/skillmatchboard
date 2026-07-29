import { useEffect, useRef } from 'react'
import { Button } from '../components/common/Button'
import { AgeGroup, Gender } from '../types'

const AGE_GROUPS: AgeGroup[] = ['10대', '20대', '30대', '40대', '50대', '60대 이상']
const GENDERS: Gender[] = ['남성', '여성']

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
  const navigationPendingRef = useRef(false)
  const navigationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current)
      }
    }
  }, [])

  const scheduleNextIfComplete = (
    ageGroup: AgeGroup | null,
    gender: Gender | null,
  ) => {
    if (!ageGroup || !gender || navigationPendingRef.current) {
      return
    }

    navigationPendingRef.current = true
    navigationTimeoutRef.current = setTimeout(onNext, 120)
  }

  const handleAgeGroupSelect = (ageGroup: AgeGroup) => {
    if (navigationPendingRef.current) return
    onAgeGroupChange(ageGroup)
    scheduleNextIfComplete(ageGroup, selectedGender)
  }

  const handleGenderSelect = (gender: Gender) => {
    if (navigationPendingRef.current) return
    onGenderChange(gender)
    scheduleNextIfComplete(selectedAgeGroup, gender)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col pb-24 px-4 sm:px-6 lg:px-8 pt-8">
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
        <div className="mb-10">
          <h2 id="age-group-label" className="text-xl font-semibold text-gray-900 mb-6">
            연령대를 선택해주세요
          </h2>
          <div
            role="group"
            aria-labelledby="age-group-label"
            className="max-h-80 max-w-sm mx-auto overflow-y-auto overscroll-contain touch-pan-y rounded-xl border border-gray-200 bg-gray-50 p-3 sm:p-4"
          >
            <div className="w-full flex flex-col gap-3">
              {AGE_GROUPS.map((age) => {
                const isSelected = selectedAgeGroup === age
                return (
                  <button
                    type="button"
                    key={age}
                    onClick={() => handleAgeGroupSelect(age)}
                    aria-pressed={isSelected}
                    className={`min-h-16 w-full transition-colors duration-200 font-semibold text-center py-4 px-6 rounded-xl border-2 flex items-center justify-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 ${
                      isSelected
                        ? 'bg-primary-50 border-primary-600 text-primary-700 shadow-sm'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-primary-300'
                    }`}
                  >
                    {isSelected && <span aria-hidden="true" className="text-lg">✓</span>}
                    <span>{age}</span>
                  </button>
                )
              })}
            </div>
          </div>
          <p className="text-center text-gray-500 text-sm mt-4">
            목록을 스크롤한 뒤 원하는 연령대 버튼을 직접 선택해주세요
          </p>
        </div>

        {/* Gender Selection */}
        <div>
          <h2 id="gender-label" className="text-xl font-semibold text-gray-900 mb-6">
            성별을 선택해주세요
          </h2>
          <div role="group" aria-labelledby="gender-label" className="grid grid-cols-2 gap-4">
            {GENDERS.map((gender) => {
              const isSelected = selectedGender === gender
              return (
                <button
                  type="button"
                  key={gender}
                  onClick={() => handleGenderSelect(gender)}
                  aria-pressed={isSelected}
                  className={`min-h-16 transition-colors duration-200 font-semibold py-4 px-4 rounded-xl border-2 flex items-center justify-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 ${
                    isSelected
                      ? 'bg-primary-50 border-primary-600 text-primary-700 shadow-sm'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-primary-300'
                  }`}
                >
                  {isSelected && <span aria-hidden="true" className="text-lg">✓</span>}
                  {gender}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Previous Button */}
      <div className="fixed z-30 bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto flex justify-center">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onPrev}
            className="w-full sm:w-48"
          >
            이전
          </Button>
        </div>
      </div>
    </div>
  )
}
