import { useEffect, useRef, useState } from 'react'
import { HelpModal } from './components/common/HelpModal'
import { FlowStatus } from './components/flow/FlowStatus'
import { getCertificationLabel } from './data/profileOptions'
import { AgeSelectionPage } from './pages/AgeSelectionPage'
import { ApplicationGuidePage } from './pages/ApplicationGuidePage'
import { BarrierSelectionPage } from './pages/BarrierSelectionPage'
import { BasicInfoPage } from './pages/BasicInfoPage'
import { QuestionPage } from './pages/QuestionPage'
import { ResultPage } from './pages/ResultPage'
import { StartPage } from './pages/StartPage'
import { mockQuestionDataSource } from './services/questionDataSource'
import { mockRecommendationDataSource } from './services/recommendationDataSource'
import type {
  AgeBandId,
  FlowPageId,
  FlowTransitionState,
  ProfileDraft,
  Recommendation,
  TraitQuestion,
  TraitResponseCode,
  TraitResponseMap,
  TransitionTarget,
} from './types/flow'

const MAX_PROFILE_SELECTIONS = 5
const MAX_PICKED_JOBS = 3

type ProfileStep = 'barriers' | 'certifications'

function createInitialProfile(): ProfileDraft {
  return {
    ageBand: null,
    barrierIds: [],
    barrierNone: false,
    certificationIds: [],
    certificationNone: false,
    certificationOther: '',
  }
}

