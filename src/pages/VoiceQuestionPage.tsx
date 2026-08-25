import { useEffect, useRef, useState } from 'react'
import type {
  VoiceAnswerData,
  VoiceQuestionId,
  VoiceQuestionStatus,
} from '../types/flow'
import type { VoiceAudioApiPayload } from '../types/api'
import { VOICE_QUESTIONS } from '../data/voiceQuestions'
import { ApiRequestError } from '../services/apiBase'
import { submitVoiceAnswer } from '../services/voiceApi'
import { blobToBase64 } from '../utils/audio'

const PREFERRED_AUDIO_MIME_TYPE = 'audio/webm;codecs=opus'
const SILENCE_DURATION_MS = 5_000
const SILENCE_THRESHOLD = 0.02
const MAX_RECORDING_MS = 60_000

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
  sessionId: string | null
  questionId: VoiceQuestionId
  answers: Record<VoiceQuestionId, string>
  onAnswerChange: (id: VoiceQuestionId, answer: VoiceAnswerData) => void
  onSessionNotFound: () => void | Promise<void>
  onNext: () => void
  onPrev: () => void
  currentOrder: number
  totalQuestions: number
  isEditMode?: boolean
}

export function VoiceQuestionPage({
  sessionId,
  questionId,
  answers,
  onAnswerChange,
  onSessionNotFound,
  onNext,
  onPrev,
  currentOrder,
  totalQuestions,
  isEditMode = false,
}: VoiceQuestionPageProps) {
  const [status, setStatus] = useState<VoiceQuestionStatus>('idle')
  const [recordingTime, setRecordingTime] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const audioSourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const analyserFrameRef = useRef<number | null>(null)
  const maxRecordingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const requestAbortRef = useRef<AbortController | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const recordingStartedAtRef = useRef(0)
  const sampleRateRef = useRef<number | undefined>(undefined)
  const requestGenerationRef = useRef(0)
  const shouldSubmitOnStopRef = useRef(false)
  const isStartingRef = useRef(false)
  const isStoppingRef = useRef(false)
  const isMountedRef = useRef(true)

  const question = VOICE_QUESTIONS.find((q) => q.id === questionId)
  const currentAnswer = answers[questionId]

  const stopMonitoring = () => {
    if (analyserFrameRef.current !== null) {
      window.cancelAnimationFrame(analyserFrameRef.current)
      analyserFrameRef.current = null
    }
    if (maxRecordingTimeoutRef.current) {
      window.clearTimeout(maxRecordingTimeoutRef.current)
      maxRecordingTimeoutRef.current = null
    }
  }

  const cleanupRecording = (cancelRecorder: boolean) => {
    stopMonitoring()

    const recorder = mediaRecorderRef.current
    if (recorder && cancelRecorder) {
      shouldSubmitOnStopRef.current = false
      recorder.ondataavailable = null
      recorder.onstop = null
      recorder.onerror = null
      if (recorder.state !== 'inactive') {
        try {
          recorder.stop()
        } catch {
          // The recorder may already be stopping.
        }
      }
    }
    mediaRecorderRef.current = null

    mediaStreamRef.current?.getTracks().forEach((track) => track.stop())
    mediaStreamRef.current = null

    audioSourceRef.current?.disconnect()
    audioSourceRef.current = null

    const audioContext = audioContextRef.current
    audioContextRef.current = null
    if (audioContext && audioContext.state !== 'closed') {
      void audioContext.close().catch(() => undefined)
    }

    audioChunksRef.current = []
    sampleRateRef.current = undefined
    isStartingRef.current = false
    isStoppingRef.current = false
  }

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current
    if (
      !recorder ||
      recorder.state !== 'recording' ||
      isStoppingRef.current
    ) {
      return
    }

    isStoppingRef.current = true
    shouldSubmitOnStopRef.current = true
    stopMonitoring()
    recorder.stop()
  }

  const submitRecording = async (
    recorder: MediaRecorder,
    generation: number,
    recordedQuestionId: VoiceQuestionId,
    recordedSessionId: string,
  ) => {
    const shouldSubmit = shouldSubmitOnStopRef.current
    shouldSubmitOnStopRef.current = false
    const chunks = [...audioChunksRef.current]
    const durationMs = Math.max(
      0,
      Math.round(performance.now() - recordingStartedAtRef.current),
    )
    const sampleRate = sampleRateRef.current
    const blob = new Blob(chunks, {
      type: recorder.mimeType || PREFERRED_AUDIO_MIME_TYPE,
    })

    cleanupRecording(false)
    if (!shouldSubmit || generation !== requestGenerationRef.current) return

    if (blob.size === 0) {
      setStatus('error')
      return
    }

    const controller = new AbortController()
    requestAbortRef.current = controller
    setIsSubmitting(true)

    try {
      const data = await blobToBase64(blob)
      if (generation !== requestGenerationRef.current) return

      const audio: VoiceAudioApiPayload = {
        format: 'webm',
        codec: 'opus',
        encoding: 'base64',
        durationMs,
        data,
        ...(sampleRate ? { sampleRate } : {}),
      }
      const response = await submitVoiceAnswer(
        recordedSessionId,
        recordedQuestionId,
        audio,
        controller.signal,
      )

      if (generation !== requestGenerationRef.current) return
      if (response.status !== 'ok' || !response.sttText) {
        setStatus('error')
        return
      }

      onAnswerChange(recordedQuestionId, {
        sttText: response.sttText,
        keywords: response.keywords ?? [],
        confidence: response.confidence,
        answeredAt: response.answeredAt,
      })
      setStatus('success')
    } catch (error: unknown) {
      if (error instanceof ApiRequestError && error.kind === 'ABORTED') return

      if (
        error instanceof ApiRequestError &&
        error.status === 404 &&
        error.errorCode === 'SESSION_NOT_FOUND'
      ) {
        await onSessionNotFound()
        return
      }

      console.error('[Voice API] 음성 답변 처리 실패', error)
      if (generation === requestGenerationRef.current) {
        setStatus('error')
      }
    } finally {
      if (requestAbortRef.current === controller) {
        requestAbortRef.current = null
      }
      if (generation === requestGenerationRef.current && isMountedRef.current) {
        setIsSubmitting(false)
      }
    }
  }

  const startRecording = async () => {
    if (isSubmitting || isStartingRef.current || isStoppingRef.current) return

    const generation = requestGenerationRef.current + 1
    requestGenerationRef.current = generation
    requestAbortRef.current?.abort()
    requestAbortRef.current = null
    cleanupRecording(true)
    setStatus('recording')
    setRecordingTime(0)
    isStartingRef.current = true

    try {
      if (!sessionId) {
        throw new Error('음성 세션이 준비되지 않았습니다.')
      }
      if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
        throw new Error('이 브라우저에서는 마이크 녹음을 지원하지 않습니다.')
      }
      if (!MediaRecorder.isTypeSupported(PREFERRED_AUDIO_MIME_TYPE)) {
        throw new Error('이 브라우저에서는 webm/opus 녹음을 지원하지 않습니다.')
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      if (generation !== requestGenerationRef.current || !isMountedRef.current) {
        stream.getTracks().forEach((track) => track.stop())
        return
      }

      const AudioContextConstructor = (
        window as typeof window & { webkitAudioContext?: typeof AudioContext }
      ).AudioContext ?? (
        window as typeof window & { webkitAudioContext?: typeof AudioContext }
      ).webkitAudioContext
      if (!AudioContextConstructor) {
        stream.getTracks().forEach((track) => track.stop())
        throw new Error('이 브라우저에서는 음량 감지를 지원하지 않습니다.')
      }

      const audioContext = new AudioContextConstructor()
      if (audioContext.state === 'suspended') await audioContext.resume()
      const source = audioContext.createMediaStreamSource(stream)
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 2048
      source.connect(analyser)

      const recorder = new MediaRecorder(stream, {
        mimeType: PREFERRED_AUDIO_MIME_TYPE,
      })
      mediaStreamRef.current = stream
      audioContextRef.current = audioContext
      audioSourceRef.current = source
      sampleRateRef.current = audioContext.sampleRate
      mediaRecorderRef.current = recorder
      audioChunksRef.current = []
      recordingStartedAtRef.current = performance.now()
      shouldSubmitOnStopRef.current = false
      isStartingRef.current = false

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data)
      }
      recorder.onstop = () => {
        void submitRecording(recorder, generation, questionId, sessionId)
      }
      recorder.onerror = () => {
        shouldSubmitOnStopRef.current = false
        cleanupRecording(true)
        if (generation === requestGenerationRef.current) setStatus('error')
      }

      recorder.start(1_000)
      maxRecordingTimeoutRef.current = window.setTimeout(
        stopRecording,
        MAX_RECORDING_MS,
      )

      const samples = new Float32Array(analyser.fftSize)
      let lastSoundAt = performance.now()
      const monitorSilence = () => {
        if (
          mediaRecorderRef.current !== recorder ||
          recorder.state !== 'recording'
        ) {
          return
        }

        analyser.getFloatTimeDomainData(samples)
        let sumOfSquares = 0
        for (const sample of samples) sumOfSquares += sample * sample
        const rms = Math.sqrt(sumOfSquares / samples.length)
        const now = performance.now()

        if (rms >= SILENCE_THRESHOLD) lastSoundAt = now
        if (now - lastSoundAt >= SILENCE_DURATION_MS) {
          stopRecording()
          return
        }

        analyserFrameRef.current = window.requestAnimationFrame(monitorSilence)
      }
      analyserFrameRef.current = window.requestAnimationFrame(monitorSilence)
    } catch (error: unknown) {
      console.error('[Voice recording] 녹음 시작 실패', error)
      cleanupRecording(true)
      if (generation === requestGenerationRef.current && isMountedRef.current) {
        setStatus('error')
      }
    }
  }

  useEffect(() => {
    requestGenerationRef.current += 1
    requestAbortRef.current?.abort()
    requestAbortRef.current = null
    cleanupRecording(true)
    setStatus(answers[questionId] && !isEditMode ? 'success' : 'idle')
    setRecordingTime(0)
    setIsSubmitting(false)
  }, [questionId, sessionId])

  useEffect(() => {
    if (status === 'recording') {
      timerIntervalRef.current = window.setInterval(() => {
        setRecordingTime((previous) => previous + 1)
      }, 100)
    }

    return () => {
      if (timerIntervalRef.current) {
        window.clearInterval(timerIntervalRef.current)
        timerIntervalRef.current = null
      }
    }
  }, [status])

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
      requestGenerationRef.current += 1
      requestAbortRef.current?.abort()
      requestAbortRef.current = null
      cleanupRecording(true)
      if (timerIntervalRef.current) {
        window.clearInterval(timerIntervalRef.current)
        timerIntervalRef.current = null
      }
    }
  }, [])

  const handleMicClick = () => {
    if (isSubmitting) return
    if (status === 'recording') {
      stopRecording()
      return
    }
    void startRecording()
  }

  const handleRetry = () => {
    if (!isSubmitting) void startRecording()
  }

  const handleNext = () => {
    if (currentAnswer && status === 'success' && !isSubmitting) onNext()
  }

  if (!question) return null

  const showAnswer = Boolean(currentAnswer) && status === 'success'
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
            aria-label={
              isSubmitting
                ? '음성 인식 처리 중'
                : status === 'recording'
                  ? '녹음 끝내기'
                  : '말하기'
            }
            onClick={handleMicClick}
            disabled={isSubmitting}
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
                disabled={isSubmitting}
                className="h-[clamp(68px,7.5svh,96px)] w-full rounded-[8px] bg-[#2468F2] text-[clamp(22px,3.5vw,28px)] font-extrabold text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#93B4FF] disabled:cursor-wait"
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
                  disabled={isSubmitting || status !== 'success'}
                  className="h-[clamp(68px,7.5svh,96px)] flex-1 rounded-[8px] bg-[#2468F2] text-[clamp(20px,3.25vw,26px)] font-extrabold text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#93B4FF]"
                >
                  수정 완료
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                disabled={!currentAnswer || status !== 'success' || isSubmitting}
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
