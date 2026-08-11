import { Button } from '../components/common/Button'
import { TopBar } from '../components/common/TopBar'
import type { Recommendation } from '../types/flow'

interface ApplicationGuidePageProps {
  pickedRecommendations: Recommendation[]
  certificationLabels: string[]
  onPrev: () => void
  onFinish: () => void
  onHelp: () => void
}

export function ApplicationGuidePage({
  pickedRecommendations,
  certificationLabels,
  onPrev,
  onFinish,
  onHelp,
}: ApplicationGuidePageProps) {
  return (
    <div className="min-h-screen bg-[#FAF8F2] pb-40 text-[#0D0C0C]">
      <TopBar pageId="P6" onHelp={onHelp} />
      <main className="mx-auto w-full max-w-5xl px-6 pt-32">
        <h1 className="mb-5 text-[2.75rem] font-extrabold leading-tight">
          신청서에 옮겨 적어 주세요
        </h1>
        <p className="mb-9 text-2xl leading-normal text-[#4D4B46]">
          아래 내용은 나중에 상담 선생님과 바꾸실 수 있어요.
        </p>

        <section className="rounded-2xl border-4 border-primary-600 bg-white p-7">
          <div className="mb-8 rounded-xl bg-primary-100 p-5">
            <h2 className="text-3xl font-extrabold">고른 직무와 순서</h2>
          </div>
          <ol className="space-y-4">
            {pickedRecommendations.map((recommendation, index) => (
              <li
                key={recommendation.jobCode}
                className="grid min-h-20 grid-cols-[4rem_1fr] items-center rounded-xl border-2 border-[#4D4B46] px-5 py-3"
              >
                <span className="text-3xl font-extrabold">{index + 1}</span>
                <span className="text-3xl font-bold">
                  {recommendation.formalName}
                </span>
              </li>
            ))}
          </ol>

          <div className="mb-5 mt-10 rounded-xl bg-primary-100 p-5">
            <h2 className="text-3xl font-extrabold">고른 자격증</h2>
          </div>
          <div className="min-h-24 rounded-xl border-2 border-[#4D4B46] px-5 py-4 text-3xl font-bold leading-normal">
            {certificationLabels.length > 0
              ? certificationLabels.join(', ')
              : '고른 자격증 없음'}
          </div>
        </section>

        <aside className="mt-6 rounded-xl border-2 border-primary-200 bg-primary-100 p-5 text-xl leading-normal text-[#4D4B46]">
          실물 신청서의 정확한 판본과 기입할 칸이 확인되면 이 목록을 신청서 확대
          화면과 연결합니다. 지금은 서식의 칸이나 위치를 가정하지 않습니다.
        </aside>
      </main>

      <footer className="fixed inset-x-0 bottom-0 border-t-2 border-primary-100 bg-[#FAF8F2] px-6 py-4">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4">
          <Button variant="outline" size="xl" onClick={onPrev}>
            이전
          </Button>
          <Button variant="primary" size="xl" onClick={onFinish}>
            다 적었어요
          </Button>
        </div>
      </footer>
    </div>
  )
}
