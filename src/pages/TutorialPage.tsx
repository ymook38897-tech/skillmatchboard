import { useState } from 'react'

interface TutorialPageProps {
  onComplete: () => void
  onPrev: () => void
}

interface TutorialStep {
  cardTitle: string
  cardDescription: string
  microphoneState: 'idle' | 'recording'
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    cardTitle: '마이크 버튼',
    cardDescription: '누르면 음성인식이 시작돼요.',
    microphoneState: 'idle',
  },
  {
    cardTitle: '녹음 중',
    cardDescription: '음성이 인식되고 있어요',
    microphoneState: 'recording',
  },
  {
    cardTitle: '녹음 카드',
    cardDescription: '이 카드에 녹음된 음성이 나타나요.',
    microphoneState: 'idle',
  },
]

const WAVEFORM_HEIGHTS = [19.2, 35.2, 49.6, 57.6, 43.2, 30.4, 52.8, 38.4, 20.8]

function MicrophoneIcon({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64" className={className} fill="none">
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

function TutorialVisual({ state }: { state: TutorialStep['microphoneState'] }) {
  const isRecording = state === 'recording'

  return (
    <div
      className={`flex h-[clamp(300px,31.25svh,400px)] w-full max-w-[440px] shrink-0 flex-col items-center justify-center rounded-[48px] ${
        isRecording ? 'bg-[#FFFBEF]' : 'bg-[#EFF6FF]'
      }`}
    >
      <div
        className={
          isRecording
            ? 'flex size-[clamp(156px,25vw,200px)] items-center justify-center rounded-full bg-[#2468F2] text-white shadow-[0_0_0_12px_#EFF6FF,0_0_0_24px_#F8FBFF]'
            : 'flex size-[clamp(156px,25vw,200px)] items-center justify-center rounded-full border-[3px] border-[#3B82F6] bg-white text-[#2468F2]'
        }
      >
        <MicrophoneIcon className="size-[clamp(50px,8vw,64px)]" />
      </div>

      {isRecording ? (
        <div aria-label="음성을 듣고 있어요" className="mt-14 flex h-[58px] items-center gap-[10px]">
          {WAVEFORM_HEIGHTS.map((height, index) => (
            <span
              key={`${height}-${index}`}
              className="w-[8px] rounded-full bg-[#2563EB]"
              style={{ height }}
            />
          ))}
        </div>
      ) : (
        <p className="mt-14 text-[clamp(24px,4.5vw,36px)] font-extrabold text-[#2563EB]">
          버튼을 눌러주세요
        </p>
      )}
    </div>
  )
}

export function TutorialPage({ onComplete, onPrev }: TutorialPageProps) {
  const [tutorialStep, setTutorialStep] = useState(0)
  const step = TUTORIAL_STEPS[tutorialStep]
  const isLastStep = tutorialStep === TUTORIAL_STEPS.length - 1

  const handlePrevious = () => {
    if (tutorialStep === 0) {
      onPrev()
      return
    }
    setTutorialStep((current) => current - 1)
  }

  const handleNext = () => {
    if (isLastStep) {
      onComplete()
      return
    }
    setTutorialStep((current) => current + 1)
  }

  const handleSkip = () => {
    onComplete()
  }

  return (
    <div className="voice-flow-page min-h-[100svh] bg-[#EEF1F4]">
      <main className="mx-auto flex min-h-[100svh] w-full max-w-[800px] flex-col overflow-hidden bg-white px-[clamp(24px,6vw,48px)] pb-[clamp(32px,4svh,52px)] pt-[clamp(64px,9.4svh,120px)] text-center sm:rounded-[24px]">
        <header className="shrink-0">
          <h1 className="text-[clamp(38px,6vw,48px)] font-extrabold leading-[1.25] tracking-[-0.035em] text-[#111827]">
            버튼 설명
          </h1>
          <p className="mt-2 text-[clamp(20px,3.25vw,26px)] font-medium text-[#526077]">
            이것만 기억해 주세요.
          </p>
        </header>

        {isLastStep ? (
          <div className="flex flex-1 flex-col items-center pt-[clamp(68px,8svh,102px)]">
            <div className="flex flex-col items-center">
              <div className="flex size-[clamp(156px,25vw,200px)] items-center justify-center rounded-full border-[3px] border-[#3B82F6] bg-white text-[#2468F2]">
                <MicrophoneIcon className="size-[clamp(50px,8vw,64px)]" />
              </div>
              <p className="mt-14 text-[clamp(24px,4.5vw,36px)] font-extrabold text-[#2468F2]">
                버튼을 눌러주세요
              </p>
            </div>

            <section
              aria-live="polite"
              className="mt-[clamp(76px,9svh,116px)] w-full max-w-[640px] rounded-[12px] border-2 border-[#3B82F6] bg-[#F3EFFF] px-[clamp(20px,3.75vw,30px)] py-[clamp(20px,2.7svh,34px)] text-left shadow-[0_0_0_18px_rgba(139,92,246,0.10)]"
            >
              <h2 className="text-[clamp(26px,4.5vw,36px)] font-extrabold leading-[1.35] text-[#111827]">
                {step.cardTitle}
              </h2>
              <p className="mt-2 text-[clamp(18px,3.25vw,26px)] font-medium leading-[1.5] text-[#526077]">
                {step.cardDescription}
              </p>
            </section>

            <button
              type="button"
              onClick={handleNext}
              className="mt-auto h-[clamp(72px,7.5svh,96px)] w-full rounded-[8px] bg-[#2563EB] text-[clamp(24px,4vw,32px)] font-extrabold text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#93B4FF]"
            >
              시작하기
            </button>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center pt-[clamp(56px,6svh,76px)]">
            <TutorialVisual state={step.microphoneState} />

            <section
              aria-live="polite"
              className="mt-[clamp(58px,6.25svh,80px)] flex min-h-[220px] w-full max-w-[640px] flex-col rounded-[12px] border-2 border-[#3B82F6] bg-white px-[clamp(18px,3vw,24px)] py-[clamp(16px,2svh,26px)] text-left shadow-[0_2px_12px_rgba(15,23,42,0.10)]"
            >
              <h2 className="text-[clamp(26px,4.5vw,36px)] font-extrabold leading-[1.35] text-[#111827]">
                {step.cardTitle}
              </h2>
              <p className="mt-1 text-[clamp(18px,3.25vw,26px)] font-medium leading-[1.5] text-[#526077]">
                {step.cardDescription}
              </p>

              <div className="mt-auto flex min-h-[50px] w-full items-end justify-between gap-4">
                <p aria-current="step" className="text-[clamp(20px,3.25vw,26px)] font-medium text-[#2563EB]">
                  {tutorialStep + 1}/{TUTORIAL_STEPS.length}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="h-[50px] min-w-[clamp(82px,15vw,120px)] rounded-[8px] border-2 border-[#E2E8F0] bg-white px-3 text-[clamp(16px,3vw,24px)] font-medium text-[#475569] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#BFDBFE]"
                  >
                    이전
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="h-[50px] min-w-[clamp(82px,15vw,120px)] rounded-[8px] border-2 border-[#3B82F6] bg-[#2563EB] px-3 text-[clamp(16px,3vw,24px)] font-medium text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#93B4FF]"
                  >
                    다음
                  </button>
                </div>
              </div>
            </section>

            <button
              type="button"
              onClick={handleSkip}
              className="mt-auto h-[clamp(58px,5.9svh,76px)] w-full rounded-[8px] border-2 border-[#E2E8F0] bg-white text-[clamp(19px,3.25vw,26px)] font-medium text-[#526077] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#BFDBFE]"
            >
              건너뛰기
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
