import { useState } from 'react'

interface TutorialPageProps {
  onNext: () => void
  onPrev: () => void
  onHelp: () => void
}

interface TutorialStep {
  cardTitle: string
  cardDescription: string
  microphoneState: 'idle' | 'recording'
  hasPointer?: boolean
  hideSubtitle?: boolean
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
    cardTitle: '마이크 버튼',
    cardDescription: '답변이 잘못되면 버튼을 다시 눌러주세요.',
    microphoneState: 'idle',
    hasPointer: true,
  },
  {
    cardTitle: '녹음 카드',
    cardDescription: '이 카드에 녹음된 음성이 나타나요.',
    microphoneState: 'idle',
    hideSubtitle: true,
  },
]

const WAVEFORM_HEIGHTS = [19.2, 35.2, 49.6, 57.6, 43.2, 30.4, 52.8, 38.4, 20.8]

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

function TutorialMicrophone({ state }: { state: TutorialStep['microphoneState'] }) {
  const isRecording = state === 'recording'

  return (
    <div className="flex h-[400px] w-[304px] shrink-0 flex-col items-center gap-[51.2px] pt-[6.4px]">
      <div className="flex h-[272px] w-[288px] shrink-0 items-center justify-center">
        <div
          className={
            isRecording
              ? 'flex size-[216px] items-center justify-center rounded-full bg-[#2563EB] shadow-[0_0_0_12px_#EFF6FF,0_0_0_24px_#F8FBFF]'
              : 'flex size-[216px] items-center justify-center rounded-full border-2 border-[#3B82F6] bg-white'
          }
        >
          <MicrophoneIcon
            className={`size-[64px] ${isRecording ? 'text-white' : 'text-[#2563EB]'}`}
          />
        </div>
      </div>

      {isRecording ? (
        <div
          aria-label="음성을 듣고 있어요"
          className="flex h-[57.6px] items-center gap-[9.6px]"
        >
          {WAVEFORM_HEIGHTS.map((height, index) => (
            <span
              key={`${height}-${index}`}
              className="w-[9.6px] rounded-full bg-[#2563EB]"
              style={{ height }}
            />
          ))}
        </div>
      ) : (
        <p className="whitespace-nowrap text-[clamp(30px,4.8vw,38.4px)] font-bold leading-[57.6px] text-[#2563EB]">
          말하기
        </p>
      )}
    </div>
  )
}

export function TutorialPage({ onNext, onPrev }: TutorialPageProps) {
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
      onNext()
      return
    }

    setTutorialStep((current) => current + 1)
  }

  return (
    <div className="voice-flow-page min-h-[100svh] bg-[#EEF1F4]">
      <main className="mx-auto flex min-h-[100svh] w-full max-w-[800px] flex-col gap-6 overflow-x-hidden bg-white px-[clamp(24px,6vw,48px)] pb-[clamp(32px,6vw,48px)] pt-[clamp(64px,15vw,120px)] text-center shadow-[0_2px_12px_rgba(15,23,42,0.10)] sm:rounded-[24px]">
        <header className="flex h-[120px] shrink-0 flex-col items-center overflow-hidden">
          <h1 className="w-full text-[clamp(38px,6vw,48px)] font-bold leading-[1.5] tracking-normal text-[#0F172A]">
            버튼 설명
          </h1>
          {!step.hideSubtitle && (
            <p className="w-full text-[clamp(20px,3.25vw,26px)] font-normal leading-[1.5] text-[#475569]">
              이것만 기억해 주세요.
            </p>
          )}
        </header>

        <div className="flex min-h-[764px] w-full flex-1 flex-col items-center gap-[clamp(40px,8vw,64px)] pt-[clamp(40px,8vw,64px)]">
          <TutorialMicrophone state={step.microphoneState} />

          <section
            aria-live="polite"
            className={`relative flex w-full ${step.hasPointer ? 'h-[242px] max-w-[680px] gap-2 overflow-visible' : 'h-[236px] max-w-[640px] gap-[6px] overflow-hidden'} shrink-0 flex-col items-start rounded-[12px] border-2 border-[#3B82F6] bg-white p-[18px] text-left shadow-[0_2px_12px_rgba(15,23,42,0.10)]`}
          >
            {step.hasPointer && (
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-[-28px] h-7 w-14 -translate-x-1/2 bg-[#3B82F6] [clip-path:polygon(50%_0,100%_100%,0_100%)]"
              >
                <span className="absolute inset-x-0.5 bottom-[-2px] top-0.5 block bg-white [clip-path:polygon(50%_0,100%_100%,0_100%)]" />
              </div>
            )}

            <h2 className="w-full text-[clamp(26px,4.5vw,36px)] font-bold leading-[1.5] text-[#0F172A]">
              {step.cardTitle}
            </h2>
            <p className="w-full text-[clamp(18px,3.25vw,26px)] font-normal leading-[1.5] text-[#475569]">
              {step.cardDescription}
            </p>
            <div className="h-[35px] w-full shrink-0" />

            <div className="flex h-[50px] w-full items-center justify-between overflow-hidden">
              <p
                aria-current="step"
                className="w-[clamp(32px,5vw,40px)] shrink-0 text-[clamp(20px,3.25vw,26px)] font-normal leading-[1.5] text-[#2563EB]"
              >
                {tutorialStep + 1}/4
              </p>
              <div className="flex h-[50px] min-w-0 flex-1 items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onNext}
                  className="h-[50px] w-[clamp(82px,15vw,120px)] shrink-0 rounded-[8px] border-2 border-[#E2E8F0] bg-white px-1 text-center text-[clamp(16px,3.25vw,26px)] font-normal leading-[1.5] whitespace-nowrap text-[#475569] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#BFDBFE]"
                >
                  건너뛰기
                </button>
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="h-[50px] w-[clamp(82px,15vw,120px)] shrink-0 rounded-[8px] border-2 border-[#E2E8F0] bg-white px-1 text-center text-[clamp(16px,3.25vw,26px)] font-normal leading-[1.5] whitespace-nowrap text-[#475569] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#BFDBFE]"
                >
                  이전으로
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="h-[50px] w-[clamp(82px,15vw,120px)] shrink-0 rounded-[8px] border-2 border-[#3B82F6] bg-[#2563EB] px-1 text-center text-[clamp(16px,3.25vw,26px)] font-normal leading-[1.5] whitespace-nowrap text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#93B4FF]"
                >
                  다음으로
                </button>
              </div>
            </div>
          </section>
        </div>

        {!step.hideSubtitle && <div aria-hidden="true" className="h-[94px] w-full shrink-0" />}
      </main>
    </div>
  )
}
