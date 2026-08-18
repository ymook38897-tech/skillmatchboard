import { useId, useMemo, useState } from 'react'
import checkboxEmptyIcon from '../../assets/icons/certifications-final/checkbox-empty.svg'
import checkboxSelectedIcon from '../../assets/icons/certifications-final/checkbox-selected.svg'
import scrollDownIcon from '../../assets/icons/certifications-final/scroll-down.svg'
import searchIcon from '../../assets/icons/certifications-final/search.svg'
import type { CertificationCategory } from '../../data/profileOptions'
import { Button } from '../common/Button'
import { BottomSheetDialog } from './BottomSheetDialog'

interface CertificationDetailSheetProps {
  category: CertificationCategory
  selectedValues: readonly string[]
  outsideSelectionCount: number
  selectionLimit: number
  onToggle: (optionId: string) => void
  onApply: () => void
  onClose: () => void
}

interface OptionButtonProps {
  id: string
  label: string
  selected: boolean
  disabled: boolean
  onToggle: (id: string) => void
}

function OptionButton({
  id,
  label,
  selected,
  disabled,
  onToggle,
}: OptionButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={() => onToggle(id)}
      className={`flex h-[70px] w-full items-center rounded-[15px] border px-[17px] text-left text-[clamp(19px,2.75vw,22px)] font-bold leading-[normal] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#5E7E72] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 ${
        selected
          ? 'border-[#597A70] bg-[#DCEAE4] text-[#38564E]'
          : 'border-[#DBE0DE] bg-white text-[#171C1A]'
      }`}
    >
      <img
        src={selected ? checkboxSelectedIcon : checkboxEmptyIcon}
        alt=""
        aria-hidden="true"
        className="mr-[22px] size-[34px] shrink-0"
      />
      <span className="min-w-0 truncate">{label}</span>
    </button>
  )
}

export function CertificationDetailSheet({
  category,
  selectedValues,
  outsideSelectionCount,
  selectionLimit,
  onToggle,
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

  const popularOptionIds = new Set(
    category.options.slice(0, Math.min(2, category.options.length)).map(
      (option) => option.id,
    ),
  )
  const popularOptions = visibleOptions.filter((option) =>
    popularOptionIds.has(option.id),
  )
  const otherOptions = visibleOptions.filter(
    (option) => !popularOptionIds.has(option.id),
  )
  const selectionLimitReached =
    outsideSelectionCount + selectedValues.length >= selectionLimit

  const renderOption = (option: (typeof category.options)[number]) => {
    const selected = selectedValues.includes(option.id)
    return (
      <OptionButton
        key={option.id}
        id={option.id}
        label={option.label}
        selected={selected}
        disabled={selectionLimitReached && !selected}
        onToggle={onToggle}
      />
    )
  }

  return (
    <BottomSheetDialog
      labelledBy={titleId}
      onClose={onClose}
      surfaceClassName="h-[min(842px,calc(100svh-24px))] overflow-y-auto"
    >
      <div className="relative min-h-[842px]">
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-4 h-2 w-[140px] -translate-x-1/2 rounded-full bg-[#5F7D74]"
        />

        <h2
          id={titleId}
          className="absolute left-[clamp(20px,4.25vw,34px)] right-[clamp(20px,4.25vw,34px)] top-[54px] text-[clamp(28px,4.25vw,34px)] font-extrabold leading-[normal]"
        >
          {category.label} 자격증
        </h2>

        <label className="absolute left-[clamp(20px,4.25vw,34px)] right-[clamp(20px,4.25vw,34px)] top-[118px] h-[70px]">
          <span className="sr-only">자격증 검색</span>
          <img
            src={searchIcon}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute left-[18px] top-1/2 z-10 size-[34px] -translate-y-1/2"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            aria-describedby={resultStatusId}
            placeholder="자격증 검색"
            autoComplete="off"
            className="h-full w-full rounded-[15px] border-0 bg-[#DCEAE4] pl-[66px] pr-5 text-[clamp(19px,2.75vw,22px)] font-bold text-[#171C1A] outline-none placeholder:text-[#53635D] focus-visible:ring-4 focus-visible:ring-[#5E7E72] focus-visible:ring-offset-2 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
          />
        </label>

        <p id={resultStatusId} className="sr-only" aria-live="polite">
          검색 결과 {visibleOptions.length}개
        </p>

        <section
          aria-label={`${category.label} 자격증 선택`}
          className="absolute left-[clamp(20px,4.25vw,34px)] right-[clamp(20px,4.25vw,34px)] top-[202px] h-[454px] overflow-y-auto overflow-x-hidden pb-[68px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {popularOptions.length > 0 ? (
            <div>
              <h3 className="flex h-9 items-center text-[clamp(18px,2.5vw,20px)] font-bold leading-[normal] text-[#53635D]">
                많이 선택하는 자격증
              </h3>
              <div className="mt-2 grid gap-2">
                {popularOptions.map(renderOption)}
              </div>
            </div>
          ) : null}

          {otherOptions.length > 0 ? (
            <div className="mt-4">
              <h3 className="flex h-9 items-center text-[clamp(18px,2.5vw,20px)] font-bold leading-[normal] text-[#53635D]">
                다른 자격증
              </h3>
              <div className="mt-2 grid gap-2">
                {otherOptions.map(renderOption)}
              </div>
            </div>
          ) : null}
        </section>

        {visibleOptions.length > 3 ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[clamp(20px,4.25vw,34px)] right-[clamp(20px,4.25vw,34px)] top-[588px] h-[68px] bg-gradient-to-b from-white/0 to-white"
          >
            <img
              src={scrollDownIcon}
              alt=""
              className="absolute bottom-0 left-1/2 h-7 w-10 -translate-x-1/2"
            />
          </div>
        ) : null}

        <div className="absolute bottom-[50px] left-[clamp(20px,4.25vw,34px)] right-[clamp(20px,4.25vw,34px)]">
          <Button
            type="button"
            variant="primary"
            size="xl"
            onClick={onApply}
            className="!h-[92px] !min-h-[92px] !w-full !rounded-[18px] !border-0 !bg-[linear-gradient(90deg,#486D92_0%,#71B48F_100%)] !px-6 !py-0 !text-[clamp(22px,3.125vw,25px)] !font-bold !leading-[normal] !shadow-[0_8px_16px_rgba(37,50,45,0.16)]"
          >
            {selectedValues.length > 0
              ? `선택한 자격증 ${selectedValues.length}개 적용`
              : '적용'}
          </Button>
        </div>
      </div>
    </BottomSheetDialog>
  )
}
