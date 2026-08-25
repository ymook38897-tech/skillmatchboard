import { useEffect, useRef, useState } from 'react'
import type { VoiceQuestionId, VoiceQuestionStatus } from '../types/flow'
import { VOICE_QUESTIONS, MOCK_ANSWERS } from '../data/voiceQuestions'

// Mock에서 강제로 에러를 발생시킬지 여부 (개발 테스트용)
const MOCK_FORCE_ERROR = false

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

function VoiceWaveform() {
  const bars = [18, 34, 48, 28, 58, 42, 24, 52, 36, 18, 44, 26]

  return (
    <div aria-hidden="true" className="flex h-[58px] items-center gap-[7px]">
      {bars.map((height, index) => (
        <span
          key={`${height}-${index}`}
          className="w-[5px] rounded-full bg-[#2468F2]"
          style={{ height }}
        />
      ))}
    </div>
  )
}

interface VoiceQuestionPageProps {
  questionId: VoiceQuestionId
  answers: Record<VoiceQuestionId, string>
  onAnswerChange: (id: VoiceQuestionId, answer: string) => void
  onNext: () => void
  onPrev: () => void
  currentOrder: number
  totalQuestions: number
  isEditMode?: boolean
}

export function VoiceQuestionPage({
  questionId,
  answers,
  onAnswerChange,
  onNext,
  onPrev,
  currentOrder,
  totalQuestions,
  isEditMode = false,
}: VoiceQuestionPageProps) {
  const [status, setStatus] = useState<VoiceQuestionStatus>('idle')
  const [recordingTime, setRecordingTime] = useState(0)

  // Timer 관리용 ref
  const completionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  )
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const question = VOICE_QUESTIONS.find((q) => q.id === questionId)
  const currentAnswer = answers[questionId]

  // 질문이 변경되면 모든 상태를 초기화
  useEffect(() => {
    // 이전 timer 정리
    if (completionTimeoutRef.current) {
      clearTimeout(completionTimeoutRef.current)
      completionTimeoutRef.current = null
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }

    // 상태 초기화
    setStatus('idle')
    setRecordingTime(0)
  }, [questionId])

  // 녹음 중 시간 표시용 interval
  useEffect(() => {
    if (status === 'recording') {
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 100)
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
        timerIntervalRef.current = null
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
        timerIntervalRef.current = null
      }
    }
  }, [status])

  // 컴포넌트 unmount 시 cleanup
  useEffect(() => {
    return () => {
      if (completionTimeoutRef.current) {
        clearTimeout(completionTimeoutRef.current)
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
    }
  }, [])

  const clearCompletionTimeout = () => {
    if (completionTimeoutRef.current) {
      clearTimeout(completionTimeoutRef.current)
      completionTimeoutRef.current = null
    }
  }

  const startMockRecording = () => {
    // 이전 timeout 정리
    clearCompletionTimeout()

    // Mock: 2초 후 성공 (또는 강제 실패)
    completionTimeoutRef.current = setTimeout(() => {
      if (MOCK_FORCE_ERROR) {
        setStatus('error')
      } else {
        setStatus('success')
        onAnswerChange(questionId, MOCK_ANSWERS[questionId])
      }
      completionTimeoutRef.current = null
    }, 2000)
  }

  const handleMicClick = () => {
    if (status === 'idle') {
      setStatus('recording')
      setRecordingTime(0)
      startMockRecording()
    } else if (status === 'recording') {
      // 녹음 중 마이크 버튼 다시 클릭 시 조기 종료
      clearCompletionTimeout()
      if (MOCK_FORCE_ERROR) {
        setStatus('error')
      } else {
        setStatus('success')
        onAnswerChange(questionId, MOCK_ANSWERS[questionId])
      }
    } else if (status === 'success') {
      setStatus('recording')
      onAnswerChange(questionId, '')
      setRecordingTime(0)
      startMockRecording()
    } else if (status === 'error') {
      // error 상태에서 마이크 버튼 클릭 시 다시 시도
      setStatus('recording')
      setRecordingTime(0)
      startMockRecording()
    }
  }

  const handleRetry = () => {
    setStatus('recording')
    onAnswerChange(questionId, '')
    setRecordingTime(0)
    startMockRecording()
  }

  const handleNext = () => {
    if (currentAnswer) {
      onNext()
    }
  }

  if (!question) return null

  const showAnswer = Boolean(currentAnswer) && status !== 'recording'
  const showFooter = status === 'error' || showAnswer

  return (
    <div className="voice-flow-page min-h-[100svh] bg-[#EEF1F4]">
      <main className="relative mx-auto flex min-h-[100svh] w-full max-w-[800px] flex-col overflow-hidden bg-white sm:rounded-[24px]">
        <header className="px-[clamp(24px,6.25vw,50px)] pt-[clamp(34px,4.4svh,56px)]">
          <div className="flex items-center gap-[clamp(6px,1.2vw,10px)]">
            {Array.from({ length: totalQuestions }, (_, index) => {
              const segmentOrder = index + 1
              const isComplete = segmentOrder <= currentOrder
              const canGoBack = segmentOrder < currentOrder

              return (
                <button
                  key={segmentOrder}
                  type="button"
                  aria-label={canGoBack ? '이전 질문' : `${segmentOrder}번째 질문`}
                  onClick={canGoBack ? onPrev : undefined}
                  disabled={!canGoBack}
                  className={`h-[5px] flex-1 rounded-full ${
                    isComplete ? 'bg-[#2468F2]' : 'bg-[#D6E4FF]'
                  } ${canGoBack ? 'cursor-pointer' : 'cursor-default'}`}
                />
              )
            })}
            <span className="ml-2 shrink-0 text-[clamp(14px,2vw,16px)] font-bold text-[#6B7280]">
              {currentOrder}/{totalQuestions}
            </span>
          </div>
        </header>

        <section
          className={`flex flex-1 flex-col items-center px-[clamp(24px,10vw,80px)] text-center ${
            showFooter
              ? 'pb-[clamp(180px,19svh,244px)]'
              : 'pb-[clamp(60px,8svh,102px)]'
          }`}
        >
          <h1 className="mt-[clamp(64px,7.5svh,96px)] text-[clamp(28px,5vw,40px)] font-extrabold leading-[1.28] tracking-[-0.035em] text-[#111827]">
            {status === 'error' ? '목소리를 듣지 못했어요' : question.title}
          </h1>

          <button
            type="button"
            aria-label={status === 'recording' ? '녹음 끝내기' : '말하기'}
            onClick={handleMicClick}
            className={`relative mt-[clamp(96px,13svh,166px)] flex size-[clamp(148px,27vw,216px)] shrink-0 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-4 ${
              status === 'recording'
                ? 'border-[3px] border-[#2468F2] bg-[#2468F2] text-white shadow-[0_0_0_16px_rgba(36,104,242,0.10),0_0_0_32px_rgba(36,104,242,0.05)] focus-visible:ring-[#93B4FF]'
                : status === 'error'
                  ? 'border-[3px] border-[#FF8B8B] bg-[#FFF4F4] text-[#F04444] focus-visible:ring-[#FFC9C9]'
                  : 'border-[3px] border-[#8EB4FF] bg-white text-[#2468F2] focus-visible:ring-[#93B4FF]'
            }`}
          >
            <MicrophoneIcon className="size-[clamp(58px,9vw,72px)]" />
          </button>

          {status === 'recording' ? (
            <div className="mt-[clamp(48px,6svh,76px)]">
              <VoiceWaveform />
              <span className="sr-only">{(recordingTime / 10).toFixed(1)}초</span>
            </div>
          ) : status !== 'error' ? (
            <p className="mt-[clamp(48px,7.5svh,96px)] text-[clamp(23px,3.75vw,30px)] font-extrabold text-[#2468F2]">
              말하기
            </p>
          ) : null}

          {showAnswer && (
            <div className="relative mt-[clamp(54px,6.4svh,82px)] w-full rounded-[8px] border-2 border-[#8EB4FF] bg-white px-[clamp(20px,3.75vw,30px)] py-[clamp(18px,2.5svh,32px)] text-left before:absolute before:-top-[11px] before:left-1/2 before:size-5 before:-translate-x-1/2 before:rotate-45 before:border-l-2 before:border-t-2 before:border-[#8EB4FF] before:bg-white">
              <p className="text-[clamp(14px,2vw,16px)] font-bold text-[#6B7280]">
                인식한 답변
              </p>
              <p className="mt-2 text-[clamp(18px,2.75vw,22px)] font-medium leading-[1.5] text-[#111827]">
                {currentAnswer}
              </p>
            </div>
          )}

        </section>

        {showFooter && (
          <footer className="absolute inset-x-0 bottom-0 bg-white px-[clamp(24px,6vw,48px)] pb-[clamp(28px,4svh,52px)] pt-5">
            {status === 'error' ? (
              <button
                type="button"
                onClick={handleRetry}
                className="h-[clamp(68px,7.5svh,96px)] w-full rounded-[8px] bg-[#2468F2] text-[clamp(22px,3.5vw,28px)] font-extrabold text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#93B4FF]"
              >
                다시 말하기
              </button>
            ) : isEditMode ? (
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={onPrev}
                  className="h-[clamp(68px,7.5svh,96px)] flex-1 rounded-[8px] border-2 border-[#8EB4FF] bg-white text-[clamp(20px,3.25vw,26px)] font-extrabold text-[#2468F2] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#BFDBFE]"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="h-[clamp(68px,7.5svh,96px)] flex-1 rounded-[8px] bg-[#2468F2] text-[clamp(20px,3.25vw,26px)] font-extrabold text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#93B4FF]"
                >
                  수정 완료
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                disabled={!currentAnswer}
                className="h-[clamp(68px,7.5svh,96px)] w-full rounded-[8px] bg-[#2468F2] text-[clamp(22px,3.5vw,28px)] font-extrabold text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#93B4FF] disabled:bg-[#D1D5DB]"
              >
                다음
              </button>
            )}
          </footer>
        )}
      </main>
    </div>
  )
}
