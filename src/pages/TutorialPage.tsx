import { Button } from '../components/common/Button'
import { TopBar } from '../components/common/TopBar'

interface TutorialPageProps {
  onNext: () => void
  onSkip: () => void
  onPrev: () => void
  onHelp: () => void
}

const GUIDE_ITEMS = [
  {
    number: '1',
    title: '짧은 문장에 답해요',
    description: '한 문장씩 천천히 읽고 골라 주세요.',
  },
  {
    number: '2',
    title: '모르면 그대로 골라도 돼요',
    description: '판단하기 어렵다면 잘 모르겠음을 누르세요.',
  },
  {
    number: '3',
    title: '신청서에 적을 내용이 나와요',
    description: '고른 직무와 자격증을 마지막에 확인해요.',
  },
]

export function TutorialPage({
  onNext,
  onSkip,
  onPrev,
  onHelp,
}: TutorialPageProps) {
  return (
    <div className="min-h-screen bg-[#FAF8F2] pb-36 text-[#0D0C0C]">
      <TopBar pageId="P2" onHelp={onHelp} />
      <main className="mx-auto w-full max-w-5xl px-6 pt-32">
        <h1 className="mb-5 text-[2.75rem] font-extrabold leading-tight">
          이렇게 이용해요
        </h1>
        <p className="mb-10 text-2xl leading-normal text-[#4D4B46]">
          세 가지만 기억하면 어렵지 않아요.
        </p>

        <ol className="grid gap-5 md:grid-cols-3">
          {GUIDE_ITEMS.map((item) => (
            <li
              key={item.number}
              className="min-h-72 rounded-2xl border-2 border-primary-200 bg-white p-7"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-3xl font-extrabold text-white">
                {item.number}
              </div>
              <h2 className="mb-4 text-3xl font-extrabold leading-snug">
                {item.title}
              </h2>
              <p className="text-2xl leading-normal text-[#4D4B46]">
                {item.description}
              </p>
            </li>
          ))}
        </ol>
      </main>

      <footer className="fixed inset-x-0 bottom-0 border-t-2 border-primary-100 bg-[#FAF8F2] px-6 py-4">
        <div className="mx-auto grid max-w-5xl grid-cols-3 gap-4">
          <Button variant="outline" size="xl" onClick={onPrev}>
            이전
          </Button>
          <Button variant="outline" size="xl" onClick={onSkip}>
            건너뛰기
          </Button>
          <Button variant="primary" size="xl" onClick={onNext}>
            다음
          </Button>
        </div>
      </footer>
    </div>
  )
}
