interface TutorialPageProps {
  onNext: () => void
  onPrev: () => void
  onHelp: () => void
}

function MicrophoneIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 64"
      className={className}
      fill="none"
    >
      <rect x="23" y="10" width="18" height="31" rx="9" fill="currentColor" />
      <path
        d="M15.5 31.5C15.5 40.6 22.9 48 32 48s16.5-7.4 16.5-16.5M32 48v8m-9 0h18"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function TutorialPage({
  onNext,
  onPrev,
}: TutorialPageProps) {
  return (
    <div className="voice-flow-page min-h-[100svh] bg-[#EEF1F4]">
      <main className="mx-auto flex min-h-[100svh] w-full max-w-[800px] flex-col items-center overflow-hidden bg-white px-[clamp(24px,10vw,80px)] pb-[clamp(30px,5svh,64px)] pt-[clamp(64px,8.5svh,108px)] text-center sm:rounded-[24px]">
        <h1 className="text-[clamp(36px,6vw,48px)] font-extrabold leading-[1.2] tracking-[-0.035em] text-[#111827]">
          버튼 설명
        </h1>
        <p className="mt-4 text-[clamp(17px,2.5vw,20px)] font-medium text-[#6B7280]">
          이것만 기억해 주세요.
        </p>

        <div className="mt-[clamp(62px,8svh,102px)] flex flex-col items-center">
          <div className="flex size-[clamp(148px,27vw,216px)] items-center justify-center rounded-full border-[3px] border-[#8EB4FF] bg-white">
            <MicrophoneIcon className="size-[clamp(58px,10vw,80px)] text-[#2468F2]" />
          </div>
          <p className="mt-[clamp(24px,3svh,38px)] text-[clamp(24px,4vw,32px)] font-extrabold text-[#2468F2]">
            말하기
          </p>
        </div>

        <section className="mt-[clamp(64px,8svh,102px)] w-full rounded-[10px] border-2 border-[#8EB4FF] bg-white p-[clamp(22px,4vw,32px)] text-left">
          <h2 className="text-[clamp(20px,3.25vw,26px)] font-extrabold text-[#111827]">
            마이크 버튼
          </h2>
          <p className="mt-3 text-[clamp(16px,2.5vw,20px)] font-medium leading-[1.55] text-[#4B5563]">
            누르면 음성인식이 시작돼요.
          </p>

          <div className="mt-7 flex items-center gap-3 border-t border-[#E5E7EB] pt-5">
            <button
              type="button"
              onClick={onPrev}
              className="min-h-14 flex-1 rounded-[8px] border-2 border-[#A7C3FF] bg-white px-4 text-[clamp(17px,2.5vw,20px)] font-bold text-[#2468F2] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#BFDBFE]"
            >
              이전
            </button>
            <button
              type="button"
              onClick={onNext}
              className="min-h-14 flex-1 rounded-[8px] bg-[#2468F2] px-4 text-[clamp(17px,2.5vw,20px)] font-bold text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#93B4FF]"
            >
              다음
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}
