import { useEffect, useRef, useState } from 'react'
import { HelpModal } from './components/common/HelpModal'
import { FlowStatus } from './components/flow/FlowStatus'
import {
  CERTIFICATION_CATEGORIES,
  getBarrierLabel,
  getCertificationLabel,
  type CertificationCategoryId,
} from './data/profileOptions'
import { EXPERIENCE_CATEGORIES } from './data/experienceOptions'
import {
  createInitialWorkPreferenceDraft,
  WORK_PREFERENCE_GROUPS,
  type WorkPreferenceDraft,
  type WorkPreferenceOptionId,
  type WorkPreferenceQuestionId,
} from './data/workPreferenceOptions'
import { AnswerReviewPage } from './pages/AnswerReviewPage'
import { BarrierSelectionPage } from './pages/BarrierSelectionPage'
import { CertificationSelectionPage } from './pages/CertificationSelectionPage'
import { CounselorResultPage } from './pages/CounselorResultPage'
import { ExperienceSelectionPage } from './pages/ExperienceSelectionPage'
import { JobCategoryPage, JOB_INTEREST_OPTIONS } from './pages/JobCategoryPage'
import { QuestionPage } from './pages/QuestionPage'
import { ResultIntroPage } from './pages/ResultIntroPage'
import { StartPage } from './pages/StartPage'
import {
  SummaryPreparationPage,
  type SummaryPreparationStatus,
} from './pages/SummaryPreparationPage'
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

type ProfileStep =
  | 'experiences'
  | 'barriers'
  | 'work-preferences'
  | 'job-interests'
  | 'certifications'
