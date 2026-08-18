import chooseWorkIcon from '../assets/icons/p1/choose-work.svg'
import nextIcon from '../assets/icons/p1/next.svg'
import previousIcon from '../assets/icons/p1/previous.svg'
import shortQuestionsIcon from '../assets/icons/p1/short-questions.svg'
import showResultIcon from '../assets/icons/p1/show-result.svg'
import staffHeadsetIcon from '../assets/icons/p1/staff-headset.svg'
import { Button } from '../components/common/Button'

interface TutorialPageProps {
  onNext: () => void
  onPrev: () => void
  onHelp: () => void
}

const GUIDE_STEPS = [
  {
    icon: chooseWorkIcon,
    text: '해본 일과 어려운 일을 골라요',
  },
  {
    icon: shortQuestionsIcon,
    text: 'AI가 만든 질문에 답장해요',
  },
  {
    icon: showResultIcon,
    text: '결과를 상담원에게 보여주세요',
  },
] as const

export function TutorialPage({
  onNext,
  onPrev,
  onHelp,
}: TutorialPageProps) {
  return (
    <div className="v6-entry-page relative min-h-[max(100svh,800px)] overflow-x-hidden rounded-[clamp(20px,3.75vw,30px)] bg-[linear-gradient(102.244deg,#FFFDF9_0%,#EDF4F0_103.09%)] pb-[clamp(108px,15.5vw,124px)] text-[#171C1A] shadow-[0_8px_24px_rgba(37,50,45,0.13)]">
      <header className="h-[clamp(96px,14.5vw,116px)] bg-[rgba(255,255,255,0.72)] shadow-[0_8px_24px_rgba(37,50,45,0.13)] backdrop-blur-[9px]">
        <div className="relative mx-auto h-full w-full max-w-[800px]">
          <button
            type="button"
            onClick={onHelp}
            className="absolute right-[clamp(16px,3.5vw,28px)] top-[clamp(12px,2.5vw,20px)] flex h-[clamp(68px,9.5vw,76px)] w-[clamp(190px,28vw,224px)] items-center justify-center gap-[clamp(9px,1.5vw,12px)] rounded-[clamp(17px,2.375vw,19px)] border-[1.5px] border-[#5D776F] bg-[rgba(255,255,255,0.78)] text-[clamp(21px,3.125vw,25px)] font-bold leading-[normal] text-[#38564E] shadow-[0_8px_12px_rgba(37,50,45,0.14)] backdrop-blur-[9px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#5E7E72] focus-visible:ring-offset-4 focus-visible:ring-offset-[#FFFDF9]"
          >
            <img
              src={staffHeadsetIcon}
              alt=""
              aria-hidden="true"
              className="size-[clamp(34px,4.75vw,38px)]"
            />
            <span>직원 상담</span>
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[800px] px-[clamp(24px,6vw,48px)] pt-[clamp(28px,5vw,40px)]">
        <h1 className="text-[clamp(34px,5.25vw,42px)] font-extrabold leading-[normal]">
          상담 전에 이렇게 준비해요
        </h1>
        <p className="mt-[clamp(10px,1.75vw,14px)] text-[clamp(22px,4vw,32px)] font-bold leading-[normal] text-[#61716B]">
          약 3~5분 · 언제든 직원에게 도움을 받을 수 있어요
        </p>

        <ol className="mt-[clamp(24px,4.75vw,38px)] flex flex-col gap-[clamp(20px,4.5vw,36px)]">
          {GUIDE_STEPS.map((step, index) => (
            <li
              key={step.text}
              className="relative min-h-[clamp(148px,23vw,184px)] rounded-[clamp(20px,3vw,24px)] border-[1.5px] border-[#CED8D3] bg-[rgba(255,255,255,0.82)] shadow-[0_8px_24px_rgba(37,50,45,0.13)] backdrop-blur-[9px]"
            >
              <span className="absolute left-[clamp(14px,2.8125vw,22.5px)] top-1/2 flex size-[clamp(58px,8.75vw,70px)] -translate-y-1/2 items-center justify-center rounded-full bg-[#DCEAE4] text-[clamp(24px,3.5vw,28px)] font-bold leading-[normal] text-[#38564E]">
                {index + 1}
              </span>
              <img
                src={step.icon}
                alt=""
                aria-hidden="true"
                className="absolute left-[clamp(78px,13.8125vw,110.5px)] top-1/2 size-[clamp(48px,7.5vw,60px)] -translate-y-1/2"
              />
              <span className="absolute bottom-0 left-[clamp(138px,23.5625vw,188.5px)] right-[clamp(14px,3vw,24px)] top-0 flex items-center text-[clamp(24px,4.5vw,36px)] font-bold leading-[1.35]">
                {step.text}
              </span>
            </li>
          ))}
        </ol>
      </main>

      <footer className="fixed inset-x-0 bottom-0 z-20 h-[clamp(108px,15.5vw,124px)] bg-[rgba(255,255,255,0.78)] px-[clamp(16px,3vw,24px)] py-[clamp(14px,2.75vw,22px)] shadow-[0_-5px_18px_rgba(37,50,45,0.10)] backdrop-blur-[9px]">
        <div className="mx-auto grid h-full w-full max-w-[752px] grid-cols-[minmax(0,0.759615fr)_minmax(0,1fr)] gap-[clamp(12px,2.5vw,20px)]">
          <Button
            type="button"
            variant="outline"
            size="xl"
            onClick={onPrev}
            className="!h-full !min-h-0 !rounded-[clamp(16px,2.25vw,18px)] !border-[1.5px] !border-[#CED8D3] !bg-[rgba(255,255,255,0.88)] !px-0 !py-0 !text-[clamp(23px,3.375vw,27px)] !font-bold !leading-[normal] !text-[#38564E]"
          >
            <img
              src={previousIcon}
              alt=""
              aria-hidden="true"
              className="mr-[clamp(8px,1.5vw,12px)] size-[clamp(30px,4.5vw,36px)]"
            />
            이전
          </Button>
          <Button
            type="button"
            variant="primary"
            size="xl"
            onClick={onNext}
            className="!h-full !min-h-0 !rounded-[clamp(16px,2.25vw,18px)] !border-0 !bg-[linear-gradient(90deg,#486D92_0%,#71B48F_100%)] !px-0 !py-0 !text-[clamp(23px,3.375vw,27px)] !font-bold !leading-[normal] !shadow-[0_8px_24px_rgba(37,50,45,0.13)]"
          >
            다음
            <img
              src={nextIcon}
              alt=""
              aria-hidden="true"
              className="ml-[clamp(8px,1.5vw,12px)] size-[clamp(30px,4.5vw,36px)]"
            />
          </Button>
        </div>
      </footer>
    </div>
  )
}
