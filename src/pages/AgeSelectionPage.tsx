import headsetConsultationIcon from '../assets/icons/headset-consultation.svg'
import { Button } from '../components/common/Button'
import type { AgeBandId } from '../types/flow'

interface AgeSelectionPageProps {
  value: AgeBandId | null
  onChange: (ageBand: AgeBandId) => void
  onNext: () => void
  onHelp: () => void
}

const AGE_OPTIONS = [
  { id: '18-29', label: '만 18세~29세' },
  { id: '30-49', label: '만 30세~49세' },
  { id: '50-64', label: '만 50세~64세' },
  { id: '65-plus', label: '만 65세 이상' },
] as const satisfies ReadonlyArray<{ id: AgeBandId; label: string }>

export function AgeSelectionPage({
  value,
  onChange,
  onNext,
  onHelp,
}: AgeSelectionPageProps) {
  return (
    <div className="v6-entry-page flex min-h-[100svh] flex-col overflow-x-hidden rounded-[clamp(20px,4vw,32px)] bg-[#FAF8F2] text-[#0D0C0C]">
      <header className="flex h-[clamp(112px,18.5vw,148px)] shrink-0 items-center justify-end rounded-t-[clamp(20px,4vw,32px)] rounded-b-[clamp(16px,3vw,24px)] border border-[rgba(82,120,111,0.16)] bg-[rgba(250,248,242,0.78)] px-4 shadow-[0_6px_18px_rgba(13,12,12,0.08)] backdrop-blur-[12px]">
        <button
          type="button"
          onClick={onHelp}
          className="flex h-[clamp(80px,12.5vw,100px)] w-[min(270px,calc(100vw-32px))] items-center rounded-[clamp(18px,3vw,24px)] border-[1.5px] border-[rgba(82,120,111,0.92)] bg-[rgba(255,255,255,0.82)] px-6 text-primary-600 shadow-[0_4px_12px_rgba(13,12,12,0.08)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-600 focus-visible:ring-offset-4 focus-visible:ring-offset-[#FAF8F2]"
        >
          <img
            src={headsetConsultationIcon}
            alt=""
            aria-hidden="true"
            className="h-[clamp(48px,7.5vw,60px)] w-[clamp(52px,8.125vw,65px)] shrink-0"
          />
          <span className="ml-[clamp(8px,1.375vw,11px)] whitespace-nowrap text-[clamp(28px,4.5vw,36px)] font-bold leading-none">
            직원 상담
          </span>
        </button>
      </header>

      <main className="flex min-h-0 flex-1 flex-col px-[clamp(24px,6vw,48px)] pb-[clamp(24px,3.203125svh,41px)] pt-[clamp(128px,20svh,256px)]">
        <section aria-labelledby="age-selection-title">
          <h1
            id="age-selection-title"
            className="text-center text-[clamp(40px,8vw,64px)] font-extrabold leading-none"
          >
            나이를 선택해주세요
          </h1>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {AGE_OPTIONS.map((option) => {
              const selected = value === option.id

              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onChange(option.id)}
                  className={`h-[clamp(112px,19.5vw,156px)] min-w-0 rounded-[clamp(18px,3vw,24px)] border-2 px-4 text-[clamp(28px,5vw,40px)] font-bold leading-[1.05] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-600 focus-visible:ring-offset-4 focus-visible:ring-offset-[#FAF8F2] ${
                    selected
                      ? 'border-primary-600 bg-primary-100'
                      : 'border-primary-100 bg-white'
                  }`}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </section>

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
