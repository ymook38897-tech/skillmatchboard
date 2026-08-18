import beautyIcon from '../assets/icons/job-interests-final/beauty.svg'
import careIcon from '../assets/icons/job-interests-final/care.svg'
import cookingIcon from '../assets/icons/job-interests-final/cooking.svg'
import drivingIcon from '../assets/icons/job-interests-final/driving.svg'
import nextIcon from '../assets/icons/job-interests-final/next.svg'
import noneIcon from '../assets/icons/job-interests-final/none.svg'
import officeIcon from '../assets/icons/job-interests-final/office.svg'
import otherIcon from '../assets/icons/job-interests-final/other.svg'
import previousIcon from '../assets/icons/job-interests-final/previous.svg'
import safetyIcon from '../assets/icons/job-interests-final/safety.svg'
import staffHeadsetIcon from '../assets/icons/job-interests-final/staff-headset.svg'
import technicalIcon from '../assets/icons/job-interests-final/technical.svg'
import { Button } from '../components/common/Button'

interface JobCategoryPageProps {
  selectedJobCategories: string[]
  jobCategoryUnknown: boolean
  onJobCategoryToggle: (category: string) => void
  onJobCategoryUnknown: (unknown: boolean) => void
  onNext: () => void
  onPrev: () => void
  onHelp: () => void
}

export type JobInterestOption = {
  id: string
  label: string
  icon: string
}

export const JOB_INTEREST_OPTIONS: readonly JobInterestOption[] = [
  { id: 'driving-transport', label: '운전·운송', icon: drivingIcon },
  { id: 'cooking-food', label: '조리·음식', icon: cookingIcon },
  { id: 'facility-safety', label: '시설·안전', icon: safetyIcon },
  { id: 'office-accounting', label: '사무·회계', icon: officeIcon },
  { id: 'care-welfare', label: '돌봄·복지', icon: careIcon },
  { id: 'technical-skills', label: '기술·기능', icon: technicalIcon },
  { id: 'beauty-service', label: '미용·서비스', icon: beautyIcon },
  { id: 'other', label: '기타', icon: otherIcon },
]

const MAX_JOB_INTERESTS = 3

