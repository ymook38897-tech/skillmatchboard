import { useState } from 'react'
import beautyIcon from '../assets/icons/certifications/beauty.svg'
import careIcon from '../assets/icons/certifications/care.svg'
import cookingIcon from '../assets/icons/certifications/cooking.svg'
import drivingIcon from '../assets/icons/certifications/driving.svg'
import noneIcon from '../assets/icons/certifications/none.svg'
import officeIcon from '../assets/icons/certifications/office.svg'
import otherIcon from '../assets/icons/certifications/other.svg'
import safetyIcon from '../assets/icons/certifications/safety.svg'
import technicalIcon from '../assets/icons/certifications/technical.svg'
import previousStepIcon from '../assets/icons/barriers/previous-step-up.svg'
import headsetConsultationIcon from '../assets/icons/headset-consultation.svg'
import { Button } from '../components/common/Button'
import { CertificationDetailSheet } from '../components/profile/CertificationDetailSheet'
import {
  CERTIFICATION_CATEGORIES,
  type CertificationCategoryId,
} from '../data/profileOptions'

interface CertificationSelectionPageProps {
  selectedIds: string[]
  noneSelected: boolean
  otherValue: string
  selectionLimit: number
  onApplyCategory: (
    categoryId: CertificationCategoryId,
    certificationIds: string[],
  ) => void
  onNone: () => void
  onPrev: () => void
  onNext: () => void
  onHelp: () => void
}

const CATEGORY_ICONS: Record<CertificationCategoryId, string> = {
  'driving-transport': drivingIcon,
  'cooking-food': cookingIcon,
  'facility-safety': safetyIcon,
  'office-accounting': officeIcon,
  'care-welfare': careIcon,
  'technical-skills': technicalIcon,
  'beauty-service': beautyIcon,
  other: otherIcon,
}

