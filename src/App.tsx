import { useEffect, useRef, useState } from 'react'
import { UserFormData, AgeGroup, Gender, QuestionAnswer, Result } from './types'
import { QUESTIONS } from './data/questions'
import { StartPage } from './pages/StartPage'
import { BasicInfoPage } from './pages/BasicInfoPage'
import { JobCategoryPage } from './pages/JobCategoryPage'
import { QuestionPage } from './pages/QuestionPage'
import { ResultPage } from './pages/ResultPage'
import { LoadingPage } from './pages/LoadingPage'
import { HelpModal } from './components/common/HelpModal'
import { fetchJobs, logJobsApiError } from './services/jobsApi'
import {
  mapApiJobToResult,
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
  const jobsRequestControllerRef = useRef<AbortController | null>(null)
  const jobsRequestIdRef = useRef(0)

  useEffect(() => {
    return () => {
      jobsRequestIdRef.current += 1
      jobsRequestControllerRef.current?.abort()
    }
  }, [])

  const [formData, setFormData] = useState<UserFormData>({
    ageGroup: null,
    gender: null,
    jobCategories: [],
    jobCategoryUnknown: false,
    answers: QUESTIONS.map((q) => ({
      questionId: q.id,
      selectedOptionId: null,
      isUnknown: false,
    })),
  })

  // Start page handlers
  const handleStartClick = () => {
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
    setCurrentPage('basicInfo')
  }

  // Question handlers
  const handleAnswerSelect = (questionId: number, optionId: string) => {
    setFormData((prev) => ({
      ...prev,
      answers: prev.answers.map((a) =>
        a.questionId === questionId
          ? { ...a, selectedOptionId: optionId, isUnknown: false }
          : a
      ),
    }))
  }

  const handleUnknownToggle = (questionId: number) => {
    setFormData((prev) => ({
      ...prev,
      answers: prev.answers.map((a) =>
        a.questionId === questionId
          ? {
              ...a,
              isUnknown: !a.isUnknown,
              selectedOptionId: !a.isUnknown ? null : a.selectedOptionId,
            }
          : a
      ),
    }))
  }

  const handleQuestionNext = () => {
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handleQuestionPrev = () => {
    if (currentQuestionIndex === 0) {
      window.scrollTo(0, 0)
      setCurrentPage('jobCategory')
      setCurrentJobCategoryPage(0)
    } else {
      const questionIdsToReset = new Set(
        QUESTIONS.slice(currentQuestionIndex).map((question) => question.id)
      )
      setFormData((prev) => ({
        ...prev,
        answers: prev.answers.map((answer) =>
          questionIdsToReset.has(answer.questionId)
            ? { ...answer, selectedOptionId: null, isUnknown: false }
            : answer
        ),
      }))
      setCurrentQuestionIndex((prev) => prev - 1)
    }
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
      const temporaryResults = selectTemporaryJobs(jobs).map(mapApiJobToResult)

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

  const handleLoadingStart = () => {
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
        selectedOptionId: null,
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
          onLoadingStart={handleLoadingStart}
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
