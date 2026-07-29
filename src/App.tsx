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

type Page = 'start' | 'basicInfo' | 'jobCategory' | 'question' | 'loading' | 'result'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('start')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [results, setResults] = useState<Result[]>([])

  const [formData, setFormData] = useState<UserFormData>({
    ageGroup: null,
    gender: null,
    jobCategory: null,
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

  const handleBasicInfoNext = () => {
    setCurrentPage('jobCategory')
  }

  const handleBasicInfoPrev = () => {
    setCurrentPage('start')
  }

  // Job category handlers
  const handleJobCategoryChange = (category: string | null) => {
    setFormData((prev) => ({
      ...prev,
      jobCategory: category,
      jobCategoryUnknown: false,
    }))
  }

  const handleJobCategoryUnknown = (unknown: boolean) => {
    setFormData((prev) => ({
      ...prev,
      jobCategoryUnknown: unknown,
      jobCategory: unknown ? null : prev.jobCategory,
    }))
  }

  const handleJobCategoryNext = () => {
    setCurrentPage('question')
    setCurrentQuestionIndex(0)
  }

  const handleJobCategoryPrev = () => {
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
      setCurrentPage('jobCategory')
    } else {
      // Delete all answers after current question
      const newAnswers = formData.answers.map((a) =>
        a.questionId > QUESTIONS[currentQuestionIndex - 1].id
          ? { ...a, selectedOptionId: null, isUnknown: false }
          : a
      )
      setFormData((prev) => ({ ...prev, answers: newAnswers }))
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  // Loading to result handlers
  const handleLoadingStart = () => {
    setCurrentPage('loading')
  }

  const handleLoadingComplete = () => {
    const generatedResults = generateResults(
      formData.jobCategory,
      formData.answers
    )
    setResults(generatedResults)
    setCurrentPage('result')
  }

  // Result handlers
  const handleReset = () => {
    setCurrentPage('start')
    setCurrentQuestionIndex(0)
    setFormData({
      ageGroup: null,
      gender: null,
      jobCategory: null,
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
          onNext={handleBasicInfoNext}
          onPrev={handleBasicInfoPrev}
        />
      )}

      {currentPage === 'jobCategory' && (
        <JobCategoryPage
          selectedJobCategory={formData.jobCategory}
          jobCategoryUnknown={formData.jobCategoryUnknown}
          onJobCategoryChange={handleJobCategoryChange}
          onJobCategoryUnknown={handleJobCategoryUnknown}
          onNext={handleJobCategoryNext}
          onPrev={handleJobCategoryPrev}
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
        />
      )}

      {currentPage === 'loading' && (
        <LoadingPage onComplete={handleLoadingComplete} />
      )}

      {currentPage === 'result' && (
        <ResultPage results={results} onReset={handleReset} />
      )}
    </>
  )
}

export default App
