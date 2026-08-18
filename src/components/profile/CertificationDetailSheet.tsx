import { useId, useMemo, useState } from 'react'
import radioDotIcon from '../../assets/icons/certifications/radio-dot.svg'
import selectedRadioIcon from '../../assets/icons/certifications/radio-selected.svg'
import unselectedRadioIcon from '../../assets/icons/certifications/radio-unselected.svg'
import searchMenuIcon from '../../assets/icons/certifications/search-menu.svg'
import type { CertificationCategory } from '../../data/profileOptions'
import { Button } from '../common/Button'
import { BottomSheetDialog } from './BottomSheetDialog'

interface CertificationDetailSheetProps {
  category: CertificationCategory
  selectedValue: string | null
  outsideSelectionCount: number
  selectionLimit: number
  onChange: (optionId: string) => void
  onApply: () => void
  onClose: () => void
}

export function CertificationDetailSheet({
  category,
  selectedValue,
  outsideSelectionCount,
  selectionLimit,
  onChange,
  onApply,
  onClose,
}: CertificationDetailSheetProps) {
  const titleId = useId()
  const resultStatusId = useId()
  const [searchQuery, setSearchQuery] = useState('')

  const visibleOptions = useMemo(() => {
    const query = searchQuery.trim()
    if (!query) return category.options
    return category.options.filter((option) => option.label.includes(query))
  }, [category.options, searchQuery])

  const selectedIndex = visibleOptions.findIndex(
    (option) => option.id === selectedValue,
  )
  const visualCenterIndex =
    selectedIndex >= 0
      ? selectedIndex
      : Math.min(2, Math.max(0, visibleOptions.length - 1))
  const atSelectionLimit =
    selectedValue === null && outsideSelectionCount >= selectionLimit

  return (
    <BottomSheetDialog
      labelledBy={titleId}
      onClose={onClose}
      surfaceClassName="h-[min(860px,calc(100svh-24px))] overflow-y-auto"
    >
      <div className="relative min-h-[860px]">
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-[22px] h-2 w-16 -translate-x-1/2 rounded-full bg-primary-600"
        />

        <h2
          id={titleId}
          className="absolute left-[clamp(24px,6vw,48px)] right-[clamp(24px,6vw,48px)] top-11 text-[clamp(32px,5vw,40px)] font-extrabold leading-[1.6667]"
        >
          {category.label} 자격증
        </h2>

        <label className="absolute left-[clamp(24px,6vw,48px)] right-[clamp(24px,6vw,48px)] top-[116px] h-[72px]">
          <span className="sr-only">자격증 검색</span>
          <img
            src={searchMenuIcon}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute left-5 top-1/2 z-10 h-3 w-[18px] -translate-y-1/2"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            aria-describedby={resultStatusId}
            placeholder="자격증 검색"
            autoComplete="off"
            className="h-full w-full rounded-[clamp(22px,4vw,32px)] border-0 bg-primary-100 pl-14 pr-6 text-[clamp(20px,3vw,24px)] font-bold text-[#0D0C0C] outline-none placeholder:text-[#0D0C0C] focus-visible:ring-4 focus-visible:ring-primary-600 focus-visible:ring-offset-4 focus-visible:ring-offset-white [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
          />
        </label>

        <p id={resultStatusId} className="sr-only" aria-live="polite">
          검색 결과 {visibleOptions.length}개
        </p>

        <section
          aria-label={`${category.label} 자격증 선택`}
          className="absolute left-[clamp(24px,6vw,48px)] right-[clamp(24px,6vw,48px)] top-[226px] flex flex-col gap-2.5"
        >
          {visibleOptions.map((option, index) => {
            const selected = option.id === selectedValue
            const distance = Math.abs(index - visualCenterIndex)
            const depthClass =
              distance === 0
                ? 'mx-0 h-24 px-[26px] text-[clamp(30px,4.5vw,36px)] font-bold leading-[1.4286] opacity-100'
                : distance === 1
                  ? 'mx-[clamp(8px,2vw,16px)] h-[70px] px-[23px] text-[clamp(27px,3.75vw,30px)] font-bold leading-[1.74] opacity-[0.58]'
                  : 'mx-[clamp(16px,4vw,32px)] h-[60px] px-[23px] text-[clamp(24px,3.25vw,26px)] font-extrabold leading-[2] opacity-[0.28]'

            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={selected}
                disabled={atSelectionLimit && !selected}
                onClick={() => onChange(option.id)}
                className={`flex min-w-0 items-center rounded-[20px] text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-600 focus-visible:ring-offset-4 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-20 ${depthClass} ${
                  selected
                    ? 'border-2 border-primary-600 bg-primary-100'
                    : 'border border-primary-100 bg-white'
                }`}
              >
                <span className="relative h-9 w-9 shrink-0">
                  <img
                    src={selected ? selectedRadioIcon : unselectedRadioIcon}
                    alt=""
                    aria-hidden="true"
                    className="h-9 w-9"
                  />
                  {selected ? (
                    <img
                      src={radioDotIcon}
                      alt=""
                      aria-hidden="true"
                      className="absolute left-1/2 top-1/2 h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2"
                    />
                  ) : null}
                </span>
                <span className="ml-6 min-w-0 truncate">{option.label}</span>
              </button>
            )
          })}
        </section>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[clamp(24px,6vw,48px)] right-[clamp(24px,6vw,48px)] top-[590px] h-[70px] bg-gradient-to-b from-white/0 to-white"
        />

        <div className="absolute bottom-12 left-[clamp(24px,6vw,48px)] right-[clamp(24px,6vw,48px)]">
          <Button
            type="button"
            variant="primary"
            size="4xl"
            onClick={onApply}
            className="!h-24 !min-h-24 !w-full !rounded-[28px] !border-0 !bg-primary-600 !px-8 !py-0 !text-[clamp(36px,5.5vw,44px)] !leading-[1.3333] !tracking-normal hover:!bg-primary-600"
          >
            적용
          </Button>
        </div>
      </div>
    </BottomSheetDialog>
  )
}
