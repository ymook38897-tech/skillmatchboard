import barriersIcon from '../assets/icons/answer-review-final/barriers.svg'
import certificationsIcon from '../assets/icons/answer-review-final/certifications.svg'
import confirmIcon from '../assets/icons/answer-review-final/confirm.svg'
import experiencesIcon from '../assets/icons/answer-review-final/experiences.svg'
import jobInterestsIcon from '../assets/icons/answer-review-final/job-interests.svg'
import staffHeadsetIcon from '../assets/icons/answer-review-final/staff-headset.svg'
import workPreferencesIcon from '../assets/icons/answer-review-final/work-preferences.svg'

interface AnswerReviewPageProps {
  experienceSummary: string
  barrierSummary: string
  workPreferenceSummary: string
  jobInterestSummary: string
  certificationSummary: string
  onConfirm: () => void
  onHelp: () => void
}

const REVIEW_ROWS = [
  { key: 'experience', label: '해본 작업', icon: experiencesIcon },
  {
    key: 'barriers',
    label: '피하거나 확인할 조건',
    icon: barriersIcon,
  },
  {
    key: 'work-preferences',
    label: '원하는 근무 방식',
    icon: workPreferencesIcon,
  },
  {
    key: 'job-interests',
    label: '하고 싶은 분야',
    icon: jobInterestsIcon,
  },
  {
    key: 'certifications',
    label: '보유 자격증',
    icon: certificationsIcon,
  },
] as const

export function AnswerReviewPage({
  experienceSummary,
  barrierSummary,
  workPreferenceSummary,
  jobInterestSummary,
  certificationSummary,
  onConfirm,
  onHelp,
}: AnswerReviewPageProps) {
  const summaries = {
    experience: experienceSummary,
    barriers: barrierSummary,
    'work-preferences': workPreferenceSummary,
    'job-interests': jobInterestSummary,
    certifications: certificationSummary,
  }

  return (
    <div className="v6-entry-page relative min-h-[max(100svh,1280px)] overflow-x-hidden rounded-[clamp(20px,3.75vw,30px)] bg-[linear-gradient(102.244deg,#FFFDF9_0%,#EDF4F0_103.09%)] text-[#171C1A] shadow-[0_8px_24px_rgba(37,50,45,0.13)]">
      <div className="relative mx-auto min-h-[max(100svh,1280px)] w-full max-w-[800px]">
        <header className="absolute inset-x-0 top-0 z-20 h-[clamp(96px,14.5vw,116px)] bg-[rgba(255,255,255,0.72)] shadow-[0_8px_24px_rgba(37,50,45,0.13)] backdrop-blur-[9px]">
          <button
            type="button"
            onClick={onHelp}
            className="absolute right-[clamp(8px,3.5vw,28px)] top-[clamp(12px,2.5vw,20px)] z-10 flex h-[clamp(68px,9.5vw,76px)] w-[clamp(140px,28vw,224px)] items-center justify-center gap-[clamp(7px,1.5vw,12px)] rounded-[clamp(17px,2.375vw,19px)] border-[1.5px] border-[#5D776F] bg-[rgba(255,255,255,0.78)] text-[clamp(17px,3.125vw,25px)] font-bold leading-[normal] text-[#38564E] shadow-[0_8px_12px_rgba(37,50,45,0.14)] backdrop-blur-[9px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#5E7E72] focus-visible:ring-offset-4"
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
          <h1 className="absolute left-[clamp(18px,5vw,40px)] right-[clamp(18px,5vw,40px)] top-[clamp(136px,19vw,152px)] text-[clamp(29px,5vw,40px)] font-extrabold leading-[1.45]">
            내가 답한 내용을 확인해 주세요
          </h1>
          <p className="absolute left-[clamp(18px,5vw,40px)] right-[clamp(18px,5vw,40px)] top-[clamp(195px,26.5vw,212px)] text-[clamp(18px,2.875vw,23px)] font-bold leading-[normal] text-[#61716B]">
            틀린 내용이 있으면 지금 수정할 수 있어요.
          </p>

          <section
            aria-labelledby="review-summary-title"
            className="absolute left-[clamp(16px,5.75vw,46px)] right-[clamp(16px,5.75vw,46px)] top-[clamp(254px,34.5vw,276px)] h-[820px] rounded-[24px] border-[1.5px] border-[#CED8D3] bg-[rgba(255,255,255,0.78)] shadow-[0_8px_20px_rgba(37,50,45,0.11)] backdrop-blur-[9px]"
          >
            <h2
              id="review-summary-title"
              className="absolute left-[clamp(18px,3vw,24px)] top-[20px] text-[clamp(22px,3.375vw,27px)] font-bold leading-[normal] text-[#38564E]"
            >
              직접 선택한 내용
            </h2>

            <div className="absolute left-[clamp(12px,2.75vw,22px)] right-[clamp(12px,2.75vw,22px)] top-[84px] space-y-[18px]">
              {REVIEW_ROWS.map((row) => (
                <article
                  key={row.key}
                  className="relative h-[120px] rounded-[16px] border-[1.5px] border-[#CED8D3] bg-[rgba(255,255,255,0.85)]"
                >
                  <span className="absolute left-[clamp(14px,2.5vw,20px)] top-[28px] flex size-[64px] items-center justify-center">
                    <img
                      src={row.icon}
                      alt=""
                      aria-hidden="true"
                      className="max-h-[52px] max-w-[52px]"
                    />
                  </span>
                  <h3 className="absolute left-[clamp(86px,12.75vw,102px)] right-[16px] top-[18px] text-[clamp(19px,3.125vw,25px)] font-bold leading-[normal] text-[#61716B]">
                    {row.label}
                  </h3>
                  <p
                    title={summaries[row.key]}
                    className="absolute left-[clamp(86px,12.75vw,102px)] right-[16px] top-[58px] line-clamp-2 text-[clamp(17px,3vw,24px)] font-bold leading-[1.25] text-[#171C1A]"
                  >
                    {summaries[row.key]}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>

      <footer className="fixed bottom-0 left-1/2 z-30 h-[clamp(108px,15.5vw,124px)] w-full max-w-[800px] -translate-x-1/2 bg-[rgba(255,255,255,0.80)] px-[clamp(16px,3vw,24px)] py-[clamp(14px,2.75vw,22px)] shadow-[0_-5px_18px_rgba(37,50,45,0.10)] backdrop-blur-[9px]">
        <div className="h-full w-full">
          <button
            type="button"
            onClick={onConfirm}
            className="flex h-full w-full min-w-0 items-center justify-center rounded-[clamp(16px,2.25vw,18px)] border-0 bg-[linear-gradient(90deg,#486D92_0%,#71B48F_100%)] text-[clamp(20px,4vw,32px)] font-bold leading-[normal] text-white shadow-[0_8px_12px_rgba(37,50,45,0.14)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4D7A9E] focus-visible:ring-offset-3"
          >
            <img
              src={confirmIcon}
              alt=""
              aria-hidden="true"
              className="mr-[clamp(8px,1.5vw,12px)] size-[clamp(30px,4.5vw,36px)]"
            />
            <span className="whitespace-nowrap">맞아요 · 결과 보기</span>
          </button>
        </div>
      </footer>
    </div>
  )
}
