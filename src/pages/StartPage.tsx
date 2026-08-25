interface StartPageProps {
  onStart: () => void
}

export function StartPage({ onStart }: StartPageProps) {
  return (
    <div className="voice-flow-page min-h-[100svh] bg-[#EEF1F4]">
      <main className="mx-auto flex min-h-[100svh] w-full max-w-[800px] flex-col overflow-hidden bg-white px-[clamp(24px,6vw,48px)] pb-[clamp(28px,5svh,64px)] text-center sm:rounded-[24px]">
        <section className="flex flex-1 flex-col items-center pt-[clamp(220px,35.5svh,455px)]">
          <h1 className="text-[clamp(38px,6.5vw,52px)] font-extrabold leading-[1.18] tracking-[-0.035em] text-[#111827]">
            희망직종 찾기
          </h1>
          <p className="mt-[clamp(22px,2.7svh,34px)] text-[clamp(18px,2.75vw,22px)] font-medium tracking-[-0.02em] text-[#4B5563]">
            음성인식을 통해 희망직종을 찾아요.
          </p>
        </section>

        <button
          type="button"
          onClick={onStart}
          className="h-[clamp(76px,7.9svh,100px)] w-full shrink-0 rounded-[10px] bg-[#2468F2] text-[clamp(24px,3.75vw,30px)] font-extrabold text-white transition-colors hover:bg-[#1858DC] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#93B4FF] focus-visible:ring-offset-4"
        >
          시작하기
        </button>
      </main>
    </div>
  )
}
