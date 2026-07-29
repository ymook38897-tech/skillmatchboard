import { useEffect, useRef } from 'react'
import { Button } from '../components/common/Button'
import { TopBar } from '../components/common/TopBar'
import { AgeGroup, Gender } from '../types'

const AGE_GROUPS: AgeGroup[] = ['10~20대', '30~40대', '50~60대', '70대 이상']
const GENDERS: Gender[] = ['남성', '여성']

interface BasicInfoPageProps {
  selectedAgeGroup: AgeGroup | null
  selectedGender: Gender | null
  onAgeGroupChange: (age: AgeGroup) => void
  onGenderChange: (gender: Gender) => void
  onNext: () => void
  onPrev: () => void
  onHelp?: () => void
}

export function BasicInfoPage({
  selectedAgeGroup,
  selectedGender,
  onAgeGroupChange,
  onGenderChange,
  onNext,
  onPrev,
  onHelp,
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
    <>
      <TopBar onHelp={onHelp} />
      <div className="min-h-screen bg-white flex flex-col pb-40 px-4 sm:px-6 lg:px-8 pt-32">
        <div className="max-w-3xl mx-auto w-full flex-1">
          {/* Header */}
          <div className="mb-16">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-4">
              기본정보 입력
            </h1>
            <p className="text-3xl text-gray-700 font-medium">
              당신에 대해 알려주세요.
            </p>
          </div>

          {/* Age Group Selection */}
          <div className="mb-12">
            <h2 id="age-group-label" className="text-4xl font-semibold text-gray-900 mb-8">
              연령대를 선택해주세요
            </h2>
            <div
              role="group"
              aria-labelledby="age-group-label"
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {AGE_GROUPS.map((age) => {
                const isSelected = selectedAgeGroup === age
                return (
                  <button
                    type="button"
                    key={age}
                    onClick={() => handleAgeGroupSelect(age)}
                    aria-pressed={isSelected}
                    className={`min-h-[7.75rem] w-full transition-all duration-200 font-bold text-3xl py-6 px-6 rounded-xl border-4 flex items-center justify-center gap-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-600 focus-visible:ring-offset-2 ${
                      isSelected
                        ? 'bg-primary-50 border-primary-600 text-primary-700 shadow-lg'
                        : 'bg-white border-gray-300 text-gray-800 hover:border-primary-300'
                    }`}
                  >
                    {isSelected && <span aria-hidden="true" className="text-4xl font-bold">✓</span>}
                    <span>{age}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Gender Selection */}
          <div>
            <h2 id="gender-label" className="text-4xl font-semibold text-gray-900 mb-8">
              성별을 선택해주세요
            </h2>
            <div role="group" aria-labelledby="gender-label" className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {GENDERS.map((gender) => {
                const isSelected = selectedGender === gender
                return (
                  <button
                    type="button"
                    key={gender}
                    onClick={() => handleGenderSelect(gender)}
                    aria-pressed={isSelected}
                    className={`min-h-[7.75rem] transition-all duration-200 font-bold text-3xl py-6 px-6 rounded-xl border-4 flex items-center justify-center gap-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-600 focus-visible:ring-offset-2 ${
                      isSelected
                        ? 'bg-primary-50 border-primary-600 text-primary-700 shadow-lg'
                        : 'bg-white border-gray-300 text-gray-800 hover:border-primary-300'
                    }`}
                  >
                    {isSelected && <span aria-hidden="true" className="text-4xl font-bold">✓</span>}
                    <span>{gender}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Navigation Area */}
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