export function CertificationSelectionPage({
  selectedIds,
  noneSelected,
  otherValue,
  selectionLimit,
  onApplyCategory,
  onNone,
  onPrev,
  onNext,
  onHelp,
}: CertificationSelectionPageProps) {
  const [activeCategoryId, setActiveCategoryId] =
    useState<CertificationCategoryId | null>(null)
  const [draftSelectedValue, setDraftSelectedValue] = useState<string | null>(
    null,
  )

  const activeCategory = CERTIFICATION_CATEGORIES.find(
    (category) => category.id === activeCategoryId,
  )

  const openCategorySheet = (categoryId: CertificationCategoryId) => {
    const category = CERTIFICATION_CATEGORIES.find(
      (candidate) => candidate.id === categoryId,
    )
    const selectedValue =
      category?.options.find((option) => selectedIds.includes(option.id))?.id ??
      null

    setDraftSelectedValue(selectedValue)
    setActiveCategoryId(categoryId)
  }

  const closeCategorySheet = () => {
    setActiveCategoryId(null)
    setDraftSelectedValue(null)
  }

  const applyCategorySelection = () => {
    if (!activeCategory) return
    onApplyCategory(
      activeCategory.id,
      draftSelectedValue ? [draftSelectedValue] : [],
    )
    closeCategorySheet()
  }

  const activeOptionIds = new Set<string>(
    activeCategory?.options.map((option) => option.id) ?? [],
  )
  const outsideSelectionCount =
    selectedIds.filter((id) => !activeOptionIds.has(id)).length +
    (otherValue.trim() ? 1 : 0)

  return (
    <div className="v6-entry-page relative min-h-[100svh] overflow-x-hidden rounded-[clamp(20px,4vw,32px)] bg-[#FAF8F2] text-[#0D0C0C]">
      <button
        type="button"
        onClick={onPrev}
        aria-label="이전 단계 · 어려운 일 선택"
        className="group absolute left-1/2 top-[clamp(96px,15.5vw,124px)] z-20 h-[clamp(154px,21.25vw,170px)] w-[min(608px,calc(100vw-48px))] -translate-x-1/2 border-0 p-0 focus-visible:outline-none"
      >
        <span className="absolute inset-x-0 top-0 flex h-[clamp(72px,11vw,88px)] items-center justify-center rounded-[clamp(18px,3vw,24px)] border-[1.5px] border-primary-600 bg-white text-[clamp(24px,5vw,40px)] font-bold leading-none text-primary-600 shadow-[0_4px_12px_rgba(13,12,12,0.05)] backdrop-blur-[8px] group-focus-visible:ring-4 group-focus-visible:ring-primary-600 group-focus-visible:ring-offset-4 group-focus-visible:ring-offset-[#FAF8F2]">
          이전 단계&nbsp; · &nbsp;어려운 일 선택
        </span>
        <span className="absolute left-1/2 top-[clamp(104px,14.25vw,114px)] flex h-[clamp(48px,7vw,56px)] w-[clamp(80px,12vw,96px)] -translate-x-1/2 items-center justify-center rounded-[clamp(16px,2.5vw,20px)] border-[1.5px] border-primary-600 bg-white shadow-[0_4px_12px_rgba(13,12,12,0.07)]">
          <img
            src={previousStepIcon}
            alt=""
            aria-hidden="true"
            className="h-[clamp(36px,5.5vw,44px)] w-[clamp(36px,5.5vw,44px)]"
          />
        </span>
      </button>

      <header className="fixed inset-x-0 top-0 z-40 h-[clamp(112px,18.5vw,148px)] rounded-t-[clamp(20px,4vw,32px)] rounded-b-[clamp(20px,3.5vw,28px)] border border-[rgba(82,120,111,0.16)] bg-[rgba(250,248,242,0.78)] shadow-[0_6px_18px_rgba(13,12,12,0.08)] backdrop-blur-[12px]">
        <button
          type="button"
          onClick={onHelp}
          className="absolute right-[clamp(15px,5.875vw,47px)] top-[clamp(15px,2.875vw,23px)] h-[clamp(80px,12.5vw,100px)] w-[min(270px,calc(100vw-32px))] rounded-[clamp(18px,3vw,24px)] border-[1.5px] border-[rgba(82,120,111,0.92)] bg-[rgba(255,255,255,0.82)] text-primary-600 shadow-[0_4px_12px_rgba(13,12,12,0.08)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-600 focus-visible:ring-offset-4 focus-visible:ring-offset-[#FAF8F2]"
        >
          <img
            src={headsetConsultationIcon}
            alt=""
            aria-hidden="true"
            className="absolute left-[clamp(18px,3vw,24px)] top-[clamp(16px,2.75vw,22px)] h-[clamp(48px,7.5vw,60px)] w-[clamp(52px,8.125vw,65px)]"
          />
          <span className="absolute inset-y-0 left-[clamp(82px,12.5vw,100px)] flex w-[clamp(124px,18.25vw,146px)] items-center justify-center whitespace-nowrap text-[clamp(28px,4.5vw,36px)] font-bold leading-none">
            직원 상담
          </span>
        </button>
      </header>

      <main className="flex min-h-[100svh] flex-col px-[clamp(24px,6vw,48px)] pb-[clamp(48px,11vw,88px)] pt-[clamp(264px,40vw,320px)]">
        <h1 className="text-center text-[clamp(30px,8vw,64px)] font-extrabold leading-[1.022727]">
          자격증이 있으신가요?
        </h1>

        <section
          aria-label="자격증 종류 선택"
          className="mt-[clamp(20px,3.0625vw,24.5px)] grid grid-cols-2 gap-4 md:grid-cols-3"
        >
          <button
            type="button"
            aria-pressed={noneSelected}
            onClick={onNone}
            className={`relative h-[clamp(120px,20.5vw,164px)] rounded-[clamp(18px,3vw,24px)] border-2 border-[#BF473D] bg-[#FDEAE7] text-[#9C241E] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#BF473D] focus-visible:ring-offset-4 focus-visible:ring-offset-[#FAF8F2] ${
              noneSelected ? 'shadow-[0_0_0_4px_rgba(191,71,61,0.2)]' : ''
            }`}
          >
            <span className="absolute inset-x-0 top-2.5 flex h-[58px] items-center justify-center text-[clamp(28px,4.5vw,36px)] font-bold leading-[1.6]">
              없음
            </span>
            <span className="absolute left-1/2 top-[clamp(70px,10.5vw,84px)] flex h-11 w-11 -translate-x-1/2 items-center justify-center">
              <img src={noneIcon} alt="" aria-hidden="true" />
            </span>
          </button>

          {CERTIFICATION_CATEGORIES.map((category) => {
            const selected =
              category.options.some((option) =>
                selectedIds.includes(option.id),
              ) ||
              (category.id === 'other' && otherValue.trim().length > 0)

            return (
              <button
                key={category.id}
                type="button"
                aria-haspopup="dialog"
                aria-expanded={activeCategoryId === category.id}
                aria-pressed={selected}
                onClick={() => openCategorySheet(category.id)}
                className={`relative h-[clamp(120px,20.5vw,164px)] min-w-0 rounded-[clamp(18px,3vw,24px)] border-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-600 focus-visible:ring-offset-4 focus-visible:ring-offset-[#FAF8F2] ${
                  selected
                    ? 'border-primary-600 bg-primary-100'
                    : 'border-primary-100 bg-white'
                }`}
              >
                <span
                  className={`absolute inset-x-0 flex items-center justify-center whitespace-nowrap font-extrabold ${
                    category.id === 'other'
                      ? 'top-2 h-[60px] text-[clamp(28px,4.5vw,36px)] leading-[1.6667]'
                      : 'top-3 h-[54px] text-[clamp(22px,4vw,32px)] leading-[1.6667]'
                  }`}
                >
                  {category.label}
                </span>
                <span className="absolute left-1/2 top-[clamp(70px,10.5vw,84px)] flex h-11 w-11 -translate-x-1/2 items-center justify-center">
                  <img
                    src={CATEGORY_ICONS[category.id]}
                    alt=""
                    aria-hidden="true"
                    className="max-h-10 max-w-[42px]"
                  />
                </span>
              </button>
            )
          })}
        </section>

        <div className="min-h-[clamp(64px,20.25vw,162px)] flex-1" />

        <Button
          type="button"
          variant="primary"
          size="4xl"
          onClick={onNext}
          className="!h-[clamp(88px,12vw,96px)] !min-h-[clamp(88px,12vw,96px)] !w-full !rounded-[clamp(22px,3.5vw,28px)] !border-0 !px-8 !py-0 !text-[clamp(36px,6vw,48px)] !leading-[1.3333] !tracking-normal"
        >
          다음
        </Button>
      </main>

      {activeCategory ? (
        <CertificationDetailSheet
          category={activeCategory}
          selectedValue={draftSelectedValue}
          outsideSelectionCount={outsideSelectionCount}
          selectionLimit={selectionLimit}
          onChange={(optionId) =>
            setDraftSelectedValue((previous) =>
              previous === optionId ? null : optionId,
            )
          }
          onApply={applyCategorySelection}
          onClose={closeCategorySheet}
        />
      ) : null}
    </div>
  )
}
