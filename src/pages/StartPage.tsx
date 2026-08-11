import { Button } from '../components/common/Button'
import { TopBar } from '../components/common/TopBar'

interface StartPageProps {
  onStart: () => void
  onHelp: () => void
}

export function StartPage({ onStart, onHelp }: StartPageProps) {
  return (
    <div className="min-h-screen bg-[#FAF8F2] text-[#0D0C0C]">
      <TopBar pageId="P1" onHelp={onHelp} />
      <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center px-6 pb-28 pt-32 text-center">
        <p className="mb-5 text-2xl font-bold text-primary-700">
          희망직종 찾기 도우미
        </p>
        <h1 className="mb-8 text-[2.75rem] font-extrabold leading-tight sm:text-6xl">
          나에게 맞는 일을<br />함께 찾아봐요
        </h1>
        <p className="mb-5 max-w-3xl text-2xl leading-relaxed text-[#4D4B46]">
          나이와 일하기 어려운 점, 자격증을 살펴보고 신청서에 적을
          희망직종을 보여드려요.
        </p>
        <p className="mb-12 text-3xl font-bold text-primary-800">
          약 5분 걸려요
        </p>

        <Button
          type="button"
          variant="primary"
          size="4xl"
          onClick={onStart}
          className="w-4/5 max-w-2xl"
        >
          시작하기
        </Button>
      </main>

      <p className="fixed inset-x-0 bottom-0 bg-[#FAF8F2] px-6 py-5 text-center text-xl leading-normal text-[#4D4B46]">
        답하신 내용은 저장되지 않고, 끝나면 지워집니다.
      </p>
    </div>
  )
}
