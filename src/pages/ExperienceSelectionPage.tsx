import noneIcon from '../assets/icons/experiences/none.svg'
import nextIcon from '../assets/icons/p1/next.svg'
import previousIcon from '../assets/icons/p1/previous.svg'
import staffHeadsetIcon from '../assets/icons/p1/staff-headset.svg'
import { Button } from '../components/common/Button'
import { EXPERIENCE_CATEGORIES } from '../data/experienceOptions'
import type { ExperienceCategoryId } from '../types/flow'

interface ExperienceSelectionPageProps {
  selectedIds: readonly ExperienceCategoryId[]
  noneSelected: boolean
  onToggle: (categoryId: ExperienceCategoryId) => void
  onNone: () => void
  onPrev: () => void
  onNext: () => void
  onHelp: () => void
}

export function ExperienceSelectionPage({
  selectedIds,
  noneSelected,
  onToggle,
  onNone,
  onPrev,
  onNext,
  onHelp,
}: ExperienceSelectionPageProps) {
  return (
    <div className="v6-entry-page relative min-h-[max(100svh,800px)] overflow-x-hidden rounded-[clamp(20px,3.75vw,30px)] bg-[linear-gradient(102.244deg,#FFFDF9_0%,#EDF4F0_103.09%)] text-[#171C1A] shadow-[0_8px_24px_rgba(37,50,45,0.13)]">
      <div className="relative mx-auto min-h-[max(100svh,800px)] w-full max-w-[800px]">
        <header className="absolute inset-x-0 top-0 z-20 h-[clamp(96px,14.5vw,116px)] bg-[rgba(255,255,255,0.72)] shadow-[0_8px_24px_rgba(37,50,45,0.13)] backdrop-blur-[9px]">
          <div className="absolute left-[clamp(16px,4.75vw,38px)] top-[clamp(14px,2.25vw,18px)] h-[clamp(68px,9.75vw,78px)] w-[clamp(144px,45vw,360px)]">
            <p className="h-[clamp(26px,4.25vw,34px)] whitespace-pre-wrap text-[clamp(17px,2.75vw,22px)] font-bold leading-[normal] text-[#5E8C7A]">
              기본 정보  1 / 5
            </p>
            <div className="absolute inset-x-0 top-[clamp(43px,6.375vw,51px)] h-[clamp(8px,1.25vw,10px)] overflow-hidden rounded-full bg-[#D9E3E0]">
              <div className="h-full w-1/5 rounded-full bg-[#5E8C7A]" />
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
          <h1 className="absolute left-[clamp(16px,5.25vw,42px)] right-[clamp(16px,5.25vw,42px)] top-[clamp(132px,18.75vw,150px)] text-[clamp(30px,5.25vw,42px)] font-bold leading-[normal]">
            해본 일을 골라주세요
          </h1>
          <p className="absolute left-[clamp(16px,5.25vw,42px)] right-[clamp(16px,5.25vw,42px)] top-[clamp(184px,26.25vw,210px)] text-[clamp(19px,3.125vw,25px)] font-bold leading-[normal] text-[#61716B]">
            여러 개 골라도 괜찮아요.
          </p>

          <section
            aria-label="해본 일 선택"
            className="absolute left-[clamp(16px,6.25vw,50px)] right-[clamp(16px,6.25vw,50px)] top-[clamp(242px,34.5vw,276px)] grid grid-cols-3 gap-x-[clamp(8px,2.5vw,20px)] gap-y-[clamp(12px,2vw,16px)]"
          >
            <button
              type="button"
              aria-pressed={noneSelected}
              onClick={onNone}
              className={`flex h-[clamp(130px,20.75vw,166px)] min-w-0 flex-col items-center gap-[clamp(14px,3.5vw,28px)] overflow-hidden rounded-[clamp(15px,2.25vw,18px)] border-2 px-[clamp(4px,1vw,8px)] pb-[clamp(12px,2.25vw,18px)] pt-[clamp(10px,1.75vw,14px)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#B14F3E] focus-visible:ring-offset-4 focus-visible:ring-offset-[#FFFDF9] ${
                noneSelected
                  ? 'border-[#B14F3E] bg-[#FCEDE9]'
                  : 'border-[#C9D6D1] bg-[#FDFCF9]'
              }`}
            >
              <span className="flex h-[clamp(34px,5.75vw,46px)] w-full items-center justify-center text-[clamp(18px,4vw,32px)] font-bold leading-[normal] text-[#B14F3E]">
                없음
              </span>
              <span className="flex size-[clamp(44px,7.5vw,60px)] items-center justify-center overflow-hidden">
                <img
                  src={noneIcon}
                  alt=""
                  aria-hidden="true"
                  className="h-[65.625%] w-[65.625%]"
                />
              </span>
            </button>

            {EXPERIENCE_CATEGORIES.map((category) => {
              const selected = selectedIds.includes(category.id)

              return (
                <button
                  key={category.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onToggle(category.id)}
                  className={`flex h-[clamp(130px,20.75vw,166px)] min-w-0 flex-col items-center gap-[clamp(14px,3.5vw,28px)] overflow-hidden rounded-[clamp(15px,2.25vw,18px)] border-2 px-[clamp(4px,1vw,8px)] pb-[clamp(12px,2.25vw,18px)] pt-[clamp(10px,1.75vw,14px)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#597A70] focus-visible:ring-offset-4 focus-visible:ring-offset-[#FFFDF9] ${
                    selected
                      ? 'border-[#597A70] bg-[#DCEAE4] text-[#597A70]'
                      : 'border-[#C9D6D1] bg-[#FDFCF9] text-[#141414]'
                  } ${noneSelected ? 'opacity-[0.28]' : ''}`}
                >
                  <span className="flex h-[clamp(34px,5.75vw,46px)] w-full items-center justify-center whitespace-nowrap text-[clamp(16px,4vw,32px)] font-bold leading-[normal]">
                    {category.label}
                  </span>
                  <span className="flex size-[clamp(44px,7.5vw,60px)] items-center justify-center overflow-hidden">
                    <img
                      src={category.icon}
                      alt=""
                      aria-hidden="true"
                      style={{
                        width: `${(category.iconWidth / 60) * 100}%`,
                        height: `${(category.iconHeight / 60) * 100}%`,
                      }}
                    />
                  </span>
                </button>
              )
            })}
          </section>
        </main>
      </div>

      <footer className="fixed inset-x-0 bottom-0 z-30 h-[clamp(108px,15.5vw,124px)] bg-[rgba(255,255,255,0.78)] px-[clamp(16px,3vw,24px)] py-[clamp(14px,2.75vw,22px)] shadow-[0_-5px_18px_rgba(37,50,45,0.10)] backdrop-blur-[9px]">
        <div className="mx-auto grid h-full w-full max-w-[752px] grid-cols-[minmax(0,0.759615fr)_minmax(0,1fr)] gap-[clamp(12px,2.5vw,20px)]">
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
            disabled={!noneSelected && selectedIds.length === 0}
            className="!h-full !min-h-0 !rounded-[clamp(16px,2.25vw,18px)] !border-0 !bg-[linear-gradient(90deg,#486D92_0%,#71B48F_100%)] !px-0 !py-0 !text-[clamp(23px,3.375vw,27px)] !font-bold !leading-[normal] !shadow-[0_8px_12px_rgba(37,50,45,0.14)] disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  )
}
