import { useId } from 'react'
import selectedCheckIcon from '../../assets/icons/difficulty-details/check-selected.svg'
import unselectedCheckIcon from '../../assets/icons/difficulty-details/check-unselected.svg'
import type { SelectionOption } from '../../data/profileOptions'
import { Button } from '../common/Button'
import { BottomSheetDialog } from './BottomSheetDialog'

interface DifficultyDetailSheetProps {
  title: string
  options: readonly SelectionOption[]
  selectedValues: readonly string[]
  onChange: (optionId: string) => void
  onApply: () => void
  onClose: () => void
}

export function DifficultyDetailSheet({
  title,
  options,
  selectedValues,
  onChange,
  onApply,
  onClose,
}: DifficultyDetailSheetProps) {
  const titleId = useId()

  return (
    <BottomSheetDialog
      labelledBy={titleId}
      onClose={onClose}
      surfaceClassName="h-[min(700px,calc(100svh-24px))] overflow-y-auto"
    >
        <div className="flex min-h-[700px] flex-col">
          <div
            aria-hidden="true"
            className="mx-auto mt-6 h-2 w-16 shrink-0 rounded-full bg-primary-600"
          />

          <h2
            id={titleId}
            className="mx-[clamp(24px,8.5vw,68px)] mt-[62px] shrink-0 text-[clamp(32px,5vw,40px)] font-extrabold leading-[1.2]"
          >
            {title}
          </h2>

          <section
            aria-label="세부 상황 선택"
            className="mx-[clamp(24px,6vw,48px)] mt-[58px] flex shrink-0 flex-col gap-4"
          >
            {options.map((option) => {
              const selected = selectedValues.includes(option.id)

              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onChange(option.id)}
                  className={`flex h-[88px] w-full items-center justify-between rounded-[22px] text-left text-[clamp(25px,3.5vw,28px)] font-bold leading-[42px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-600 focus-visible:ring-offset-4 focus-visible:ring-offset-white ${
                    selected
                      ? 'border-[3px] border-primary-600 bg-primary-100 pl-[22px] pr-8'
                      : 'border-2 border-primary-100 bg-white pl-[23px] pr-8'
                  }`}
                >
                  <span className="min-w-0">{option.label}</span>
                  <span
                    aria-hidden="true"
                    className="relative ml-4 h-10 w-10 shrink-0"
                  >
                    <img
                      src={selected ? selectedCheckIcon : unselectedCheckIcon}
                      alt=""
                      className="h-10 w-10"
                    />
                    {selected ? (
                      <span className="absolute inset-0 flex items-center justify-center pb-0.5 text-[28px] font-extrabold leading-none text-white">
                        ✓
                      </span>
                    ) : null}
                  </span>
                </button>
              )
            })}
          </section>

          <div className="mx-[clamp(24px,6vw,48px)] mb-12 mt-[60px] shrink-0">
            <Button
              type="button"
              variant="primary"
              size="4xl"
              onClick={onApply}
              className="!h-24 !min-h-24 !w-full !rounded-[28px] !border-0 !bg-primary-600 !px-8 !py-0 !text-[clamp(36px,5.5vw,44px)] !leading-10 !tracking-[0.1em] hover:!bg-primary-600"
            >
              적용
            </Button>
          </div>
        </div>
    </BottomSheetDialog>
  )
}