export function JobCategoryPage({
  selectedJobCategories,
  jobCategoryUnknown,
  onJobCategoryToggle,
  onJobCategoryUnknown,
  onNext,
  onPrev,
  onHelp,
}: JobCategoryPageProps) {
  const selectionLimitReached =
    !jobCategoryUnknown &&
    selectedJobCategories.length >= MAX_JOB_INTERESTS

  return (
    <div className="v6-entry-page relative min-h-[max(100svh,1460px)] overflow-x-hidden rounded-[clamp(20px,3.75vw,30px)] bg-[linear-gradient(102.244deg,#FFFDF9_0%,#EDF4F0_103.09%)] text-[#171C1A] shadow-[0_8px_24px_rgba(37,50,45,0.13)] sm:min-h-[max(100svh,1280px)]">
      <div className="relative mx-auto min-h-[max(100svh,1460px)] w-full max-w-[800px] sm:min-h-[max(100svh,1280px)]">
        <header className="absolute inset-x-0 top-0 z-20 h-[clamp(96px,14.5vw,116px)] bg-[rgba(255,255,255,0.72)] shadow-[0_8px_24px_rgba(37,50,45,0.13)] backdrop-blur-[9px]">
          <div className="absolute left-[clamp(16px,4.75vw,38px)] top-[clamp(14px,2.25vw,18px)] h-[clamp(68px,9.75vw,78px)] w-[clamp(144px,45vw,360px)]">
            <p className="h-[clamp(26px,4.25vw,34px)] whitespace-pre-wrap text-[clamp(17px,2.75vw,22px)] font-bold leading-[normal] text-[#5E8C7A]">
              기본 정보  4 / 5
            </p>
            <div className="absolute inset-x-0 top-[clamp(43px,6.375vw,51px)] h-[clamp(8px,1.25vw,10px)] overflow-hidden rounded-full bg-[#D9E3E0]">
              <div className="h-full w-4/5 rounded-full bg-[#5E8C7A]" />
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
          <h1 className="absolute left-[clamp(16px,4.75vw,38px)] right-[clamp(16px,4.75vw,38px)] top-[clamp(132px,18.75vw,150px)] text-[clamp(31px,5.25vw,42px)] font-extrabold leading-[normal]">
            하고 싶은 분야가 있나요?
          </h1>
          <p className="absolute left-[clamp(16px,4.75vw,38px)] right-[clamp(16px,4.75vw,38px)] top-[clamp(195px,26.25vw,210px)] text-[clamp(18px,3vw,24px)] font-bold leading-[normal] text-[#61716B]">
            최대 3개까지 고를 수 있어요.
          </p>

          <section
            aria-label="희망 분야 선택"
            className="absolute left-[clamp(14px,6.25vw,50px)] right-[clamp(14px,6.25vw,50px)] top-[clamp(270px,35.25vw,282px)] grid grid-cols-2 gap-x-[clamp(12px,2.5vw,20px)] gap-y-[14px] sm:grid-cols-3"
          >
            <button
              type="button"
              aria-pressed={jobCategoryUnknown}
              onClick={() => onJobCategoryUnknown(!jobCategoryUnknown)}
              className={`relative h-[clamp(144px,20.75vw,166px)] min-w-0 rounded-[clamp(16px,2.25vw,18px)] border-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#B14F3E] focus-visible:ring-offset-3 focus-visible:ring-offset-[#FFFDF9] ${
                jobCategoryUnknown
                  ? 'border-[#B14F3E] bg-[#FCEDE9] shadow-[0_0_0_3px_rgba(177,79,62,0.12)]'
                  : 'border-[#C9D6D1] bg-[#FDFCF9]'
              }`}
            >
              <span className="absolute inset-x-2 top-[clamp(10px,1.75vw,14px)] flex h-[clamp(38px,5.75vw,46px)] items-center justify-center text-[clamp(25px,4vw,32px)] font-bold leading-[normal] text-[#B14F3E]">
                없음
              </span>
              <img
                src={noneIcon}
                alt=""
                aria-hidden="true"
                className="absolute left-1/2 top-[clamp(72px,11vw,88px)] size-[clamp(48px,7.5vw,60px)] -translate-x-1/2"
              />
            </button>

            {JOB_INTEREST_OPTIONS.map((option) => {
              const selected = selectedJobCategories.includes(option.id)
              const disabled = selectionLimitReached && !selected

              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={selected}
                  disabled={disabled}
                  onClick={() => onJobCategoryToggle(option.id)}
                  className={`relative h-[clamp(144px,20.75vw,166px)] min-w-0 rounded-[clamp(16px,2.25vw,18px)] border-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#5E7E72] focus-visible:ring-offset-3 focus-visible:ring-offset-[#FFFDF9] disabled:cursor-not-allowed disabled:opacity-45 ${
                    selected
                      ? 'border-[#597A70] bg-[#DCEAE4] shadow-[0_0_0_3px_rgba(89,122,112,0.12)]'
                      : 'border-[#C9D6D1] bg-[#FDFCF9]'
                  }`}
                >
                  <span className="absolute inset-x-2 top-[clamp(10px,1.75vw,14px)] flex h-[clamp(38px,5.75vw,46px)] items-center justify-center whitespace-nowrap text-[clamp(22px,4vw,32px)] font-bold leading-[normal]">
                    {option.label}
                  </span>
                  <img
                    src={option.icon}
                    alt=""
                    aria-hidden="true"
                    className="absolute left-1/2 top-[clamp(72px,11vw,88px)] size-[clamp(48px,7.5vw,60px)] -translate-x-1/2 object-contain"
                  />
                </button>
              )
            })}
          </section>

          <p className="sr-only" role="status" aria-live="polite">
            {selectionLimitReached
              ? '희망 분야는 최대 3개까지 선택할 수 있습니다.'
              : `희망 분야 ${selectedJobCategories.length}개 선택`}
          </p>
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
            disabled={!jobCategoryUnknown && selectedJobCategories.length === 0}
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
