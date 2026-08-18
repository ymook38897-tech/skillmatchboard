import { useEffect, useState } from 'react'
import avoidIcon from '../assets/icons/questions-final/avoid.svg'
import folderBackground from '../assets/icons/questions-final/folder.svg'
import likeIcon from '../assets/icons/questions-final/like.svg'
import neutralIcon from '../assets/icons/questions-final/neutral.svg'
import nextIcon from '../assets/icons/questions-final/next.svg'
import nextCardIcon from '../assets/icons/questions-final/next-card.svg'
import previousIcon from '../assets/icons/questions-final/previous.svg'
import previousCardIcon from '../assets/icons/questions-final/previous-card.svg'
import staffHeadsetIcon from '../assets/icons/questions-final/staff-headset.svg'
import type {
  TraitQuestion,
  TraitResponseCode,
  TraitResponseMap,
} from '../types/flow'

interface QuestionPageProps {
  questions: TraitQuestion[]
  responses: TraitResponseMap
  onAnswer: (questionId: string, response: TraitResponseCode) => void
  onComplete: () => void
  onHelp: () => void
}

const ANSWER_OPTIONS = [
  {
    code: 'agree',
    label: '좋아요',
    icon: likeIcon,
    selectedClass: 'border-[#5D776F] bg-[#E5F0EB] text-[#38564E]',
  },
  {
    code: 'unsure',
    label: '상관없어요',
    icon: neutralIcon,
    selectedClass: 'border-[#7C8984] bg-[#EDF1EF] text-[#61716B]',
  },
  {
    code: 'disagree',
    label: '피하고 싶어요',
    icon: avoidIcon,
    selectedClass: 'border-[#B14F3E] bg-[#F7E6E1] text-[#B14F3E]',
  },
] as const satisfies readonly {
  code: TraitResponseCode
  label: string
  icon: string
  selectedClass: string
}[]

