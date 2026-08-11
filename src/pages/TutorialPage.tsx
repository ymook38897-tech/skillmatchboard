import { useState } from 'react'
import { Button } from '../components/common/Button'
import { TopBar } from '../components/common/TopBar'

interface TutorialPageProps {
  onNext: () => void
  onSkip: () => void
  onPrev: () => void
  onHelp: () => void
}

const GUIDE_SLIDES = [
  {
    title: '10개의 짧은 문장에 답하면 돼요',
  },
  {
    title: '판단하기 어려우면 잘 모르겠음을 눌러요',
  },
  {
    title: '마지막에 신청서에 적을 내용이 나와요',
  },
] as const

export function TutorialPage({
  onNext,
  onSkip,
  onPrev,
  onHelp,
}: TutorialPageProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const currentSlide = GUIDE_SLIDES[currentSlideIndex]
  const isLastSlide = currentSlideIndex === GUIDE_SLIDES.length - 1

  const handlePrev = () => {
    if (currentSlideIndex === 0) {
      onPrev()
      return
    }

    setCurrentSlideIndex((index) => index - 1)
  }

  const handleNext = () => {
    if (isLastSlide) {
      onNext()
      return
    }

    setCurrentSlideIndex((index) => index + 1)
  }

  return (
    <div className="v6-entry-page min-h-screen bg-[#FAF8F2] pb-36 text-[#0D0C0C]">
      <TopBar
        pageId="P2"
        progressLabel={`안내 ${currentSlideIndex + 1} / ${GUIDE_SLIDES.length}`}
        progressValue={
          ((currentSlideIndex + 1) / GUIDE_SLIDES.length) * 100
        }
        animateProgress={false}
        onHelp={onHelp}
      />
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 pb-40 pt-32">
        <h1 className="mb-5 text-[2.75rem] font-extrabold leading-[1.25]">
          이렇게 이용해요
        </h1>
        <p className="text-2xl leading-normal text-[#4D4B46]">
          세 가지만 기억하면 어렵지 않아요.
        </p>

        <section
          className="flex flex-1 items-center justify-center py-10 text-center"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="w-full rounded-2xl border-2 border-primary-200 bg-white px-8 py-14 sm:px-12">
            <p className="mb-8 text-xl leading-[1.5] text-[#4D4B46]">
              안내 {currentSlideIndex + 1}
            </p>
            <p className="text-[2.375rem] font-extrabold leading-[1.3]">
              {currentSlide.title}
            </p>
          </div>
        </section>
      </main>

      <footer className="fixed inset-x-0 bottom-0 border-t-2 border-primary-100 bg-[#FAF8F2] px-6 py-4">
        <div className="mx-auto grid max-w-5xl grid-cols-3 gap-4">
          <Button type="button" variant="outline" size="xl" onClick={handlePrev}>
            이전
          </Button>
          <Button type="button" variant="outline" size="xl" onClick={onSkip}>
            건너뛰기
          </Button>
          <Button type="button" variant="primary" size="xl" onClick={handleNext}>
            {isLastSlide ? '시작하기' : '다음'}
          </Button>
        </div>
      </footer>
    </div>
  )
}