type BarrierDetailSelections = Record<string, string[]>
type QuestionStep = 'questions' | 'review'
type FinalFlowStep = 'summary' | 'intro'

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
  const [questions, setQuestions] = useState<TraitQuestion[]>([])
  const [loadedProfileKey, setLoadedProfileKey] = useState<string | null>(null)
  const [responses, setResponses] = useState<TraitResponseMap>({})
  const [questionStep, setQuestionStep] = useState<QuestionStep>('questions')
  const [finalFlowStep, setFinalFlowStep] =
    useState<FinalFlowStep>('summary')
  const [summaryStatus, setSummaryStatus] =
    useState<SummaryPreparationStatus>('loading')
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
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
    setProfileStep('experiences')
    setQuestions([])
    setLoadedProfileKey(null)
    setResponses({})
    setQuestionStep('questions')
    setFinalFlowStep('summary')
    setSummaryStatus('loading')
    setRecommendations([])
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
      setQuestionStep('questions')
      setRecommendations([])
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

  const prepareSummary = async (responseSnapshot: TraitResponseMap) => {
    requestIdRef.current += 1
    requestControllerRef.current?.abort()

    const controller = new AbortController()
    const requestId = requestIdRef.current
    requestControllerRef.current = controller

    setFinalFlowStep('summary')
    setSummaryStatus('loading')
    setRecommendations([])
    setTransitionState({ kind: 'idle' })
    goToPage('P5')

    try {
      const [loadedRecommendations] = await Promise.all([
        mockRecommendationDataSource.loadRecommendations(
          {
            profile,
            questions,
            responses: responseSnapshot,
          },
          controller.signal,
        ),
        new Promise<void>((resolve) => window.setTimeout(resolve, 1400)),
      ])

      if (!isCurrentRequest(requestId, controller)) return

      setRecommendations(loadedRecommendations)
      setFinalFlowStep('intro')
      window.scrollTo({ top: 0, behavior: 'auto' })
    } catch (error: unknown) {
      if (!isCurrentRequest(requestId, controller) || isAbortError(error)) return
      setSummaryStatus('failure')
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

    if (profile.ageBand === null) {
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
    setResponses((previous) => ({ ...previous, [questionId]: response }))
  }

  const handleQuestionComplete = () => {
    if (questions.every((question) => responses[question.id])) {
      setQuestionStep('review')
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }

  const retryTransition = () => {
    if (transitionState.kind !== 'error') return

    if (transitionState.target === 'questions') {
      void loadQuestions()
    } else {
      void prepareSummary(responses)
    }
  }

  const certificationLabels = profile.certificationIds.map(
    getCertificationLabel,
  )
  const experienceSummary = profile.experienceNone
    ? '없음'
    : profile.experienceCategoryIds.length > 0
      ? profile.experienceCategoryIds
          .map(
            (categoryId) =>
              EXPERIENCE_CATEGORIES.find(
                (category) => category.id === categoryId,
              )?.label ?? categoryId,
          )
          .join(' · ')
      : '선택하지 않음'
  const barrierSummary = profile.barrierNone
    ? '특별히 어려운 일은 없어요'
    : profile.barrierIds.length > 0
      ? profile.barrierIds.map(getBarrierLabel).join(' · ')
      : '선택하지 않음'
  const workPreferenceLabels = WORK_PREFERENCE_GROUPS.flatMap((group) => {
    const selectedId = workPreferences[group.id]
    if (!selectedId) return []

    const selectedOption = group.options.find(
      (option) => option.id === selectedId,
    )
    if (!selectedOption) return []

    if (group.id === 'commute') {
      return [
        selectedOption.id === 'any'
          ? '통근 거리 상관없어요'
          : `통근 ${selectedOption.label}`,
      ]
    }
    if (group.id === 'start-time') {
      if (selectedOption.id === 'now') return ['바로 시작']
      if (selectedOption.id === 'any') return ['시작 시기 상관없어요']
      return [`${selectedOption.label} 시작`]
    }
    if (group.id === 'priority') {
      return [
        selectedOption.id === 'any'
          ? '중요 조건 상관없어요'
          : `${selectedOption.label} 우선`,
      ]
    }
    return [
      selectedOption.id === 'any'
        ? '근무 시간 상관없어요'
        : selectedOption.label,
    ]
  })
  const workPreferenceSummary =
    workPreferenceLabels.length > 0
      ? workPreferenceLabels.join(' · ')
      : '선택하지 않음'
  const jobInterestSummary = jobCategoryUnknown
    ? '없음'
    : selectedJobCategories.length > 0
      ? selectedJobCategories
          .map(
            (categoryId) =>
              JOB_INTEREST_OPTIONS.find(
                (option) => option.id === categoryId,
              )?.label ?? categoryId,
          )
          .join(' · ')
      : '선택하지 않음'
  const certificationSummaryParts = [
    ...certificationLabels,
    ...(profile.certificationOther.trim()
      ? [profile.certificationOther.trim()]
      : []),
  ]
  const certificationSummary = profile.certificationNone
    ? '없음'
    : certificationSummaryParts.length > 0
      ? certificationSummaryParts.join(' · ')
      : '선택하지 않음'
  const counselorMemo = [
    profile.experienceNone
      ? '해본 작업은 없다고 답했어요.'
      : profile.experienceCategoryIds.length > 0
        ? `${experienceSummary} 경험이 있어요.`
        : '해본 작업을 선택하지 않았어요.',
    profile.barrierNone
      ? '특별히 어려운 일은 없다고 답했어요.'
      : profile.barrierIds.length > 0
        ? `${barrierSummary}은 상담에서 확인이 필요해요.`
        : '피하거나 확인할 조건을 선택하지 않았어요.',
    workPreferenceLabels.length > 0
      ? `원하는 근무 방식: ${workPreferenceSummary}`
      : '원하는 근무 방식을 선택하지 않았어요.',
  ]

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
        pageContent =
          questionStep === 'questions' ? (
            <QuestionPage
              questions={questions}
              responses={responses}
              onAnswer={handleQuestionAnswer}
              onComplete={handleQuestionComplete}
              onHelp={() => setShowHelpModal(true)}
            />
          ) : (
            <AnswerReviewPage
              experienceSummary={experienceSummary}
              barrierSummary={barrierSummary}
              workPreferenceSummary={workPreferenceSummary}
              jobInterestSummary={jobInterestSummary}
              certificationSummary={certificationSummary}
              onConfirm={() => void prepareSummary(responses)}
              onHelp={() => setShowHelpModal(true)}
            />
          )
        break
      case 'P5':
        pageContent =
          finalFlowStep === 'summary' ? (
            <SummaryPreparationPage
              status={summaryStatus}
              onRetry={() => void prepareSummary(responses)}
              onHelp={() => setShowHelpModal(true)}
            />
          ) : (
            <ResultIntroPage
              onNext={() => goToPage('P6')}
              onHelp={() => setShowHelpModal(true)}
            />
          )
        break
      case 'P6':
        pageContent = (
          <CounselorResultPage
            recommendations={recommendations}
            counselorMemo={counselorMemo}
            onRestart={() => resetSession('P1')}
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
