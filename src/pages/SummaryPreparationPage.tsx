import { useEffect, useRef } from 'react'
import processingIcon from '../assets/icons/final-flow/s1-processing.svg'
import { FinalFlowHeader } from '../components/final-flow/FinalFlowHeader'

export type SummaryPreparationStatus = 'loading' | 'failure'

interface SummaryPreparationPageProps {
  status: SummaryPreparationStatus
  onRetry: () => void
  onHelp: () => void
}

export function SummaryPreparationPage({
  status,
  onRetry,
  onHelp,
}: SummaryPreparationPageProps) {
  const retryButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (status === 'failure') {
      retryButtonRef.current?.focus()
    }
  }, [status])

  return (
    <div
      className="v6-entry-page relative min-h-[max(100svh,1280px)] overflow-x-hidden rounded-[clamp(20px,3.75vw,30px)] bg-[linear-gradient(102.244deg,#FFFDF9_0%,#EDF4F0_103.09%)] text-[#171C1A] shadow-[0_8px_24px_rgba(37,50,45,0.13)]"
      aria-live="polite"
      aria-busy={status === 'loading'}
    >
      <div className="relative mx-auto min-h-[max(100svh,1280px)] w-full max-w-[800px]">
        <FinalFlowHeader onHelp={onHelp} />

        <div
          aria-hidden="true"
          className="absolute left-1/2 top-[278px] size-[min(58vw,464px)] -translate-x-1/2 rounded-full bg-[rgba(220,234,228,0.75)] blur-[32.5px]"
        />
        <div className="absolute left-1/2 top-[370px] flex size-[clamp(210px,33.5vw,268px)] -translate-x-1/2 items-center justify-center overflow-hidden rounded-full bg-[rgba(255,255,255,0.78)] shadow-[0_8px_24px_rgba(37,50,45,0.13)] backdrop-blur-[9px]">
          <img
            src={processingIcon}
            alt=""
            aria-hidden="true"
            className="size-[clamp(118px,18.75vw,150px)]"
          />
        </div>

        <h1 className="absolute left-[clamp(20px,8.75vw,70px)] right-[clamp(20px,8.75vw,70px)] top-[704px] text-center text-[clamp(32px,5.5vw,44px)] font-bold leading-[normal]">
          답변을 정리하고 있어요
        </h1>
        <p className="absolute left-[clamp(28px,11.75vw,94px)] right-[clamp(28px,11.75vw,94px)] top-[778px] text-center text-[clamp(19px,3.125vw,25px)] font-bold leading-[normal] text-[#61716B]">
          직접 답한 사실과 상담에서 확인할 점을
          <br />
          짧게 정리하고 있습니다.
        </p>

        <div className="absolute left-[clamp(28px,12.5vw,100px)] right-[clamp(28px,12.5vw,100px)] top-[932px] h-[18px] overflow-hidden rounded-full bg-[#DCE3DF]">
          <div className="h-full w-[65%] animate-pulse rounded-full bg-[#5D776F] motion-reduce:animate-none" />
        </div>

        <aside className="absolute left-[clamp(24px,8.75vw,70px)] right-[clamp(24px,8.75vw,70px)] top-[1004px] h-[116px] overflow-hidden rounded-[18px] border-[1.5px] border-[#CED8D3] bg-[rgba(255,255,255,0.78)] text-center shadow-[0_8px_24px_rgba(37,50,45,0.13)] backdrop-blur-[9px]">
          <p className="absolute inset-x-3 top-[20px] text-[clamp(17px,2.625vw,21px)] font-bold leading-[normal] text-[#38564E]">
            연결이 불안정해도 입력 내용은 사라지지 않아요.
          </p>
          <p className="absolute inset-x-3 top-[59px] text-[clamp(16px,2.375vw,19px)] font-bold leading-[normal] text-[#61716B]">
            AI 없이도 기본 메모로 계속할 수 있어요.
          </p>
        </aside>

        {status === 'failure' && (
          <div
            className="absolute inset-0 z-40 rounded-[clamp(20px,3.75vw,30px)] bg-[rgba(25,33,30,0.48)]"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="summary-failure-title"
            aria-describedby="summary-failure-description"
            onKeyDown={(event) => {
              if (event.key === 'Tab') {
                event.preventDefault()
                retryButtonRef.current?.focus()
              }
            }}
          >
            <div className="absolute left-[clamp(18px,7.75vw,62px)] right-[clamp(18px,7.75vw,62px)] top-[360px] h-[520px] overflow-hidden rounded-[30px] bg-[rgba(255,255,255,0.94)] shadow-[0_8px_24px_rgba(37,50,45,0.14)] backdrop-blur-[9px]">
              <div className="absolute left-1/2 top-[38px] flex size-[116px] -translate-x-1/2 items-center justify-center rounded-full bg-[#F8EDD6] text-[54px] font-bold text-[#BF8A3C]">
                !
              </div>
              <h2
                id="summary-failure-title"
                className="absolute inset-x-[20px] top-[180px] text-center text-[clamp(29px,4.75vw,38px)] font-bold leading-[normal]"
              >
                연결이 원활하지 않아요
              </h2>
              <p
                id="summary-failure-description"
                className="absolute inset-x-[clamp(24px,6.5vw,52px)] top-[242px] text-center text-[clamp(18px,2.75vw,22px)] font-bold leading-[normal] text-[#61716B]"
              >
                입력한 내용은 그대로 남아 있습니다.
                <br />
                AI 없이 기본 상담 메모로 계속할 수 있어요.
              </p>
              <button
                ref={retryButtonRef}
                type="button"
                onClick={onRetry}
                className="absolute bottom-[26px] left-[34px] right-[34px] h-[84px] rounded-[20px] bg-[linear-gradient(90deg,#486D92_0%,#71B48F_100%)] text-[clamp(23px,3.375vw,27px)] font-bold text-white shadow-[0_8px_12px_rgba(37,50,45,0.14)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#486D92]"
              >
                다시 시도
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
