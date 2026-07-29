import { useState } from 'react'
import { UserFormData, AgeGroup, Gender, QuestionAnswer, Result } from './types'
import { QUESTIONS } from './data/questions'
import { generateResults } from './data/mockResults'
import { StartPage } from './pages/StartPage'
import { BasicInfoPage } from './pages/BasicInfoPage'
import { JobCategoryPage } from './pages/JobCategoryPage'
import { QuestionPage } from './pages/QuestionPage'
import { ResultPage } from './pages/ResultPage'
import { LoadingPage } from './pages/LoadingPage'
import { HelpModal } from './components/common/HelpModal'

type Page = 'start' | 'basicInfo' | 'jobCategory' | 'question' | 'loading' | 'result'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('start')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [currentJobCategoryPage, setCurrentJobCategoryPage] = useState(0)
  const [results, setResults] = useState<Result[]>([])
  const [showHelpModal, setShowHelpModal] = useState(false)

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
  const handleLoadingStart = () => {
    setCurrentPage('loading')
  }

  const handleLoadingComplete = () => {
    const generatedResults = generateResults(
      formData.jobCategories,
      formData.answers
    )
    setResults(generatedResults)
    setCurrentPage('result')
  }

  // Result handlers
  const handleReset = () => {
    setCurrentPage('start')
    setCurrentQuestionIndex(0)
    setCurrentJobCategoryPage(0)
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
        <LoadingPage onComplete={handleLoadingComplete} />
      )}

      {currentPage === 'result' && (
        <ResultPage results={results} onReset={handleReset} />
      )}

      <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
    </>
  )
}

export default App
