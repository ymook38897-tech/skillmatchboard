import completeIcon from '../assets/icons/final-flow/p4-complete.svg'
import homeIcon from '../assets/icons/final-flow/p4-home.svg'
import { FinalFlowHeader } from '../components/final-flow/FinalFlowHeader'
import type { Recommendation } from '../types/flow'

interface CounselorResultPageProps {
  recommendations: Recommendation[]
  counselorMemo: readonly string[]
  onRestart: () => void
  onHelp: () => void
}

const CANDIDATE_LABELS = ['A', 'B', 'C'] as const

export function CounselorResultPage({
  recommendations,
  counselorMemo,
  onRestart,
  onHelp,
}: CounselorResultPageProps) {
  const candidates = recommendations.slice(0, 3)
  const hasCandidates = candidates.length > 0

  return (
    <div className="v6-entry-page relative min-h-[max(100svh,1540px)] overflow-x-hidden rounded-[clamp(20px,3.75vw,30px)] bg-[linear-gradient(102.244deg,#FFFDF9_0%,#EDF4F0_103.09%)] text-[#171C1A] shadow-[0_8px_24px_rgba(37,50,45,0.13)] sm:min-h-[max(100svh,1280px)]">
      <div className="relative mx-auto min-h-[max(100svh,1540px)] w-full max-w-[800px] sm:min-h-[max(100svh,1280px)]">
        <FinalFlowHeader onHelp={onHelp} />

        <div className="absolute left-1/2 top-[170px] flex size-[136px] -translate-x-1/2 items-center justify-center overflow-hidden rounded-full bg-[rgba(93,119,111,0.86)] shadow-[0_8px_24px_rgba(37,50,45,0.13)]">
          <img
            src={completeIcon}
            alt=""
            aria-hidden="true"
            className="size-[88px]"
          />
        </div>
        <h1 className="absolute left-[clamp(16px,6.25vw,50px)] right-[clamp(16px,6.25vw,50px)] top-[326px] whitespace-nowrap text-center text-[clamp(28px,5.5vw,44px)] font-bold leading-[normal]">
          이 내용을 상담원에게 보여주세요
        </h1>

        <section
          aria-labelledby="counselor-memo-title"
          className="absolute left-[clamp(16px,4.25vw,34px)] right-[clamp(16px,4.25vw,34px)] top-[423px] h-[256px] overflow-hidden rounded-[22px] border-[1.5px] border-[#CED8D3] bg-[rgba(255,255,255,0.72)] shadow-[0_8px_24px_rgba(37,50,45,0.13)] backdrop-blur-[9px]"
        >
          <h2
            id="counselor-memo-title"
            className="absolute left-[24px] top-[18px] text-[clamp(22px,3.25vw,26px)] font-bold leading-[normal] text-[#38564E]"
          >
            상담 도움 메모
          </h2>
          <ul className="absolute inset-x-[24px] top-[70px] grid h-[180px] grid-rows-3">
            {counselorMemo.slice(0, 3).map((memo) => (
              <li key={memo} className="flex min-w-0 items-start gap-[14px]">
                <span
                  aria-hidden="true"
                  className="mt-[8px] flex size-[28px] shrink-0 items-center justify-center rounded-full bg-[#5D776F] text-[20px] font-bold text-white"
                >
                  ✓
                </span>
                <span className="line-clamp-2 min-w-0 text-[clamp(17px,3vw,24px)] font-bold leading-[1.25]">
                  {memo}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {hasCandidates ? (
          <section aria-labelledby="candidate-title">
            <h2
              id="candidate-title"
              className="absolute left-[clamp(18px,4.75vw,38px)] right-[18px] top-[744px] text-[clamp(26px,4vw,32px)] font-bold leading-[normal]"
            >
              상담에서 함께 확인해 볼 일
            </h2>
            <div className="absolute left-[clamp(16px,4.25vw,34px)] right-[clamp(16px,4.25vw,34px)] top-[796px] grid grid-cols-1 gap-[20px] sm:grid-cols-3">
              {candidates.map((candidate, index) => (
                <article
                  key={candidate.jobCode}
                  className="relative h-[220px] overflow-hidden rounded-[20px] border-[1.5px] border-[#CED8D3] bg-[rgba(255,255,255,0.84)] p-[16px] shadow-[0_8px_24px_rgba(37,50,45,0.13)] backdrop-blur-[9px] sm:h-[274px]"
                >
                  <span className="flex h-[40px] w-[54px] items-center justify-center rounded-[12px] bg-[#DCEAE4] text-[19px] font-bold text-[#38564E]">
                    {CANDIDATE_LABELS[index]}
                  </span>
                  <h3 className="mt-[10px] line-clamp-2 text-[clamp(20px,2.875vw,23px)] font-bold leading-[1.25]">
                    {candidate.displayName}
                  </h3>
                  <p className="mt-[10px] text-[16px] font-bold leading-[normal] text-[#38564E]">
                    왜 나왔나요?
                  </p>
                  <p className="mt-[8px] line-clamp-5 text-[clamp(15px,2.125vw,17px)] font-bold leading-[1.18] text-[#61716B]">
                    {candidate.reason}
                  </p>
                </article>
              ))}
            </div>
          </section>
        ) : (
          <section
            aria-labelledby="no-candidate-title"
            className="absolute left-[clamp(16px,4.25vw,34px)] right-[clamp(16px,4.25vw,34px)] top-[796px] h-[274px] overflow-hidden rounded-[22px] border-[1.5px] border-[#CED8D3] bg-[rgba(255,255,255,0.86)] shadow-[0_8px_24px_rgba(37,50,45,0.14)] backdrop-blur-[9px]"
          >
            <div className="absolute left-[clamp(18px,3.5vw,28px)] top-[28px] flex size-[74px] items-center justify-center rounded-full bg-[#DCEAE4] text-[34px] font-bold text-[#38564E]">
              ?
            </div>
            <h2
              id="no-candidate-title"
              className="absolute left-[clamp(104px,15.5vw,124px)] right-[24px] top-[24px] text-[clamp(20px,3.125vw,25px)] font-bold leading-[normal]"
            >
              지금 답만으로는 직무 후보를 좁히기 어려워요.
            </h2>
            <p className="absolute left-[clamp(104px,15.5vw,124px)] right-[24px] top-[74px] text-[clamp(16px,2.5vw,20px)] font-bold leading-[normal] text-[#61716B]">
              위 상담 메모는 그대로 사용할 수 있습니다.
              <br />
              상담 선생님이 해본 일과 근무 조건을 더 확인해 드려요.
            </p>
            <p className="absolute bottom-[28px] left-[24px] right-[24px] flex h-[72px] items-center justify-center rounded-[16px] bg-[#DCEAE4] px-[18px] text-center text-[clamp(18px,3vw,24px)] font-bold leading-[normal] text-[#38564E]">
              상담원 첫 질문: 가장 최근에 해본 작업부터 확인해 주세요.
            </p>
          </section>
        )}
      </div>

      <footer className="fixed bottom-0 left-1/2 z-30 h-[132px] w-full max-w-[800px] -translate-x-1/2 bg-[rgba(255,255,255,0.80)] px-[28px] py-[24px] shadow-[0_-5px_18px_rgba(37,50,45,0.10)] backdrop-blur-[9px]">
        <button
          type="button"
          onClick={onRestart}
          className="flex size-full items-center justify-center rounded-[20px] bg-[linear-gradient(90deg,#486D92_0%,#71B48F_100%)] text-[clamp(25px,4vw,32px)] font-extrabold text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#486D92] focus-visible:ring-offset-4"
        >
          <img
            src={homeIcon}
            alt=""
            aria-hidden="true"
            className="mr-[26px] size-[38px]"
          />
          처음으로 돌아가기
        </button>
      </footer>
    </div>
  )
}
