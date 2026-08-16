import explanationIcon from '../assets/icons/barriers/explanation.svg'
import fineHandIcon from '../assets/icons/barriers/fine-hand.svg'
import hearingIcon from '../assets/icons/barriers/hearing.svg'
import liftIcon from '../assets/icons/barriers/lift.svg'
import noneIcon from '../assets/icons/barriers/none.svg'
import previousStepIcon from '../assets/icons/barriers/previous-step-up.svg'
import smallTextIcon from '../assets/icons/barriers/small-text.svg'
import standIcon from '../assets/icons/barriers/stand.svg'
import headsetConsultationIcon from '../assets/icons/headset-consultation.svg'
import { Button } from '../components/common/Button'
import { BARRIER_MAIN_OPTIONS } from '../data/profileOptions'

interface BarrierSelectionPageProps {
  selectedIds: string[]
  noneSelected: boolean
  selectionLimit: number
  onToggle: (barrierId: string) => void
  onNone: () => void
  onPrev: () => void
  onNext: () => void
  onHelp: () => void
}

type BarrierMainOptionId = (typeof BARRIER_MAIN_OPTIONS)[number]['id']

const BARRIER_ICONS: Record<BarrierMainOptionId, string> = {
  'stand-long': standIcon,
  'lift-heavy': liftIcon,
  'read-small-text': smallTextIcon,
  'hear-speech': hearingIcon,
  'fine-hand-use': fineHandIcon,
  'understand-complex-explanation': explanationIcon,
}

