import { useState } from 'react'
import type { VoiceQuestionId, VoiceInterviewAnswers, VoiceJob, VoiceFlowStep } from './types/flow'
import { VOICE_QUESTIONS, MOCK_ANSWERS } from './data/voiceQuestions'
import { StartPage } from './pages/StartPage'
import { TutorialPage } from './pages/TutorialPage'
import { VoiceQuestionPage } from './pages/VoiceQuestionPage'
import { AnswerReviewPage } from './pages/AnswerReviewPage'
import { JobRecommendationPage } from './pages/JobRecommendationPage'
import { ResumeGenerationPage } from './pages/ResumeGenerationPage'
import { HelpModal } from './components/common/HelpModal'

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
  const [selectedJobs, setSelectedJobs] = useState<VoiceJob[]>([])
  const [currentQuestionOrder, setCurrentQuestionOrder] = useState(1)
  const [editingQuestionId, setEditingQuestionId] = useState<VoiceQuestionId | null>(null)
  const [showHelpModal, setShowHelpModal] = useState(false)

  const currentQuestion = VOICE_QUESTIONS.find((q) => q.order === currentQuestionOrder)
  const totalQuestions = VOICE_QUESTIONS.length

  // Navigation handlers
  const goToStep = (step: VoiceFlowStep) => {
    setCurrentStep(step)
  }

  const goToQuestionOrder = (order: number) => {
    setCurrentQuestionOrder(Math.max(1, Math.min(totalQuestions, order)))
  }

  const handleAnswerChange = (questionId: VoiceQuestionId, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const handleStartTutorial = () => {
    goToStep('tutorial')
  }

  const handleTutorialNext = () => {
    goToStep('voice-question')
    goToQuestionOrder(1)
  }

  const handleTutorialPrev = () => {
    goToStep('start')
  }

  const handleVoiceQuestionNext = () => {
    if (currentQuestionOrder < totalQuestions) {
      goToQuestionOrder(currentQuestionOrder + 1)
    } else {
      goToStep('answer-review')
    }
  }

  const handleVoiceQuestionPrev = () => {
    if (currentQuestionOrder > 1) {
      goToQuestionOrder(currentQuestionOrder - 1)
    }
  }

  const handleEditAnswer = (questionId: VoiceQuestionId) => {
    const question = VOICE_QUESTIONS.find((q) => q.id === questionId)
    if (question) {
      setCurrentQuestionOrder(question.order)
      setEditingQuestionId(questionId)
      goToStep('voice-question')
    }
  }

  const handleAnswerReviewNext = () => {
    goToStep('job-recommendation')
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
    setAnswers(createInitialAnswers())
    setSelectedJobs([])
    setCurrentQuestionOrder(1)
    setEditingQuestionId(null)
  }

  return (
    <>
      {currentStep === 'start' && (
        <StartPage
          onStart={handleStartTutorial}
          onHelp={() => setShowHelpModal(true)}
        />
      )}

      {currentStep === 'tutorial' && (
        <TutorialPage
          onNext={handleTutorialNext}
          onPrev={handleTutorialPrev}
          onHelp={() => setShowHelpModal(true)}
        />
      )}

      {currentStep === 'voice-question' && currentQuestion && (
        <VoiceQuestionPage
          questionId={currentQuestion.id as VoiceQuestionId}
          answers={answers}
          onAnswerChange={handleAnswerChange}
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
        />
      )}

      {currentStep === 'answer-review' && (
        <AnswerReviewPage
          answers={answers}
          onEdit={handleEditAnswer}
          onNext={handleAnswerReviewNext}
          onPrev={handleAnswerReviewPrev}
        />
      )}

      {currentStep === 'job-recommendation' && (
        <JobRecommendationPage
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

      {showHelpModal && (
        <HelpModal
          isOpen={showHelpModal}
          onClose={() => setShowHelpModal(false)}
        />
      )}
    </>
  )
}

export default App
