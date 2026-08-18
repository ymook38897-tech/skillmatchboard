import { useEffect, useRef, useState } from 'react'
import { HelpModal } from './components/common/HelpModal'
import { FlowStatus } from './components/flow/FlowStatus'
import {
  CERTIFICATION_CATEGORIES,
  getCertificationLabel,
  type CertificationCategoryId,
} from './data/profileOptions'
import {
  createInitialWorkPreferenceDraft,
  type WorkPreferenceDraft,
  type WorkPreferenceOptionId,
  type WorkPreferenceQuestionId,
} from './data/workPreferenceOptions'
import { ApplicationGuidePage } from './pages/ApplicationGuidePage'
import { BarrierSelectionPage } from './pages/BarrierSelectionPage'
import { CertificationSelectionPage } from './pages/CertificationSelectionPage'
import { ExperienceSelectionPage } from './pages/ExperienceSelectionPage'
import { JobCategoryPage } from './pages/JobCategoryPage'
import { QuestionPage } from './pages/QuestionPage'
import { ResultPage } from './pages/ResultPage'
import { StartPage } from './pages/StartPage'
import { TutorialPage } from './pages/TutorialPage'
import { WorkPreferencePage } from './pages/WorkPreferencePage'
import { mockQuestionDataSource } from './services/questionDataSource'
import { mockRecommendationDataSource } from './services/recommendationDataSource'
import type {
  FlowPageId,
  FlowTransitionState,
  ExperienceCategoryId,
  ProfileDraft,
  Recommendation,
  TraitQuestion,
  TraitResponseCode,
  TraitResponseMap,
  TransitionTarget,
} from './types/flow'

const MAX_PROFILE_SELECTIONS = 5
const MAX_PICKED_JOBS = 3

type ProfileStep =
  | 'experiences'
  | 'barriers'
  | 'work-preferences'
  | 'job-interests'
  | 'certifications'
type BarrierDetailSelections = Record<string, string[]>

function createInitialProfile(): ProfileDraft {
  return {
    ageBand: null,
    experienceCategoryIds: [],
    experienceNone: false,
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
    experienceCategoryIds: [...profile.experienceCategoryIds].sort(),
    barrierIds: [...profile.barrierIds].sort(),
    certificationIds: [...profile.certificationIds].sort(),
  })
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