export function BarrierSelectionPage({
  selectedIds,
  noneSelected,
  selectionLimit,
  onToggle,
  onNone,
  onPrev,
  onNext,
  onHelp,
}: BarrierSelectionPageProps) {
  return (
    <div className="v6-entry-page relative min-h-[100svh] overflow-x-hidden rounded-[clamp(20px,4vw,32px)] bg-[#FAF8F2] text-[#0D0C0C]">
      <button
        type="button"
        onClick={onPrev}
        aria-label="이전 단계 · 나이 선택"
        className="group absolute left-1/2 top-[clamp(96px,15.5vw,124px)] z-20 h-[clamp(144px,20.5vw,164px)] w-[min(608px,calc(100vw-48px))] -translate-x-1/2 border-0 p-0 focus-visible:outline-none"
      >
        <span className="absolute inset-x-0 top-0 flex h-[clamp(72px,11vw,88px)] items-center justify-center rounded-[clamp(18px,3vw,24px)] border-[1.5px] border-primary-600 bg-white text-[clamp(30px,5vw,40px)] font-bold leading-none text-primary-600 shadow-[0_4px_12px_rgba(13,12,12,0.05)] backdrop-blur-[8px] group-focus-visible:ring-4 group-focus-visible:ring-primary-600 group-focus-visible:ring-offset-4 group-focus-visible:ring-offset-[#FAF8F2]">
          이전 단계&nbsp; · &nbsp;나이 선택
        </span>
        <span className="absolute bottom-0 left-1/2 flex h-[clamp(48px,7vw,56px)] w-[clamp(80px,12vw,96px)] -translate-x-1/2 items-center justify-center rounded-[clamp(16px,2.5vw,20px)] border-[1.5px] border-primary-600 bg-white shadow-[0_4px_12px_rgba(13,12,12,0.07)]">
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
          className="absolute right-[clamp(16px,3.25vw,26px)] top-[clamp(16px,2.875vw,23px)] h-[clamp(80px,12.5vw,100px)] w-[min(270px,calc(100vw-32px))] rounded-[clamp(18px,3vw,24px)] border-[1.5px] border-[rgba(82,120,111,0.92)] bg-[rgba(255,255,255,0.82)] text-primary-600 shadow-[0_4px_12px_rgba(13,12,12,0.08)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-600 focus-visible:ring-offset-4 focus-visible:ring-offset-[#FAF8F2]"
        >
          <img
            src={headsetConsultationIcon}
            alt=""
            aria-hidden="true"
            className="absolute left-[clamp(18px,2.8125vw,22.5px)] top-[clamp(16px,2.5625vw,20.5px)] h-[clamp(48px,7.5vw,60px)] w-[clamp(52px,8.125vw,65px)]"
          />
          <span className="absolute inset-y-0 left-[clamp(82px,12.3125vw,98.5px)] flex w-[clamp(124px,18.25vw,146px)] items-center justify-center whitespace-nowrap text-[clamp(28px,4.5vw,36px)] font-bold leading-none">
            직원 상담
          </span>
        </button>
      </header>

      <main className="flex min-h-[100svh] flex-col px-[clamp(24px,6vw,48px)] pb-[clamp(32px,6vw,48px)] pt-[clamp(264px,39.5vw,316px)]">
        <h1 className="text-center text-[clamp(40px,8vw,64px)] font-extrabold leading-[0.9375]">
          어려운 일을 알려주세요
        </h1>

        <section
          aria-label="어려운 일 선택"
          className="mt-[clamp(24px,4.25vw,34px)] grid grid-cols-1 gap-[clamp(14px,2.25vw,18px)] md:grid-cols-2"
        >
          {BARRIER_MAIN_OPTIONS.map((option, index) => {
            const selected = selectedIds.includes(option.id)
            const disabled =
              !selected && selectedIds.length >= selectionLimit

            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={selected}
                disabled={disabled}
                onClick={() => onToggle(option.id)}
                className={`flex h-[clamp(96px,14vw,112px)] min-w-0 items-center gap-[clamp(10px,1.5vw,12px)] rounded-[clamp(18px,3vw,24px)] border-2 px-[clamp(16px,2.75vw,22px)] text-left font-bold leading-[1.0625] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-600 focus-visible:ring-offset-4 focus-visible:ring-offset-[#FAF8F2] disabled:cursor-not-allowed disabled:opacity-45 ${
                  selected
                    ? 'border-primary-600 bg-primary-100'
                    : 'border-primary-100 bg-white'
                }`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-visible">
                  <img
                    src={BARRIER_ICONS[option.id]}
                    alt=""
                    aria-hidden="true"
                    className="max-h-10 max-w-10"
                  />
                </span>
                <span
                  className={`min-w-0 whitespace-nowrap ${
                    index === 0
                      ? 'text-[clamp(28px,4.5vw,36px)]'
                      : 'text-[clamp(27px,4vw,32px)]'
                  }`}
                >
                  {option.label}
                </span>
              </button>
            )
          })}
        </section>

        <button
          type="button"
          aria-pressed={noneSelected}
          onClick={onNone}
          className={`mt-[clamp(28px,5vw,40px)] flex h-[clamp(88px,12vw,96px)] w-full items-center gap-[clamp(10px,1.5vw,12px)] rounded-[clamp(18px,3vw,24px)] border-2 px-[clamp(16px,2.75vw,22px)] text-left text-[clamp(28px,4vw,32px)] font-bold leading-[1.0625] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-600 focus-visible:ring-offset-4 focus-visible:ring-offset-[#FAF8F2] ${
            noneSelected
              ? 'border-primary-600 bg-primary-100'
              : 'border-primary-100 bg-white'
          }`}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-visible">
            <img
              src={noneIcon}
              alt=""
              aria-hidden="true"
              className="max-h-10 max-w-10"
            />
          </span>
          <span>어려운 일 없어요</span>
        </button>

        <Button
          type="button"
          variant="primary"
          size="4xl"
          onClick={onNext}
          className="!mt-auto !h-[clamp(88px,12vw,96px)] !min-h-[clamp(88px,12vw,96px)] !w-full !rounded-[clamp(22px,3.5vw,28px)] !border-0 !px-8 !py-0 !text-[clamp(36px,6vw,48px)] !leading-[0.833333] !tracking-[0.1em]"
        >
          다음
        </Button>
      </main>
    </div>
  )
}
