import { useState } from 'react'
import { useRef } from 'react'
import type {
  CertificationCandidate,
  VoiceAnswerData,
  VoiceFlowStep,
  VoiceInterviewAnswerDetails,
  VoiceInterviewAnswers,
  VoiceJob,
  VoiceQuestionId,
} from './types/flow'
import type { VoiceQuestionKey } from './types/api'
import { VOICE_QUESTIONS } from './data/voiceQuestions'
import { StartPage } from './pages/StartPage'
import { TutorialPage } from './pages/TutorialPage'
import { VoiceQuestionPage } from './pages/VoiceQuestionPage'
import { AnswerReviewPage } from './pages/AnswerReviewPage'
import { JobRecommendationPage } from './pages/JobRecommendationPage'
import { ResumeGenerationPage } from './pages/ResumeGenerationPage'
import { VoiceCertificationSelectionPage } from './pages/VoiceCertificationSelectionPage'
import { LoadingScreen } from './components/common/LoadingScreen'
import { ApiRequestError } from './services/apiBase'
import { fetchVoiceRecommendations } from './services/recommendationApi'
import { createVoiceSession } from './services/sessionApi'
import { QUESTION_ID_MAP } from './services/voiceApi'

// 자격증 후보 API 계약이 확정되기 전까지 운영 화면에 임의 목록을 노출하지 않는다.
const CERTIFICATION_CANDIDATES: CertificationCandidate[] = []

function createInitialAnswers(): VoiceInterviewAnswers {
  return {
    difficulty: '',
    experience: '',
    interest: '',
    strength: '',
    certificate: '',
  }
}

