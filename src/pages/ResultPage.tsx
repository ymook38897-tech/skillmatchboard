import { useState } from 'react'
import { Button } from '../components/common/Button'
import { Modal } from '../components/common/Modal'
import { TopBar } from '../components/common/TopBar'
import type { Recommendation } from '../types/flow'

interface ResultPageProps {
  recommendations: Recommendation[]
  pickedJobCodes: string[]
  onTogglePick: (jobCode: string) => void
  onMovePick: (jobCode: string, direction: 'up' | 'down') => void
  onComplete: () => void
  onPrev: () => void
  onHelp: () => void
}

export function ResultPage({
  recommendations,
  pickedJobCodes,
  onTogglePick,
  onMovePick,
  onComplete,
  onPrev,
  onHelp,
}: ResultPageProps) {
  const [detailJobCode, setDetailJobCode] = useState<string | null>(null)
  const detailJob = recommendations.find(
    (recommendation) => recommendation.jobCode === detailJobCode,
  )
  const pickedRecommendations = pickedJobCodes
    .map((jobCode) =>
      recommendations.find(
        (recommendation) => recommendation.jobCode === jobCode,
      ),
    )
    .filter((recommendation): recommendation is Recommendation =>
      Boolean(recommendation),
    )

  return (
    <div className="min-h-screen bg-[#FAF8F2] pb-40 text-[#0D0C0C]">
      <TopBar pageId="P5" onHelp={onHelp} />
      <main className="mx-auto w-full max-w-6xl px-6 pt-32">
        <h1 className="mb-5 text-[2.75rem] font-extrabold leading-tight">
          이런 일은 어떠세요?
        </h1>
        <p className="mb-8 text-2xl leading-normal text-[#4D4B46]">
          마음에 드는 일을 1개 이상 담아 주세요. 최대 3개까지 담을 수
          있어요.
        </p>

        <div className="grid gap-5 md:grid-cols-3">
          {recommendations.slice(0, 3).map((recommendation) => {
            const pickedIndex = pickedJobCodes.indexOf(recommendation.jobCode)
            const isPicked = pickedIndex >= 0
            const pickDisabled = !isPicked && pickedJobCodes.length >= 3

            return (
              <article
                key={recommendation.jobCode}
                className={`flex min-h-[27rem] flex-col rounded-2xl border-4 p-6 ${
                  isPicked
                    ? 'border-primary-600 bg-primary-100'
                    : 'border-[#4D4B46] bg-white'
                }`}
              >
                <div className="mb-4 text-xl font-bold text-primary-800">
                  {isPicked ? `${pickedIndex + 1}순위로 담았어요` : '추천 직무'}
                </div>
                <h2 className="mb-4 text-3xl font-extrabold leading-snug">
                  {recommendation.formalName}
                </h2>
                <p className="mb-5 text-2xl leading-normal text-[#4D4B46]">
                  {recommendation.oneLiner}
                </p>
                <p className="mb-7 rounded-xl bg-[#FAF8F2] p-4 text-xl leading-normal">
                  {recommendation.reason}
                </p>
                <div className="mt-auto grid gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setDetailJobCode(recommendation.jobCode)}
                  >
                    자세히
                  </Button>
                  <Button
                    variant={isPicked ? 'secondary' : 'primary'}
                    size="lg"
                    disabled={pickDisabled}
                    onClick={() => onTogglePick(recommendation.jobCode)}
                  >
                    {isPicked ? '담기 취소' : '담기'}
                  </Button>
                </div>
              </article>
            )
          })}
        </div>

        {pickedRecommendations.length > 0 && (
          <section className="mt-8 rounded-2xl border-2 border-primary-200 bg-white p-6">
            <h2 className="mb-5 text-3xl font-extrabold">담은 순서</h2>
            <ol className="space-y-3">
              {pickedRecommendations.map((recommendation, index) => (
                <li
                  key={recommendation.jobCode}
                  className="grid min-h-20 grid-cols-[3rem_1fr_auto] items-center gap-3 rounded-xl bg-primary-100 px-4 py-3"
                >
                  <span className="text-3xl font-extrabold">{index + 1}</span>
                  <span className="text-2xl font-bold">
                    {recommendation.formalName}
                  </span>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={index === 0}
                      onClick={() => onMovePick(recommendation.jobCode, 'up')}
                    >
                      위로
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={index === pickedRecommendations.length - 1}
                      onClick={() => onMovePick(recommendation.jobCode, 'down')}
                    >
                      아래로
                    </Button>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}
      </main>

      <footer className="fixed inset-x-0 bottom-0 border-t-2 border-primary-100 bg-[#FAF8F2] px-6 py-4">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4">
          <Button variant="outline" size="xl" onClick={onPrev}>
            이전
          </Button>
          <Button
            variant="primary"
            size="xl"
            onClick={onComplete}
            disabled={pickedJobCodes.length === 0}
          >
            다 골랐어요
          </Button>
        </div>
      </footer>

      {detailJob && (
        <Modal
          isOpen
          onClose={() => setDetailJobCode(null)}
          title={detailJob.formalName}
        >
          <div className="space-y-8">
            <p>{detailJob.oneLiner}</p>
            {detailJob.tasks.length > 0 && (
              <div>
                <h3 className="mb-4 font-extrabold">주로 하는 일</h3>
                <ul className="space-y-3">
                  {detailJob.tasks.slice(0, 3).map((task) => (
                    <li key={task}>· {task}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}