function getProfileKey(profile: ProfileDraft): string {
  return JSON.stringify({
    ...profile,
    barrierIds: [...profile.barrierIds].sort(),
    certificationIds: [...profile.certificationIds].sort(),
  })
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

function App() {
  const [currentPage, setCurrentPage] = useState<FlowPageId>('P1')
  const [profileStep, setProfileStep] = useState<ProfileStep>('barriers')
  const [profile, setProfile] = useState<ProfileDraft>(createInitialProfile)
  const [questions, setQuestions] = useState<TraitQuestion[]>([])
  const [loadedProfileKey, setLoadedProfileKey] = useState<string | null>(null)
  const [responses, setResponses] = useState<TraitResponseMap>({})
  const [revealedQuestionCount, setRevealedQuestionCount] = useState(1)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [pickedJobCodes, setPickedJobCodes] = useState<string[]>([])
  const [transitionState, setTransitionState] =
    useState<FlowTransitionState>({ kind: 'idle' })
  const [showHelpModal, setShowHelpModal] = useState(false)

  const requestControllerRef = useRef<AbortController | null>(null)
  const requestIdRef = useRef(0)

  useEffect(() => {
    return () => {
      requestIdRef.current += 1
      requestControllerRef.current?.abort()
    }
  }, [])

  const goToPage = (page: FlowPageId) => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setCurrentPage(page)
  }

  const goToProfileStep = (step: ProfileStep) => {
    setProfileStep(step)
    goToPage('P3')
  }

  const resetSession = (destination: FlowPageId = 'P1') => {
    requestIdRef.current += 1
    requestControllerRef.current?.abort()
    requestControllerRef.current = null

    setProfile(createInitialProfile())
    setProfileStep('barriers')
    setQuestions([])
    setLoadedProfileKey(null)
    setResponses({})
    setRevealedQuestionCount(1)
    setRecommendations([])
    setPickedJobCodes([])
    setTransitionState({ kind: 'idle' })
    setShowHelpModal(false)
    goToPage(destination)
  }

  const beginRequest = (target: TransitionTarget) => {
    requestIdRef.current += 1
    requestControllerRef.current?.abort()

    const controller = new AbortController()
    const requestId = requestIdRef.current
    requestControllerRef.current = controller
    setTransitionState({ kind: 'loading', target })

    return { controller, requestId }
  }

  const isCurrentRequest = (requestId: number, controller: AbortController) =>
    requestIdRef.current === requestId && !controller.signal.aborted

  const loadQuestions = async (profileSnapshot: ProfileDraft = profile) => {
    const { controller, requestId } = beginRequest('questions')

    try {
      const loadedQuestions = await mockQuestionDataSource.loadQuestions(
        profileSnapshot,
        controller.signal,
      )

      if (!isCurrentRequest(requestId, controller)) return

      if (loadedQuestions.length === 0) {
        setTransitionState({ kind: 'error', target: 'questions' })
        return
      }

      setQuestions(loadedQuestions)
      setLoadedProfileKey(getProfileKey(profileSnapshot))
      setResponses({})
      setRevealedQuestionCount(1)
      setRecommendations([])
      setPickedJobCodes([])
      setTransitionState({ kind: 'idle' })
      goToPage('P4')
    } catch (error: unknown) {
      if (!isCurrentRequest(requestId, controller) || isAbortError(error)) return
      setTransitionState({ kind: 'error', target: 'questions' })
    } finally {
      if (requestControllerRef.current === controller) {
        requestControllerRef.current = null
      }
    }
  }

  const loadRecommendations = async (responseSnapshot: TraitResponseMap) => {
    const { controller, requestId } = beginRequest('recommendations')

    try {
      const loadedRecommendations =
        await mockRecommendationDataSource.loadRecommendations(
          {
            profile,
            questions,
            responses: responseSnapshot,
          },
          controller.signal,
        )

      if (!isCurrentRequest(requestId, controller)) return

      if (loadedRecommendations.length === 0) {
        setTransitionState({ kind: 'empty' })
        return
      }

      setRecommendations(loadedRecommendations)
      setPickedJobCodes([])
      setTransitionState({ kind: 'idle' })
      goToPage('P5')
    } catch (error: unknown) {
      if (!isCurrentRequest(requestId, controller) || isAbortError(error)) return
      setTransitionState({ kind: 'error', target: 'recommendations' })
    } finally {
      if (requestControllerRef.current === controller) {
        requestControllerRef.current = null
      }
    }
  }

  const handleAgeBandChange = (ageBand: AgeBandId) => {
    setProfile((previous) => ({ ...previous, ageBand }))
  }

  const handleBarrierToggle = (barrierId: string) => {
    setProfile((previous) => {
      const selected = previous.barrierIds.includes(barrierId)
      if (!selected && previous.barrierIds.length >= MAX_PROFILE_SELECTIONS) {
        return previous
      }

      return {
        ...previous,
        barrierNone: false,
        barrierIds: selected
          ? previous.barrierIds.filter((id) => id !== barrierId)
          : [...previous.barrierIds, barrierId],
      }
    })
  }

  const handleBarrierNone = () => {
    setProfile((previous) => ({
      ...previous,
      barrierNone: !previous.barrierNone,
      barrierIds: [],
    }))
  }

  const handleCertificationToggle = (certificationId: string) => {
    setProfile((previous) => {
      const selected = previous.certificationIds.includes(certificationId)
      const otherSelectionCount = previous.certificationOther.trim() ? 1 : 0
      if (
        !selected &&
        previous.certificationIds.length + otherSelectionCount >=
          MAX_PROFILE_SELECTIONS
      ) {
        return previous
      }

      return {
        ...previous,
        certificationNone: false,
        certificationIds: selected
          ? previous.certificationIds.filter((id) => id !== certificationId)
          : [...previous.certificationIds, certificationId],
      }
    })
  }

  const handleCertificationNone = () => {
    setProfile((previous) => ({
      ...previous,
      certificationNone: !previous.certificationNone,
      certificationIds: [],
      certificationOther: '',
    }))
  }

  const handleCertificationOtherChange = (value: string) => {
    setProfile((previous) => {
      const addsOtherSelection =
        previous.certificationOther.trim().length === 0 &&
        value.trim().length > 0

      if (
        addsOtherSelection &&
        previous.certificationIds.length >= MAX_PROFILE_SELECTIONS
      ) {
        return previous
      }

      return {
        ...previous,
        certificationNone:
          value.trim().length > 0 ? false : previous.certificationNone,
        certificationOther: value,
      }
    })
  }

  const handleProfileComplete = () => {
    const profileSnapshot: ProfileDraft =
      profile.ageBand === null
        ? { ...profile, ageBand: 'prefer-not-to-answer' }
        : profile
    const profileKey = getProfileKey(profileSnapshot)

    if (profileSnapshot !== profile) {
      setProfile(profileSnapshot)
    }

    if (questions.length > 0 && loadedProfileKey === profileKey) {
      setTransitionState({ kind: 'idle' })
      goToPage('P4')
      return
    }

    void loadQuestions(profileSnapshot)
  }

  const handleQuestionAnswer = (
    questionId: string,
    response: TraitResponseCode,
  ) => {
    const wasComplete = questions.every((question) => responses[question.id])
    const wasAnswered = Boolean(responses[questionId])
    const nextResponses = { ...responses, [questionId]: response }
    const questionIndex = questions.findIndex(
      (question) => question.id === questionId,
    )

    setResponses(nextResponses)

    if (
      !wasAnswered &&
      questionIndex === revealedQuestionCount - 1 &&
      revealedQuestionCount < questions.length
    ) {
      setRevealedQuestionCount((count) => Math.min(count + 1, questions.length))
    }

    const isComplete = questions.every(
      (question) => nextResponses[question.id],
    )
    if (!wasComplete && isComplete) {
      void loadRecommendations(nextResponses)
    }
  }

  const handleTogglePick = (jobCode: string) => {
    setPickedJobCodes((previous) => {
      if (previous.includes(jobCode)) {
        return previous.filter((code) => code !== jobCode)
      }

      if (previous.length >= MAX_PICKED_JOBS) return previous
      return [...previous, jobCode]
    })
  }

  const handleMovePick = (jobCode: string, direction: 'up' | 'down') => {
    setPickedJobCodes((previous) => {
      const index = previous.indexOf(jobCode)
      const targetIndex = direction === 'up' ? index - 1 : index + 1
      if (index < 0 || targetIndex < 0 || targetIndex >= previous.length) {
        return previous
      }

      const next = [...previous]
      ;[next[index], next[targetIndex]] = [next[targetIndex], next[index]]
      return next
    })
  }

  const retryTransition = () => {
    if (transitionState.kind !== 'error') return

    if (transitionState.target === 'questions') {
      void loadQuestions()
    } else {
      void loadRecommendations(responses)
    }
  }

  const pickedRecommendations = pickedJobCodes
    .map((jobCode) =>
      recommendations.find(
        (recommendation) => recommendation.jobCode === jobCode,
      ),
    )
    .filter((recommendation): recommendation is Recommendation =>
      Boolean(recommendation),
    )

  const certificationLabels = profile.certificationIds.map(
    getCertificationLabel,
  )

  let pageContent

  if (transitionState.kind !== 'idle') {
    pageContent = (
      <FlowStatus
        state={transitionState}
        onRetry={retryTransition}
        onReviewAnswers={() => {
          setTransitionState({ kind: 'idle' })
          goToPage('P4')
        }}
        onReviewProfile={() => {
          setTransitionState({ kind: 'idle' })
          goToProfileStep('certifications')
        }}
        onHelp={() => setShowHelpModal(true)}
      />
    )
  } else {
    switch (currentPage) {
      case 'P1':
        pageContent = (
          <StartPage
            onStart={() => resetSession('P2')}
            onHelp={() => setShowHelpModal(true)}
          />
        )
        break
      case 'P2':
        pageContent = (
          <AgeSelectionPage
            value={profile.ageBand}
            onChange={handleAgeBandChange}
            onNext={() => goToProfileStep('barriers')}
            onHelp={() => setShowHelpModal(true)}
          />
        )
        break
      case 'P3':
        pageContent =
          profileStep === 'barriers' ? (
            <BarrierSelectionPage
              selectedIds={profile.barrierIds}
              noneSelected={profile.barrierNone}
              selectionLimit={MAX_PROFILE_SELECTIONS}
              onToggle={handleBarrierToggle}
              onNone={handleBarrierNone}
              onNext={() => goToProfileStep('certifications')}
              onPrev={() => goToPage('P2')}
              onHelp={() => setShowHelpModal(true)}
            />
          ) : (
            <BasicInfoPage
              profile={profile}
              mode="certifications"
              onBarrierToggle={handleBarrierToggle}
              onBarrierNone={handleBarrierNone}
              onCertificationToggle={handleCertificationToggle}
              onCertificationNone={handleCertificationNone}
              onCertificationOtherChange={handleCertificationOtherChange}
              onNext={handleProfileComplete}
              onPrev={() => goToProfileStep('barriers')}
              onHelp={() => setShowHelpModal(true)}
            />
          )
        break
      case 'P4':
        pageContent = (
          <QuestionPage
            questions={questions}
            responses={responses}
            revealedCount={revealedQuestionCount}
            showRecommendationAction={recommendations.length > 0}
            onAnswer={handleQuestionAnswer}
            onContinue={() => void loadRecommendations(responses)}
            onPrev={() => goToProfileStep('certifications')}
            onHelp={() => setShowHelpModal(true)}
          />
        )
        break
      case 'P5':
        pageContent = (
          <ResultPage
            recommendations={recommendations}
            pickedJobCodes={pickedJobCodes}
            onTogglePick={handleTogglePick}
            onMovePick={handleMovePick}
            onComplete={() => goToPage('P6')}
            onPrev={() => goToPage('P4')}
            onHelp={() => setShowHelpModal(true)}
          />
        )
        break
      case 'P6':
        pageContent = (
          <ApplicationGuidePage
            pickedRecommendations={pickedRecommendations}
            certificationLabels={certificationLabels}
            onPrev={() => goToPage('P5')}
            onFinish={() => resetSession('P1')}
            onHelp={() => setShowHelpModal(true)}
          />
        )
        break
    }
  }

  return (
    <>
      {pageContent}
      <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
    </>
  )
}

export default App
