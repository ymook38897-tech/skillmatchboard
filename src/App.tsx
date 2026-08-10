import { useCallback, useEffect, useRef, useState } from 'react'
import {
  UserFormData,
  AgeGroup,
  Gender,
  QuestionId,
  QuestionOptionId,
  Result,
  QuestionProcessingStatus,
  QuestionProcessingError,
  QuestionProcessingErrorCode,
} from './types'
import { QUESTIONS } from './data/questions'
import { StartPage } from './pages/StartPage'
import { BasicInfoPage } from './pages/BasicInfoPage'
import { JobCategoryPage } from './pages/JobCategoryPage'
import { QuestionPage } from './pages/QuestionPage'
import { ResultPage } from './pages/ResultPage'
import { LoadingPage } from './pages/LoadingPage'
import { HelpModal } from './components/common/HelpModal'
import { fetchJobs, logJobsApiError } from './services/jobsApi'
import { processQuestionAnswer, ProcessAnswerError } from './services/processAnswerApi'
import {
  mapNormalizedJobToResult,
  selectTemporaryJobs,
} from './utils/selectTemporaryJobs'

type Page = 'start' | 'basicInfo' | 'jobCategory' | 'question' | 'loading' | 'result'
type LoadingStatus = 'loading' | 'error'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('start')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [currentJobCategoryPage, setCurrentJobCategoryPage] = useState(0)
  const [results, setResults] = useState<Result[]>([])
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>('loading')
  const [questionProcessingStatus, setQuestionProcessingStatus] =
    useState<QuestionProcessingStatus>('idle')
  const [questionProcessingError, setQuestionProcessingError] =
    useState<QuestionProcessingError | null>(null)

  const jobsRequestControllerRef = useRef<AbortController | null>(null)
  const jobsRequestIdRef = useRef(0)
  const questionProcessingControllerRef = useRef<AbortController | null>(null)
  const questionProcessingRequestIdRef = useRef(0)

  useEffect(() => {
    return () => {
      jobsRequestIdRef.current += 1
      jobsRequestControllerRef.current?.abort()
      questionProcessingRequestIdRef.current += 1
      questionProcessingControllerRef.current?.abort()
    }
  }, [])

  const [formData, setFormData] = useState<UserFormData>({
    ageGroup: null,
    gender: null,
    jobCategories: [],
    jobCategoryUnknown: false,
    answers: QUESTIONS.map((q) => ({
      questionId: q.id,
      selectedOptionIds: [],
      isUnknown: false,
    })),
  })

  const resetBasicInfo = () => {
    setFormData((prev) => ({
      ...prev,
      ageGroup: null,
      gender: null,
    }))
  }

  // Start page handlers
  const handleStartClick = () => {
    resetBasicInfo()
    setCurrentPage('basicInfo')
  }

  // Basic info handlers
  const handleAgeGroupChange = (age: AgeGroup) => {
    setFormData((prev) => ({ ...prev, ageGroup: age }))
  }

  const handleGenderChange = (gender: Gender) => {
    setFormData((prev) => ({ ...prev, gender }))
  }

  const handleBasicInfoComplete = () => {
    window.scrollTo(0, 0)
    setCurrentPage('jobCategory')
  }

  const handleBasicInfoPrev = () => {
    window.scrollTo(0, 0)
    resetBasicInfo()
    setCurrentPage('start')
  }

  // Job category handlers
  const handleJobCategoryToggle = (category: string) => {
    setFormData((prev) => {
      if (prev.jobCategoryUnknown) return prev

      if (prev.jobCategories.includes(category)) {
        return {
          ...prev,
          jobCategories: prev.jobCategories.filter((id) => id !== category),
        }
      }

      if (prev.jobCategories.length >= 3) return prev

      return {
        ...prev,
        jobCategories: [...prev.jobCategories, category],
      }
    })
  }

  const handleJobCategoryUnknown = (unknown: boolean) => {
    setFormData((prev) => ({
      ...prev,
      jobCategoryUnknown: unknown,
      jobCategories: unknown ? [] : prev.jobCategories,
    }))
  }

  const handleJobCategoryNext = () => {
    window.scrollTo(0, 0)
    setCurrentPage('question')
    setCurrentQuestionIndex(0)
  }

  const handleJobCategoryPrev = () => {
    window.scrollTo(0, 0)
    resetBasicInfo()
    setCurrentPage('basicInfo')
  }

  // Question handlers
  const handleAnswerSelect = (
    questionId: QuestionId,
    optionId: QuestionOptionId,
  ) => {
    setFormData((prev) => ({
      ...prev,
      answers: prev.answers.map((answer) => {
        if (answer.questionId !== questionId) return answer

        const isSelected = answer.selectedOptionIds.includes(optionId)

        return {
          ...answer,
          selectedOptionIds: isSelected
            ? answer.selectedOptionIds.filter((id) => id !== optionId)
            : [...answer.selectedOptionIds, optionId],
          isUnknown: false,
        }
      }),
    }))
  }

  const handleUnknownToggle = (questionId: QuestionId) => {
    setFormData((prev) => ({
      ...prev,
      answers: prev.answers.map((answer) => {
        if (answer.questionId !== questionId) return answer

        const isUnknown = !answer.isUnknown

        return {
          ...answer,
          isUnknown,
          selectedOptionIds: isUnknown ? [] : answer.selectedOptionIds,
        }
      }),
    }))
  }

  const handleQuestionNext = useCallback(async () => {
    if (questionProcessingStatus !== 'idle') return

    const currentQIndex = currentQuestionIndex
    const currentAnswer = formData.answers.find(
      (a) => a.questionId === QUESTIONS[currentQIndex].id,
    )
    const isAnswered =
      currentAnswer &&
      (currentAnswer.selectedOptionIds.length > 0 || currentAnswer.isUnknown)

    if (!isAnswered) return

    const requestId = questionProcessingRequestIdRef.current + 1
    questionProcessingRequestIdRef.current = requestId

    questionProcessingControllerRef.current?.abort()
    const controller = new AbortController()
    questionProcessingControllerRef.current = controller

    setQuestionProcessingStatus('submitting')
    setQuestionProcessingError(null)

    const minDisplayTimeMs = 500
    const startTime = Date.now()

    try {
      await processQuestionAnswer(
        QUESTIONS[currentQIndex].id,
        formData,
        controller.signal,
      )

      if (
        controller.signal.aborted ||
        questionProcessingRequestIdRef.current !== requestId
      ) {
        return
      }

      const elapsedTime = Date.now() - startTime
      const remainingTime = Math.max(0, minDisplayTimeMs - elapsedTime)

      if (remainingTime > 0) {
        await new Promise((resolve) => window.setTimeout(resolve, remainingTime))
      }

      if (
        controller.signal.aborted ||
        questionProcessingRequestIdRef.current !== requestId
      ) {
        return
      }

      setQuestionProcessingStatus('idle')
      setCurrentQuestionIndex((prev) =>
        prev < QUESTIONS.length - 1 ? prev + 1 : prev,
      )
    } catch (error: unknown) {
      if (
        controller.signal.aborted ||
        questionProcessingRequestIdRef.current !== requestId
      ) {
        return
      }

      if (error instanceof ProcessAnswerError && error.code === 'ABORTED') {
        return
      }

      let errorCode: QuestionProcessingErrorCode = 'UNKNOWN'
      let userMessage = '알 수 없는 오류가 발생했어요. 다시 시도해주세요.'

      if (error instanceof ProcessAnswerError) {
        errorCode = error.code as Exclude<typeof error.code, 'ABORTED'>
        userMessage = error.userMessage
      } else {
        userMessage =
          error instanceof Error
            ? `${error.message}`
            : '알 수 없는 오류가 발생했어요. 다시 시도해주세요.'
      }

      setQuestionProcessingError({
        code: errorCode,
        userMessage,
        developerMessage:
          error instanceof Error ? error.message : '알 수 없는 오류',
      })

      setQuestionProcessingStatus('error')
    } finally {
      if (questionProcessingControllerRef.current === controller) {
        questionProcessingControllerRef.current = null
      }
    }
  }, [
    questionProcessingStatus,
    currentQuestionIndex,
    formData,
    questionProcessingRequestIdRef,
    questionProcessingControllerRef,
  ])

  const handleQuestionPrev = () => {
    if (questionProcessingStatus !== 'idle') return

    if (currentQuestionIndex === 0) {
      window.scrollTo(0, 0)
      setCurrentPage('jobCategory')
      setCurrentJobCategoryPage(0)
    } else {
      setCurrentQuestionIndex((prev) => (prev > 0 ? prev - 1 : prev))
    }
  }

  const handleRetryQuestionAnswer = () => {
    void handleQuestionNext()
  }

  const handleSelectAnswerAgain = () => {
    setQuestionProcessingStatus('idle')
    setQuestionProcessingError(null)
  }

  // Loading to result handlers
  const loadJobs = async () => {
    const requestId = jobsRequestIdRef.current + 1
    jobsRequestIdRef.current = requestId

    jobsRequestControllerRef.current?.abort()
    const controller = new AbortController()
    jobsRequestControllerRef.current = controller

    setLoadingStatus('loading')
    setCurrentPage('loading')

    try {
      const jobs = await fetchJobs(controller.signal)
      const temporaryResults = selectTemporaryJobs(jobs).map(
        mapNormalizedJobToResult,
      )

      if (controller.signal.aborted || jobsRequestIdRef.current !== requestId) {
        return
      }

      setResults(temporaryResults)
      setCurrentPage('result')
    } catch (error: unknown) {
      if (controller.signal.aborted || jobsRequestIdRef.current !== requestId) {
        return
      }

      logJobsApiError(error)
      setLoadingStatus('error')
    } finally {
      if (jobsRequestControllerRef.current === controller) {
        jobsRequestControllerRef.current = null
      }
    }
  }

  const handleResultConfirm = () => {
    if (jobsRequestControllerRef.current) return
    void loadJobs()
  }

  // Result handlers
  const handleReset = () => {
    setCurrentPage('start')
    setCurrentQuestionIndex(0)
    setCurrentJobCategoryPage(0)
    setResults([])
    setLoadingStatus('loading')
    setFormData({
      ageGroup: null,
      gender: null,
      jobCategories: [],
      jobCategoryUnknown: false,
      answers: QUESTIONS.map((q) => ({
        questionId: q.id,
        selectedOptionIds: [],
        isUnknown: false,
      })),
    })
  }

  return (
    <>
      {currentPage === 'start' && <StartPage onStart={handleStartClick} />}

      {currentPage === 'basicInfo' && (
        <BasicInfoPage
          selectedAgeGroup={formData.ageGroup}
          selectedGender={formData.gender}
          onAgeGroupChange={handleAgeGroupChange}
          onGenderChange={handleGenderChange}
          onNext={handleBasicInfoComplete}
          onPrev={handleBasicInfoPrev}
          onHelp={() => setShowHelpModal(true)}
        />
      )}

      {currentPage === 'jobCategory' && (
        <JobCategoryPage
          selectedJobCategories={formData.jobCategories}
          jobCategoryUnknown={formData.jobCategoryUnknown}
          onJobCategoryToggle={handleJobCategoryToggle}
          onJobCategoryUnknown={handleJobCategoryUnknown}
          onNext={handleJobCategoryNext}
          onPrev={handleJobCategoryPrev}
          currentPage={currentJobCategoryPage}
          onPageChange={setCurrentJobCategoryPage}
          onHelp={() => setShowHelpModal(true)}
        />
      )}

      {currentPage === 'question' && (
        <QuestionPage
          currentQuestionIndex={currentQuestionIndex}
          answers={formData.answers}
          onAnswerSelect={handleAnswerSelect}
          onUnknownToggle={handleUnknownToggle}
          onNext={handleQuestionNext}
          onPrev={handleQuestionPrev}
          onResultConfirm={handleResultConfirm}
          processingStatus={questionProcessingStatus}
          processingError={questionProcessingError}
          onRetryAnswer={handleRetryQuestionAnswer}
          onSelectAnswerAgain={handleSelectAnswerAgain}
          onHelp={() => setShowHelpModal(true)}
        />
      )}

      {currentPage === 'loading' && (
        <LoadingPage
          status={loadingStatus}
          onRetry={() => void loadJobs()}
        />
      )}

      {currentPage === 'result' && (
        <ResultPage results={results} onReset={handleReset} />
      )}

      <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
    </>
  )
}

export default App
