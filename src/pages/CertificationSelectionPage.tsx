import { useState } from 'react'
import beautyIcon from '../assets/icons/certifications-final/beauty.svg'
import careIcon from '../assets/icons/certifications-final/care.svg'
import chevronIcon from '../assets/icons/certifications-final/chevron.svg'
import cookingIcon from '../assets/icons/certifications-final/cooking.svg'
import drivingIcon from '../assets/icons/certifications-final/driving.svg'
import nextIcon from '../assets/icons/certifications-final/next.svg'
import noneIcon from '../assets/icons/certifications-final/none.svg'
import officeIcon from '../assets/icons/certifications-final/office.svg'
import otherIcon from '../assets/icons/certifications-final/other.svg'
import previousIcon from '../assets/icons/certifications-final/previous.svg'
import safetyIcon from '../assets/icons/certifications-final/safety.svg'
import staffHeadsetIcon from '../assets/icons/certifications-final/staff-headset.svg'
import technicalIcon from '../assets/icons/certifications-final/technical.svg'
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
  const [draftSelectedIds, setDraftSelectedIds] = useState<string[]>([])

  const activeCategory = CERTIFICATION_CATEGORIES.find(
    (category) => category.id === activeCategoryId,
  )

  const openCategorySheet = (categoryId: CertificationCategoryId) => {
    const category = CERTIFICATION_CATEGORIES.find(
      (candidate) => candidate.id === categoryId,
    )
    const optionIds = new Set<string>(
      category?.options.map((option) => option.id) ?? [],
    )

    setDraftSelectedIds(selectedIds.filter((id) => optionIds.has(id)))
    setActiveCategoryId(categoryId)
  }

  const closeCategorySheet = () => {
    setActiveCategoryId(null)
    setDraftSelectedIds([])
  }

  const applyCategorySelection = () => {
    if (!activeCategory) return
    onApplyCategory(activeCategory.id, draftSelectedIds)
    closeCategorySheet()
  }

  const toggleDraftSelection = (optionId: string) => {
    setDraftSelectedIds((previous) =>
      previous.includes(optionId)
        ? previous.filter((id) => id !== optionId)
        : [...previous, optionId],
    )
  }

  const activeOptionIds = new Set<string>(
    activeCategory?.options.map((option) => option.id) ?? [],
  )
  const outsideSelectionCount =
    selectedIds.filter((id) => !activeOptionIds.has(id)).length +
    (otherValue.trim() ? 1 : 0)

  return (
    <div className="v6-entry-page relative min-h-[max(100svh,1360px)] overflow-x-hidden rounded-[clamp(20px,3.75vw,30px)] bg-[linear-gradient(102.244deg,#FFFDF9_0%,#EDF4F0_103.09%)] text-[#171C1A] shadow-[0_8px_24px_rgba(37,50,45,0.13)] sm:min-h-[max(100svh,1280px)]">
      <div className="relative mx-auto min-h-[max(100svh,1360px)] w-full max-w-[800px] sm:min-h-[max(100svh,1280px)]">
        <header className="absolute inset-x-0 top-0 z-20 h-[clamp(96px,14.5vw,116px)] bg-[rgba(255,255,255,0.72)] shadow-[0_8px_24px_rgba(37,50,45,0.13)] backdrop-blur-[9px]">
          <div className="absolute left-[clamp(16px,4.75vw,38px)] top-[clamp(14px,2.25vw,18px)] h-[clamp(68px,9.75vw,78px)] w-[clamp(144px,45vw,360px)]">
            <p className="h-[clamp(26px,4.25vw,34px)] whitespace-pre-wrap text-[clamp(17px,2.75vw,22px)] font-bold leading-[normal] text-[#5E8C7A]">
              기본 정보  5 / 5
            </p>
            <div className="absolute inset-x-0 top-[clamp(43px,6.375vw,51px)] h-[clamp(8px,1.25vw,10px)] overflow-hidden rounded-full bg-[#D9E3E0]">
              <div className="h-full w-full rounded-full bg-[#5E8C7A]" />
            </div>
          </div>

          <button
            type="button"
            onClick={onHelp}
            className="absolute right-[clamp(8px,3.5vw,28px)] top-[clamp(12px,2.5vw,20px)] flex h-[clamp(68px,9.5vw,76px)] w-[clamp(140px,28vw,224px)] items-center justify-center gap-[clamp(7px,1.5vw,12px)] rounded-[clamp(17px,2.375vw,19px)] border-[1.5px] border-[#5D776F] bg-[rgba(255,255,255,0.78)] text-[clamp(17px,3.125vw,25px)] font-bold leading-[normal] text-[#38564E] shadow-[0_8px_12px_rgba(37,50,45,0.14)] backdrop-blur-[9px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#5E7E72] focus-visible:ring-offset-4 focus-visible:ring-offset-[#FFFDF9]"
          >
            <img
              src={staffHeadsetIcon}
              alt=""
              aria-hidden="true"
              className="size-[clamp(28px,4.75vw,38px)]"
            />
            <span className="whitespace-nowrap">직원 상담</span>
          </button>
        </header>

        <main>
          <h1 className="absolute left-[clamp(16px,4.25vw,34px)] right-[clamp(16px,4.25vw,34px)] top-[clamp(132px,18.25vw,146px)] text-[clamp(31px,5vw,40px)] font-extrabold leading-[normal]">
            자격증이 있으신가요?
          </h1>
          <p className="absolute left-[clamp(16px,4.25vw,34px)] right-[clamp(16px,4.25vw,34px)] top-[clamp(184px,25.5vw,204px)] text-[clamp(18px,3vw,24px)] font-bold leading-[normal] text-[#61716B]">
            종류를 누르면 세부 자격증을 고를 수 있어요.
          </p>

          <section
            aria-label="자격증 종류 선택"
            className="absolute left-[clamp(16px,4vw,32px)] right-[clamp(16px,4vw,32px)] top-[clamp(258px,34.75vw,278px)] grid gap-3"
          >
            <button
              type="button"
              aria-pressed={noneSelected}
              onClick={onNone}
              className={`flex h-[82px] min-w-0 items-center rounded-[18px] border-2 px-[16px] text-left text-[clamp(23px,3.5vw,28px)] font-bold leading-[normal] text-[#B14F3E] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#B14F3E] focus-visible:ring-offset-3 focus-visible:ring-offset-[#FFFDF9] ${
                noneSelected
                  ? 'border-[#B14F3E] bg-[#FCEDE9] shadow-[0_0_0_3px_rgba(177,79,62,0.12)]'
                  : 'border-[#B14F3E] bg-[rgba(252,237,233,0.96)]'
              }`}
            >
              <img
                src={noneIcon}
                alt=""
                aria-hidden="true"
                className="mr-[22px] size-[60px] shrink-0 object-contain"
              />
              <span>없음</span>
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
                  className={`flex h-[82px] min-w-0 items-center rounded-[18px] border-[1.5px] px-[16.5px] text-left text-[clamp(23px,3.5vw,28px)] font-bold leading-[normal] shadow-[0_4px_5px_rgba(41,69,59,0.07)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#5E7E72] focus-visible:ring-offset-3 focus-visible:ring-offset-[#FFFDF9] ${
                    selected
                      ? 'border-[#597A70] bg-[#DCEAE4] text-[#38564E]'
                      : 'border-[#D1E0D9] bg-[rgba(255,255,255,0.96)] text-[#171C1A]'
                  }`}
                >
                  <img
                    src={CATEGORY_ICONS[category.id]}
                    alt=""
                    aria-hidden="true"
                    className="mr-[22px] size-[60px] shrink-0 object-contain"
                  />
                  <span className="min-w-0 flex-1 truncate">{category.label}</span>
                  <img
                    src={chevronIcon}
                    alt=""
                    aria-hidden="true"
                    className="ml-4 size-[30px] shrink-0"
                  />
                </button>
              )
            })}
          </section>
        </main>
      </div>

      <footer className="fixed bottom-0 left-1/2 z-30 h-[clamp(108px,15.5vw,124px)] w-full max-w-[800px] -translate-x-1/2 bg-[rgba(255,255,255,0.78)] px-[clamp(16px,3vw,24px)] py-[clamp(14px,2.75vw,22px)] shadow-[0_-5px_18px_rgba(37,50,45,0.10)] backdrop-blur-[9px]">
        <div className="grid h-full w-full grid-cols-[minmax(0,0.759615fr)_minmax(0,1fr)] gap-[clamp(12px,2.5vw,20px)]">
          <Button
            type="button"
            variant="outline"
            size="xl"
            onClick={onPrev}
            className="!h-full !min-h-0 !rounded-[clamp(16px,2.25vw,18px)] !border-[1.5px] !border-[#CED8D3] !bg-[rgba(255,255,255,0.88)] !px-0 !py-0 !text-[clamp(23px,3.375vw,27px)] !font-bold !leading-[normal] !text-[#171C1A] !shadow-[0_8px_12px_rgba(37,50,45,0.14)]"
          >
            <img
              src={previousIcon}
              alt=""
              aria-hidden="true"
              className="mr-[clamp(8px,1.5vw,12px)] size-[clamp(30px,4.5vw,36px)]"
            />
            이전
          </Button>
          <Button
            type="button"
            variant="primary"
            size="xl"
            onClick={onNext}
            className="!h-full !min-h-0 !rounded-[clamp(16px,2.25vw,18px)] !border-0 !bg-[linear-gradient(90deg,#486D92_0%,#71B48F_100%)] !px-0 !py-0 !text-[clamp(23px,3.375vw,27px)] !font-bold !leading-[normal] !shadow-[0_8px_12px_rgba(37,50,45,0.14)]"
          >
            다음
            <img
              src={nextIcon}
              alt=""
              aria-hidden="true"
              className="ml-[clamp(8px,1.5vw,12px)] size-[clamp(30px,4.5vw,36px)]"
            />
          </Button>
        </div>
      </footer>

      {activeCategory ? (
        <CertificationDetailSheet
          category={activeCategory}
          selectedValues={draftSelectedIds}
          outsideSelectionCount={outsideSelectionCount}
          selectionLimit={selectionLimit}
          onToggle={toggleDraftSelection}
          onApply={applyCategorySelection}
          onClose={closeCategorySheet}
        />
      ) : null}
    </div>
  )
}