function App() {
  const [currentPage, setCurrentPage] = useState<FlowPageId>('P1')
  const [profileStep, setProfileStep] = useState<ProfileStep>('experiences')
  const [profile, setProfile] = useState<ProfileDraft>(createInitialProfile)
  const [barrierDetailSelections, setBarrierDetailSelections] =
    useState<BarrierDetailSelections>({})
  const [workPreferences, setWorkPreferences] =
    useState<WorkPreferenceDraft>(createInitialWorkPreferenceDraft)
  const [selectedJobCategories, setSelectedJobCategories] = useState<string[]>(
    [],
  )
  const [jobCategoryUnknown, setJobCategoryUnknown] = useState(false)
  const [jobCategoryPage, setJobCategoryPage] = useState(0)
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
    setBarrierDetailSelections({})
    setWorkPreferences(createInitialWorkPreferenceDraft())
    setSelectedJobCategories([])
    setJobCategoryUnknown(false)
    setJobCategoryPage(0)
    setProfileStep('experiences')
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

  const handleExperienceToggle = (categoryId: ExperienceCategoryId) => {
    setProfile((previous) => ({
      ...previous,
      experienceNone: false,
      experienceCategoryIds: previous.experienceCategoryIds.includes(categoryId)
        ? previous.experienceCategoryIds.filter((id) => id !== categoryId)
        : [...previous.experienceCategoryIds, categoryId],
    }))
  }

  const handleExperienceNone = () => {
    setProfile((previous) => ({
      ...previous,
      experienceNone: !previous.experienceNone,
      experienceCategoryIds: [],
    }))
  }

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

  const handleBarrierToggle = (barrierId: string) => {
    setProfile((previous) => {
      const selected = previous.barrierIds.includes(barrierId)

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
    setBarrierDetailSelections({})
    setProfile((previous) => ({
      ...previous,
      barrierNone: !previous.barrierNone,
      barrierIds: [],
    }))
  }

  const handleBarrierDetailApply = (
    barrierId: string,
    detailIds: string[],
  ) => {
    const uniqueDetailIds = [...new Set(detailIds)]
    const alreadySelected = profile.barrierIds.includes(barrierId)

    if (
      uniqueDetailIds.length > 0 &&
      !alreadySelected &&
      profile.barrierIds.length >= MAX_PROFILE_SELECTIONS
    ) {
      return
    }

    setBarrierDetailSelections((previous) => {
      if (uniqueDetailIds.length > 0) {
        return { ...previous, [barrierId]: uniqueDetailIds }
      }

      const next = { ...previous }
      delete next[barrierId]
      return next
    })

    setProfile((previous) => ({
      ...previous,
      barrierNone: false,
      barrierIds:
        uniqueDetailIds.length === 0
          ? previous.barrierIds.filter((id) => id !== barrierId)
          : previous.barrierIds.includes(barrierId)
            ? previous.barrierIds
            : [...previous.barrierIds, barrierId],
    }))
  }

  const handleWorkPreferenceChange = (
    questionId: WorkPreferenceQuestionId,
    optionId: WorkPreferenceOptionId,
  ) => {
    setWorkPreferences((previous) => ({
      ...previous,
      [questionId]: optionId,
    }))
  }

  const handleJobCategoryToggle = (categoryId: string) => {
    setJobCategoryUnknown(false)
    setSelectedJobCategories((previous) => {
      if (previous.includes(categoryId)) {
        return previous.filter((id) => id !== categoryId)
      }

      return previous.length >= 3 ? previous : [...previous, categoryId]
    })
  }

  const handleJobCategoryUnknown = (unknown: boolean) => {
    setJobCategoryUnknown(unknown)
    if (unknown) {
      setSelectedJobCategories([])
    }
  }

  const handleCertificationCategoryApply = (
    categoryId: CertificationCategoryId,
    certificationIds: string[],
  ) => {
    const category = CERTIFICATION_CATEGORIES.find(
      (candidate) => candidate.id === categoryId,
    )
    if (!category) return

    const allowedOptionIds = new Set<string>(
      category.options.map((option) => option.id),
    )
    const selectedIds = [...new Set(certificationIds)]
      .filter((id) => allowedOptionIds.has(id))
      .slice(0, 1)

    setProfile((previous) => {
      const outsideIds = previous.certificationIds.filter(
        (id) => !allowedOptionIds.has(id),
      )
      const otherSelectionCount = previous.certificationOther.trim() ? 1 : 0
      if (
        outsideIds.length + selectedIds.length + otherSelectionCount >
        MAX_PROFILE_SELECTIONS
      ) {
        return previous
      }

      return {
        ...previous,
        certificationNone:
          selectedIds.length > 0 ? false : previous.certificationNone,
        certificationIds: [...outsideIds, ...selectedIds],
        certificationOther:
          categoryId === 'other' ? '' : previous.certificationOther,
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
          <TutorialPage
            onNext={() => goToProfileStep('experiences')}
            onPrev={() => goToPage('P1')}
            onHelp={() => setShowHelpModal(true)}
          />
        )
        break
      case 'P3':
        pageContent =
          profileStep === 'experiences' ? (
            <ExperienceSelectionPage
              selectedIds={profile.experienceCategoryIds}
              noneSelected={profile.experienceNone}
              onToggle={handleExperienceToggle}
              onNone={handleExperienceNone}
              onNext={() => goToProfileStep('barriers')}
              onPrev={() => goToPage('P2')}
              onHelp={() => setShowHelpModal(true)}
            />
          ) : profileStep === 'barriers' ? (
            <BarrierSelectionPage
              selectedIds={profile.barrierIds}
              noneSelected={profile.barrierNone}
              onToggle={handleBarrierToggle}
              onNone={handleBarrierNone}
              onNext={() => goToProfileStep('work-preferences')}
              onPrev={() => goToProfileStep('experiences')}
              onHelp={() => setShowHelpModal(true)}
            />
          ) : profileStep === 'work-preferences' ? (
            <WorkPreferencePage
              value={workPreferences}
              onChange={handleWorkPreferenceChange}
              onNext={() => goToProfileStep('job-interests')}
              onPrev={() => goToProfileStep('barriers')}
              onHelp={() => setShowHelpModal(true)}
            />
          ) : profileStep === 'job-interests' ? (
            <JobCategoryPage
              selectedJobCategories={selectedJobCategories}
              jobCategoryUnknown={jobCategoryUnknown}
              onJobCategoryToggle={handleJobCategoryToggle}
              onJobCategoryUnknown={handleJobCategoryUnknown}
              onNext={() => goToProfileStep('certifications')}
              onPrev={() => goToProfileStep('work-preferences')}
              currentPage={jobCategoryPage}
              onPageChange={setJobCategoryPage}
              onHelp={() => setShowHelpModal(true)}
            />
          ) : (
            <CertificationSelectionPage
              selectedIds={profile.certificationIds}
              noneSelected={profile.certificationNone}
              otherValue={profile.certificationOther}
              selectionLimit={MAX_PROFILE_SELECTIONS}
              onApplyCategory={handleCertificationCategoryApply}
              onNone={handleCertificationNone}
              onNext={handleProfileComplete}
              onPrev={() => goToProfileStep('job-interests')}
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
      <HelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        variant={currentPage === 'P2' ? 'tutorial' : 'default'}
      />
    </>
  )
}

export default App
