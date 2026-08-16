import { Button } from '../components/common/Button'

interface StartPageProps {
  onStart: () => void
  onHelp: () => void
}

export function StartPage({ onStart }: StartPageProps) {
  return (
    <div className="v6-entry-page min-h-[100svh] overflow-x-hidden rounded-[clamp(20px,4vw,32px)] bg-white text-[#0D0C0C]">
      <main className="flex min-h-[100svh] w-full items-center justify-center px-6 py-8 text-center sm:px-12">
        <div className="flex flex-col items-center gap-[clamp(32px,8vw,64px)]">
          <h1 className="flex w-[min(491px,calc(100vw-3rem))] flex-col items-center gap-[clamp(36px,9vw,72px)] text-[clamp(44px,12vw,96px)] font-extrabold leading-[0.75]">
            <span className="whitespace-nowrap">어떤 일을</span>
            <span className="whitespace-nowrap">찾으시나요?</span>
          </h1>

          <Button
            type="button"
            variant="primary"
            size="4xl"
            onClick={onStart}
            className="!h-[clamp(96px,17vw,136px)] !min-h-[clamp(96px,17vw,136px)] !w-[min(361px,calc(100vw-3rem))] !rounded-full !border-0 !px-[clamp(24px,8vw,64px)] !py-0 !text-[clamp(32px,8vw,64px)] !font-extrabold !leading-[0.625] whitespace-nowrap"
          >
            시작하기
          </Button>
        </div>
      </main>
    </div>
  )
}
