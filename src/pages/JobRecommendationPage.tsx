import { useState } from 'react'
import type { VoiceJob } from '../types/flow'
import { MOCK_RECOMMENDED_JOBS } from '../data/voiceJobs'

interface JobRecommendationPageProps {
  onSelectJobs: (selectedJobs: VoiceJob[]) => void
  onPrev: () => void
}

export function JobRecommendationPage({
  onSelectJobs,
}: JobRecommendationPageProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const MAX_SELECTION = 3

  const toggleJobSelection = (jobId: number) => {
    setSelectedIds((prev) => {
      if (prev.includes(jobId)) {
        return prev.filter((id) => id !== jobId)
      }
      if (prev.length < MAX_SELECTION) {
        return [...prev, jobId]
      }
      return prev
    })
  }

  const handleNext = () => {
    const selected = MOCK_RECOMMENDED_JOBS.filter((job) =>
      selectedIds.includes(job.id)
    )
    onSelectJobs(selected)
  }

  return (
    <div className="voice-flow-page min-h-[100svh] bg-[#EEF1F4]">
      <main className="relative mx-auto min-h-[100svh] w-full max-w-[800px] overflow-hidden bg-white px-[clamp(24px,6vw,48px)] pb-[clamp(152px,15svh,192px)] pt-[clamp(96px,14.45svh,185px)] sm:rounded-[24px]">
        <header className="text-center">
          <h1 className="text-[clamp(32px,5vw,40px)] font-extrabold leading-[1.28] tracking-[-0.035em] text-[#111827]">
            잘 맞는 직무를 선택해보세요
          </h1>
          <p className="mt-[clamp(38px,6.6svh,84px)] text-[clamp(20px,3.75vw,30px)] font-medium text-[#526077]">
            3개까지 선택할 수 있어요
          </p>
        </header>

        <section className="mt-[clamp(24px,2.5svh,32px)] space-y-3">
          {MOCK_RECOMMENDED_JOBS.map((job, index) => {
            const isSelected = selectedIds.includes(job.id)

            return (
              <button
                key={job.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => toggleJobSelection(job.id)}
                className={`flex min-h-[clamp(88px,9.7svh,124px)] w-full items-center gap-5 rounded-[8px] border-2 px-[clamp(18px,3.5vw,28px)] text-left transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#BFDBFE] ${
                  isSelected
                    ? 'border-[#2468F2] bg-[#F3F7FF]'
                    : 'border-[#D8DEE8] bg-white'
                }`}
              >
                <span
                  className={`flex size-[clamp(44px,7.25vw,58px)] shrink-0 items-center justify-center rounded-full text-[clamp(20px,3.5vw,28px)] font-extrabold ${
                    isSelected
                      ? 'bg-[#E1EBFF] text-[#2468F2]'
                      : 'bg-[#F1F3F6] text-[#667085]'
                  }`}
                >
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1 text-[clamp(20px,3.75vw,30px)] font-medium tracking-[-0.025em] text-[#111827]">
                  {job.name}
                </span>
                <span
                  aria-hidden="true"
                  className={`flex size-[clamp(28px,4.5vw,36px)] shrink-0 items-center justify-center rounded-full border-2 text-[clamp(15px,2.2vw,18px)] font-black ${
                    isSelected
                      ? 'border-[#2468F2] bg-[#2468F2] text-white'
                      : 'border-[#D8DEE8] bg-white text-transparent'
                  }`}
                >
                  ✓
                </span>
              </button>
            )
          })}
        </section>

        <footer className="absolute inset-x-0 bottom-0 bg-white px-[clamp(24px,6vw,48px)] pb-[clamp(28px,4svh,52px)] pt-5">
          <button
            type="button"
            onClick={handleNext}
            disabled={selectedIds.length === 0}
            className="h-[clamp(68px,7.5svh,96px)] w-full rounded-[8px] bg-[#2468F2] text-[clamp(22px,3.5vw,28px)] font-extrabold text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#93B4FF] disabled:bg-[#D9DDE4] disabled:text-[#8A93A2]"
          >
            {selectedIds.length === 0
              ? '선택해 주세요'
              : selectedIds.length === MAX_SELECTION
                ? '선택 완료'
                : `${selectedIds.length}개 선택`}
          </button>
        </footer>
      </main>
    </div>
  )
}