export function App() {
  const [currentStep, setCurrentStep] = useState<VoiceFlowStep>('start')
  const [answers, setAnswers] = useState<VoiceInterviewAnswers>(
    createInitialAnswers()
  )
  const [answerDetails, setAnswerDetails] =
    useState<VoiceInterviewAnswerDetails>({})
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [recommendations, setRecommendations] = useState<VoiceJob[]>([])
  const [selectedJobs, setSelectedJobs] = useState<VoiceJob[]>([])
  const [currentQuestionOrder, setCurrentQuestionOrder] = useState(1)
  const [editingQuestionId, setEditingQuestionId] = useState<VoiceQuestionId | null>(null)
  const [selectedCertificationId, setSelectedCertificationId] = useState<string | null>(null)
  const [selectedCertificationLabel, setSelectedCertificationLabel] = useState('')
  const [didSkipCertification, setDidSkipCertification] = useState(false)
  const [isSessionPreparing, setIsSessionPreparing] = useState(false)
  const [isSessionLoading, setIsSessionLoading] = useState(false)
  const [isRecommendationLoading, setIsRecommendationLoading] = useState(false)
  const sessionCreationRef = useRef<Promise<string> | null>(null)
  const sessionRecoveryRef = useRef<Promise<void> | null>(null)
  const recommendationAbortRef = useRef<AbortController | null>(null)

  const currentQuestion = VOICE_QUESTIONS.find((q) => q.order === currentQuestionOrder)
  const totalQuestions = VOICE_QUESTIONS.length

  // Navigation handlers
  const goToStep = (step: VoiceFlowStep) => {
    setCurrentStep(step)
  }

  const goToQuestionOrder = (order: number) => {
    setCurrentQuestionOrder(Math.max(1, Math.min(totalQuestions, order)))
  }

  const handleAnswerChange = (
    questionId: VoiceQuestionId,
    answer: VoiceAnswerData,
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer.sttText,
    }))
    setAnswerDetails((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const createFreshSession = (): Promise<string> => {
    if (sessionCreationRef.current) return sessionCreationRef.current

    const request = (async () => {
      try {
        const session = await createVoiceSession()
        setSessionId(session.sessionId)
        return session.sessionId
      } finally {
        sessionCreationRef.current = null
      }
    })()

    sessionCreationRef.current = request
    return request
  }

  const ensureSession = (): Promise<string> => {
    return sessionId ? Promise.resolve(sessionId) : createFreshSession()
  }

  const handleStartTutorial = () => {
    goToStep('tutorial')
  }

  const handleTutorialComplete = () => {
    if (sessionId) {
      goToQuestionOrder(1)
      goToStep('voice-question')
      return
    }

    setIsSessionPreparing(true)
    setIsSessionLoading(true)
    void ensureSession()
      .then(() => {
        goToQuestionOrder(1)
        goToStep('voice-question')
      })
      .catch((error: unknown) => {
        console.error('[Session API] 세션 생성 실패', error)
      })
      .finally(() => {
        setIsSessionPreparing(false)
        setIsSessionLoading(false)
      })
  }

  const handleTutorialPrev = () => {
    goToStep('start')
  }

  const handleVoiceQuestionNext = () => {
    if (currentQuestionOrder < totalQuestions) {
      goToQuestionOrder(currentQuestionOrder + 1)
    } else {
      goToStep('certification-selection')
    }
  }

  const handleVoiceQuestionPrev = () => {
    if (currentQuestionOrder > 1) {
      goToQuestionOrder(currentQuestionOrder - 1)
    } else {
      goToStep('tutorial')
    }
  }

  const handleCertificationPrev = () => {
    goToQuestionOrder(totalQuestions)
    goToStep('voice-question')
  }

  const handleCertificationSkip = () => {
    setSelectedCertificationId(null)
    setSelectedCertificationLabel('')
    setDidSkipCertification(true)
    goToStep('answer-review')
  }

  const handleCertificationComplete = (candidate: CertificationCandidate) => {
    setSelectedCertificationId(candidate.id)
    setSelectedCertificationLabel(candidate.label)
    setDidSkipCertification(false)
    goToStep('answer-review')
  }

  const handleEditAnswer = (questionId: VoiceQuestionId) => {
    const question = VOICE_QUESTIONS.find((q) => q.id === questionId)
    if (question) {
      setCurrentQuestionOrder(question.order)
      setEditingQuestionId(questionId)
      goToStep('voice-question')
    }
  }

  const resetVoiceSessionData = () => {
    recommendationAbortRef.current?.abort()
    recommendationAbortRef.current = null
    setSessionId(null)
    setAnswers(createInitialAnswers())
    setAnswerDetails({})
    setRecommendations([])
    setSelectedJobs([])
    setCurrentQuestionOrder(1)
    setEditingQuestionId(null)
    setSelectedCertificationId(null)
    setSelectedCertificationLabel('')
    setDidSkipCertification(false)
  }

  const handleSessionNotFound = (): Promise<void> => {
    if (sessionRecoveryRef.current) return sessionRecoveryRef.current

    resetVoiceSessionData()
    goToStep('tutorial')
    setIsSessionLoading(true)

    const recovery = (async () => {
      try {
        await createFreshSession()
        goToQuestionOrder(1)
        goToStep('voice-question')
      } catch (error: unknown) {
        console.error('[Session API] 만료 세션 재생성 실패', error)
      } finally {
        sessionRecoveryRef.current = null
        setIsSessionLoading(false)
      }
    })()

    sessionRecoveryRef.current = recovery
    return recovery
  }

  const getFirstMissingQuestionId = (
    error: ApiRequestError,
  ): VoiceQuestionId | null => {
    if (!error.details || typeof error.details !== 'object') return null
    const details = error.details as {
      missing?: unknown
      detail?: { missing?: unknown }
    }
    const missing = details.missing ?? details.detail?.missing
    if (!Array.isArray(missing)) return null

    const missingKey = missing.find(
      (value): value is VoiceQuestionKey =>
        value === 'D' || value === 'E' || value === 'F',
    )
    return missingKey ? QUESTION_ID_MAP[missingKey] : null
  }

  const handleAnswerReviewNext = async () => {
    if (isRecommendationLoading || recommendationAbortRef.current) return

    let activeSessionId: string
    try {
      activeSessionId = await ensureSession()
    } catch (error: unknown) {
      console.error('[Session API] 추천 전 세션 준비 실패', error)
      return
    }

    const controller = new AbortController()
    recommendationAbortRef.current = controller
    setIsRecommendationLoading(true)

    try {
      const jobs = await fetchVoiceRecommendations(
        activeSessionId,
        controller.signal,
      )
      setRecommendations(jobs)
      setSelectedJobs([])
      goToStep('job-recommendation')
    } catch (error: unknown) {
      if (error instanceof ApiRequestError && error.kind === 'ABORTED') return

      if (
        error instanceof ApiRequestError &&
        ((error.status === 404 &&
          error.errorCode === 'SESSION_NOT_FOUND') ||
          (error.status === 410 && error.errorCode === 'SESSION_EXPIRED'))
      ) {
        await handleSessionNotFound()
        return
      }

      if (
        error instanceof ApiRequestError &&
        error.status === 400 &&
        error.errorCode === 'MISSING_ANSWERS'
      ) {
        const missingQuestionId = getFirstMissingQuestionId(error)
        console.error('[Recommendation API] 답변 누락', error.details)

        if (missingQuestionId) {
          const question = VOICE_QUESTIONS.find(
            (item) => item.id === missingQuestionId,
          )
          if (question) {
            setCurrentQuestionOrder(question.order)
            setEditingQuestionId(missingQuestionId)
            goToStep('voice-question')
          }
        }
        return
      }

      console.error('[Recommendation API] 추천 요청 실패', error)
    } finally {
      if (recommendationAbortRef.current === controller) {
        recommendationAbortRef.current = null
      }
      setIsRecommendationLoading(false)
    }
  }

  const handleAnswerReviewPrev = () => {
    goToStep('voice-question')
    goToQuestionOrder(totalQuestions)
  }

  const handleJobSelectionNext = (jobs: VoiceJob[]) => {
    setSelectedJobs(jobs)
    goToStep('resume')
  }

  const handleJobSelectionPrev = () => {
    goToStep('answer-review')
  }

  const handleResumePrev = () => {
    goToStep('job-recommendation')
  }

  const handleResumeComplete = () => {
    // Flow complete - can navigate to next screen or show completion
    goToStep('start')
    recommendationAbortRef.current?.abort()
    recommendationAbortRef.current = null
    setSessionId(null)
    setAnswers(createInitialAnswers())
    setAnswerDetails({})
    setRecommendations([])
    setSelectedJobs([])
    setCurrentQuestionOrder(1)
    setEditingQuestionId(null)
    setSelectedCertificationId(null)
    setSelectedCertificationLabel('')
    setDidSkipCertification(false)
  }

  if (isSessionLoading || isRecommendationLoading) {
    return <LoadingScreen />
  }

  return (
    <>
      {currentStep === 'start' && (
        <StartPage onStart={handleStartTutorial} />
      )}

      {currentStep === 'tutorial' && (
        <TutorialPage
          onComplete={handleTutorialComplete}
          onPrev={handleTutorialPrev}
        />
      )}

      {currentStep === 'voice-question' && currentQuestion && (
        <VoiceQuestionPage
          key={`${sessionId ?? 'no-session'}-${currentQuestion.id}`}
          sessionId={sessionId}
          questionId={currentQuestion.id as VoiceQuestionId}
          answers={answers}
          onAnswerChange={handleAnswerChange}
          onSessionNotFound={handleSessionNotFound}
          onNext={
            editingQuestionId
              ? () => {
                  setEditingQuestionId(null)
                  goToStep('answer-review')
                }
              : handleVoiceQuestionNext
          }
          onPrev={
            editingQuestionId
              ? () => {
                  setEditingQuestionId(null)
                  goToStep('answer-review')
                }
              : handleVoiceQuestionPrev
          }
          currentOrder={currentQuestionOrder}
          totalQuestions={totalQuestions}
          isEditMode={editingQuestionId !== null}
          isSessionPreparing={isSessionPreparing}
        />
      )}

      {currentStep === 'answer-review' && (
        <AnswerReviewPage
          answers={answers}
          selectedCertificationLabel={selectedCertificationLabel}
          didSkipCertification={didSkipCertification}
          onEdit={handleEditAnswer}
          onNext={handleAnswerReviewNext}
          onPrev={handleAnswerReviewPrev}
          isSubmitting={isRecommendationLoading}
        />
      )}

      {currentStep === 'certification-selection' && (
        <VoiceCertificationSelectionPage
          candidates={CERTIFICATION_CANDIDATES}
          initialSelectedId={selectedCertificationId}
          onPrev={handleCertificationPrev}
          onSkip={handleCertificationSkip}
          onComplete={handleCertificationComplete}
        />
      )}

      {currentStep === 'job-recommendation' && (
        <JobRecommendationPage
          jobs={recommendations}
          initialSelectedJobs={selectedJobs}
          onSelectJobs={handleJobSelectionNext}
          onPrev={handleJobSelectionPrev}
        />
      )}

      {currentStep === 'resume' && (
        <ResumeGenerationPage
          answers={answers}
          selectedJobs={selectedJobs}
          onPrev={handleResumePrev}
          onComplete={handleResumeComplete}
        />
      )}

    </>
  )
}

export default App