export function QuestionPage({
  questions,
  responses,
  onAnswer,
  onComplete,
  onHelp,
}: QuestionPageProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentQuestion = questions[currentIndex]
  const previousQuestion = questions[currentIndex - 1]
  const nextQuestion = questions[currentIndex + 1]
  const selectedResponse = currentQuestion
    ? responses[currentQuestion.id]
    : undefined

  useEffect(() => {
    if (currentIndex >= questions.length) {
      setCurrentIndex(Math.max(questions.length - 1, 0))
    }
  }, [currentIndex, questions.length])

  const moveToQuestion = (nextIndex: number) => {
    setCurrentIndex(nextIndex)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNext = () => {
    if (!selectedResponse) return
    if (currentIndex === questions.length - 1) {
      onComplete()
      return
    }
    moveToQuestion(currentIndex + 1)
  }

  if (!currentQuestion) return null

  return (
    <div className="v6-entry-page relative min-h-[max(100svh,1280px)] overflow-x-hidden rounded-[clamp(20px,3.75vw,30px)] bg-[linear-gradient(102.244deg,#FFFDF9_0%,#EDF4F0_103.09%)] text-[#171C1A] shadow-[0_8px_24px_rgba(37,50,45,0.13)]">
      <div className="relative mx-auto min-h-[max(100svh,1280px)] w-full max-w-[800px]">
        <header className="absolute inset-x-0 top-0 z-20 h-[clamp(96px,14.5vw,116px)] bg-[rgba(255,255,255,0.72)] shadow-[0_8px_24px_rgba(37,50,45,0.13)] backdrop-blur-[9px]">
          <div className="absolute left-[clamp(16px,4.75vw,38px)] top-[clamp(14px,2.25vw,18px)] h-[clamp(66px,9.75vw,78px)] w-[clamp(150px,45vw,360px)]">
            <p className="h-[34px] whitespace-pre-wrap text-[clamp(17px,2.75vw,22px)] font-bold leading-[normal] text-[#4D7A9E]">
              확인 질문&nbsp;&nbsp;{currentIndex + 1} / {questions.length}
            </p>
            <div className="absolute inset-x-0 top-[clamp(43px,6.375vw,51px)] h-[clamp(8px,1.25vw,10px)] overflow-hidden rounded-full bg-[#D9E3E0]">
              <div
                className="h-full rounded-full bg-[#4D7A9E] transition-[width] duration-200 motion-reduce:transition-none"
                style={{
                  width: `${((currentIndex + 1) / questions.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={onHelp}
            className="absolute right-[clamp(8px,3.5vw,28px)] top-[clamp(12px,2.5vw,20px)] flex h-[clamp(68px,9.5vw,76px)] w-[clamp(140px,28vw,224px)] items-center justify-center gap-[clamp(7px,1.5vw,12px)] rounded-[clamp(17px,2.375vw,19px)] border-[1.5px] border-[#5D776F] bg-[rgba(255,255,255,0.78)] text-[clamp(17px,3.125vw,25px)] font-bold leading-[normal] text-[#38564E] shadow-[0_8px_12px_rgba(37,50,45,0.14)] backdrop-blur-[9px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#5E7E72] focus-visible:ring-offset-4"
          >
            <img
              src={staffHeadsetIcon}
              alt=""
              aria-hidden="true"
              className="size-[clamp(28px,4.75vw,38px)]"
            />
            <span className="whitespace-nowrap">직원 상담</span>
          </button>
        </header>

        <section
          aria-hidden={!previousQuestion}
          className={`absolute left-[clamp(24px,6.75vw,54px)] right-[clamp(24px,6.75vw,54px)] top-[clamp(150px,21.75vw,174px)] h-[174px] rounded-[20px] border-[1.5px] border-[#CED8D3] bg-[rgba(255,255,255,0.32)] px-[26px] py-[16px] text-[#61716B] ${previousQuestion ? '' : 'invisible'}`}
        >
          <p className="text-[21px] font-bold leading-[normal]">
            {String(currentIndex).padStart(2, '0')}
          </p>
          <p className="mt-[18px] max-w-[540px] text-[22px] font-bold leading-[1.35]">
            {previousQuestion?.statement}
          </p>
          <img
            src={previousCardIcon}
            alt=""
            aria-hidden="true"
            className="absolute right-[20px] top-[86px] h-[24px] w-[34px]"
          />
        </section>

        <section
          aria-labelledby={`${currentQuestion.id}-title`}
          className="absolute left-[clamp(12px,3vw,24px)] right-[clamp(12px,3vw,24px)] top-[clamp(270px,36vw,288px)] z-10 h-[626px]"
        >
          <img
            src={folderBackground}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 size-full"
          />
          <span className="absolute left-[18px] top-[2px] flex h-[50px] w-[78px] items-center justify-center text-[clamp(19px,2.875vw,23px)] font-bold leading-none">
            {String(currentIndex + 1).padStart(2, '0')}
          </span>
          <h1
            id={`${currentQuestion.id}-title`}
            className="absolute left-[clamp(22px,4.5vw,36px)] right-[clamp(22px,4.5vw,36px)] top-[72px] whitespace-pre-line text-[clamp(24px,4.25vw,34px)] font-extrabold leading-[1.18]"
          >
            {currentQuestion.statement}
          </h1>
          <p className="absolute left-[clamp(22px,4.5vw,36px)] right-[22px] top-[182px] text-[clamp(18px,2.75vw,22px)] font-bold leading-[normal] text-[#38564E]">
            가장 가까운 답을 골라주세요
          </p>

          <div className="absolute left-[clamp(18px,6.5vw,52px)] right-[clamp(18px,6.5vw,52px)] top-[244px] grid grid-cols-3 gap-[clamp(8px,3.375vw,27px)]">
            {ANSWER_OPTIONS.map((option) => {
              const selected = selectedResponse === option.code
              return (
                <button
                  key={option.code}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onAnswer(currentQuestion.id, option.code)}
                  className={`flex h-[202px] min-w-0 flex-col items-center rounded-[18px] border-[1.5px] bg-[rgba(255,255,255,0.74)] px-1 pt-[26px] text-[clamp(16px,2.625vw,21px)] font-bold leading-[normal] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4D7A9E] focus-visible:ring-offset-3 ${
                    selected
                      ? `border-2 ${option.selectedClass}`
                      : 'border-[#CED8D3] text-[#38564E]'
                  }`}
                >
                  <img
                    src={option.icon}
                    alt=""
                    aria-hidden="true"
                    className="size-[clamp(66px,11.25vw,90px)]"
                  />
                  <span className="mt-[36px] whitespace-nowrap">
                    {option.label}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="absolute bottom-[36px] left-[clamp(18px,4.25vw,34px)] right-[clamp(18px,4.25vw,34px)] grid h-[84px] grid-cols-[minmax(0,0.36fr)_minmax(0,0.64fr)] gap-[18px]">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => moveToQuestion(currentIndex - 1)}
              className="flex min-w-0 items-center justify-center rounded-[24px] border-2 border-[#597A70] bg-[#FFFEFA] text-[clamp(20px,3.375vw,27px)] font-bold text-[#213830] shadow-[0_8px_12px_rgba(37,50,45,0.10)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4D7A9E] focus-visible:ring-offset-3 disabled:border-[#CED8D3] disabled:text-[#9AA5A1] disabled:shadow-none"
            >
              <img
                src={previousIcon}
                alt=""
                aria-hidden="true"
                className="mr-[clamp(7px,2vw,16px)] size-[clamp(26px,4vw,32px)] opacity-[inherit]"
              />
              <span className="whitespace-nowrap">이전 질문</span>
            </button>
            <button
              type="button"
              disabled={!selectedResponse}
              onClick={handleNext}
              className={`flex min-w-0 items-center justify-center rounded-[22px] border-0 text-[clamp(22px,3.5vw,28px)] font-bold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4D7A9E] focus-visible:ring-offset-3 ${
                selectedResponse
                  ? 'bg-[linear-gradient(90deg,#486D92_0%,#71B48F_100%)] text-white shadow-[0_8px_12px_rgba(37,50,45,0.14)]'
                  : 'bg-[#E6EAE8] text-[#7C8984] shadow-none'
              }`}
            >
              <span className="whitespace-nowrap">다음 질문</span>
              <img
                src={nextIcon}
                alt=""
                aria-hidden="true"
                className={`ml-[clamp(8px,2vw,16px)] size-[clamp(26px,4vw,32px)] ${selectedResponse ? '' : 'opacity-40'}`}
              />
            </button>
          </div>
        </section>

        <section
          aria-hidden={!nextQuestion}
          className={`absolute left-[clamp(24px,6.75vw,54px)] right-[clamp(24px,6.75vw,54px)] top-[948px] h-[190px] rounded-[20px] border-[1.5px] border-[#CED8D3] bg-[rgba(255,255,255,0.30)] px-[26px] py-[16px] text-[#61716B] ${nextQuestion ? '' : 'invisible'}`}
        >
          <p className="text-[21px] font-bold leading-[normal]">
            {String(currentIndex + 2).padStart(2, '0')}
          </p>
          <p className="mt-[18px] max-w-[540px] text-[22px] font-bold leading-[1.35]">
            {nextQuestion?.statement}
          </p>
          <img
            src={nextCardIcon}
            alt=""
            aria-hidden="true"
            className="absolute right-[20px] top-[86px] h-[24px] w-[34px]"
          />
        </section>
      </div>
    </div>
  )
}
