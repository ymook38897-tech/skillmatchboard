import type { VoiceJob, VoiceInterviewAnswers } from '../types/flow'

import { useEffect, useRef, useState } from 'react'

const WARNING_DELAY_MS = 60_000
const AUTO_EXIT_DELAY_MS = 120_000

interface ResumeGenerationPageProps {
  answers: VoiceInterviewAnswers
  selectedJobs: VoiceJob[]
  onPrev: () => void
  onComplete: () => void
}

export function ResumeGenerationPage({
  answers,
  selectedJobs,
  onComplete,
}: ResumeGenerationPageProps) {
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false)
  const onCompleteRef = useRef(onComplete)
  const continueButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    const warningTimer = window.setTimeout(() => {
      setShowTimeoutWarning(true)
    }, WARNING_DELAY_MS)
    const exitTimer = window.setTimeout(() => {
      onCompleteRef.current()
    }, AUTO_EXIT_DELAY_MS)

    return () => {
      window.clearTimeout(warningTimer)
      window.clearTimeout(exitTimer)
    }
  }, [])

  useEffect(() => {
    if (showTimeoutWarning) {
      continueButtonRef.current?.focus()
    }
  }, [showTimeoutWarning])

  return (
    <div className="voice-flow-page min-h-[100svh] bg-[#EEF1F4]">
      <main className="mx-auto w-full max-w-[800px] bg-white sm:rounded-[24px]">
        <div className="min-h-[100svh] px-[clamp(24px,8vw,64px)] pb-12 pt-[clamp(88px,11.7svh,150px)]">
          <header className="text-center">
            <h1 className="whitespace-pre-line text-[clamp(32px,5vw,40px)] font-extrabold leading-[1.3] tracking-[-0.035em] text-[#111827]">
              {'구직신청서에\n희망직종을 적어 주세요'}
            </h1>
          </header>

          <section className="relative mx-auto mt-[clamp(68px,8.6svh,110px)] min-h-[780px] max-w-[570px] border border-[#9CA3AF] bg-[#FCFCFC] px-[clamp(14px,2.5vw,20px)] py-5 text-[#4B5563] shadow-[0_2px_8px_rgba(15,23,42,0.08)]">
            <div className="border-b-2 border-[#6B7280] pb-3 text-center">
              <h2 className="text-[clamp(18px,2.5vw,20px)] font-extrabold tracking-[0.18em] text-[#374151]">
                구 직 신 청 서
              </h2>
            </div>

            <div className="mt-3 grid grid-cols-[88px_1fr_76px_1fr] border-l border-t border-[#AEB4BE] text-[clamp(10px,1.5vw,12px)] leading-[1.45]">
              <div className="border-b border-r border-[#AEB4BE] bg-[#F0F1F3] px-2 py-3 font-bold">
                성명
              </div>
              <div className="border-b border-r border-[#AEB4BE] px-2 py-3" />
              <div className="border-b border-r border-[#AEB4BE] bg-[#F0F1F3] px-2 py-3 font-bold">
                연락처
              </div>
              <div className="border-b border-r border-[#AEB4BE] px-2 py-3" />

              <div className="border-b border-r border-[#AEB4BE] bg-[#F0F1F3] px-2 py-3 font-bold">
                주소
              </div>
              <div className="col-span-3 border-b border-r border-[#AEB4BE] px-3 py-3" />

              <div className="border-b border-r border-[#AEB4BE] bg-[#F0F1F3] px-2 py-3 font-bold">
                희망 직종
              </div>
              <div className="col-span-3 border-b border-r border-[#AEB4BE] p-2">
                <div className="rounded-[4px] border-2 border-[#7EAEFF] bg-[rgba(221,235,255,0.78)] px-3 py-2 text-[clamp(11px,1.65vw,13px)] font-extrabold leading-[1.65] text-[#1F4FA8]">
                  {selectedJobs.map((job, index) => (
                    <p key={job.id}>
                      {index + 1}. {job.name}
                    </p>
                  ))}
                </div>
              </div>

              <div className="border-b border-r border-[#AEB4BE] bg-[#F0F1F3] px-2 py-3 font-bold">
                해본 일
              </div>
              <div className="col-span-3 border-b border-r border-[#AEB4BE] px-3 py-3">
                {answers.experience}
              </div>

              <div className="border-b border-r border-[#AEB4BE] bg-[#F0F1F3] px-2 py-3 font-bold">
                업무 조건
              </div>
              <div className="col-span-3 border-b border-r border-[#AEB4BE] px-3 py-3">
                {answers.difficulty}
              </div>

              <div className="border-b border-r border-[#AEB4BE] bg-[#F0F1F3] px-2 py-3 font-bold">
                희망 내용
              </div>
              <div className="col-span-3 border-b border-r border-[#AEB4BE] px-3 py-3">
                {answers.interest}
              </div>

              <div className="border-b border-r border-[#AEB4BE] bg-[#F0F1F3] px-2 py-3 font-bold">
                자신 있는 일
              </div>
              <div className="col-span-3 border-b border-r border-[#AEB4BE] px-3 py-3">
                {answers.strength}
              </div>

              <div className="border-b border-r border-[#AEB4BE] bg-[#F0F1F3] px-2 py-3 font-bold">
                자격증
              </div>
              <div className="col-span-3 border-b border-r border-[#AEB4BE] px-3 py-3">
                {answers.certificate}
              </div>

              <div className="border-b border-r border-[#AEB4BE] bg-[#F0F1F3] px-2 py-4 font-bold">
                학력 사항
              </div>
              <div className="col-span-3 border-b border-r border-[#AEB4BE] px-3 py-4" />

              <div className="border-b border-r border-[#AEB4BE] bg-[#F0F1F3] px-2 py-4 font-bold">
                경력 사항
              </div>
              <div className="col-span-3 border-b border-r border-[#AEB4BE] px-3 py-4" />

              <div className="border-b border-r border-[#AEB4BE] bg-[#F0F1F3] px-2 py-4 font-bold">
                교육·훈련
              </div>
              <div className="col-span-3 border-b border-r border-[#AEB4BE] px-3 py-4" />

              <div className="border-b border-r border-[#AEB4BE] bg-[#F0F1F3] px-2 py-4 font-bold">
                전산 능력
              </div>
              <div className="col-span-3 border-b border-r border-[#AEB4BE] px-3 py-4" />
            </div>

            <div className="mt-4 space-y-2 text-[clamp(9px,1.35vw,11px)] leading-[1.5] text-[#6B7280]">
              <p>위와 같이 구직 상담을 신청합니다.</p>
              <p className="text-right">신청인: __________________</p>
            </div>
          </section>

          <p className="mt-[clamp(28px,3.5svh,44px)] text-center text-[clamp(15px,2.25vw,18px)] font-medium text-[#6B7280]">
            2분 동안 화면에 표시됩니다
          </p>

          <button
            type="button"
            onClick={onComplete}
            className="mx-auto mt-[clamp(24px,3svh,38px)] block h-[clamp(68px,7.5svh,96px)] w-full max-w-[570px] rounded-[8px] bg-[#2468F2] text-[clamp(22px,3.5vw,28px)] font-extrabold text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#93B4FF]"
          >
            처음으로 돌아가기
          </button>
        </div>

      </main>

      {showTimeoutWarning && (
        <div
          className="fixed inset-0 z-50 bg-[rgba(15,23,42,0.36)]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="resume-timeout-title"
          aria-describedby="resume-timeout-description"
        >
          <section className="voice-flow-page absolute inset-x-0 bottom-0 mx-auto min-h-[clamp(330px,33.5svh,430px)] w-full max-w-[800px] bg-white px-[clamp(24px,8vw,64px)] pb-[clamp(36px,6svh,76px)] pt-[clamp(42px,5svh,64px)] text-center sm:rounded-b-[24px]">
            <h2
              id="resume-timeout-title"
              className="text-[clamp(32px,5vw,40px)] font-extrabold leading-[1.3] tracking-[-0.035em] text-[#111827]"
            >
              1분 뒤 화면이 꺼집니다
            </h2>
            <p
              id="resume-timeout-description"
              className="mt-[clamp(22px,2.8svh,36px)] text-[clamp(19px,3.25vw,26px)] font-medium leading-[1.5] text-[#526077]"
            >
              신청서를 계속 보려면 아래 버튼을 눌러주세요
            </p>
            <button
              ref={continueButtonRef}
              type="button"
              onClick={() => setShowTimeoutWarning(false)}
              className="mt-[clamp(26px,3.2svh,42px)] h-[clamp(72px,7.8svh,100px)] w-full rounded-[8px] bg-[#2468F2] text-[clamp(24px,4vw,32px)] font-extrabold text-white focus:outline-none"
            >
              계속 보기
            </button>
          </section>
        </div>
      )}
    </div>
  )
}
