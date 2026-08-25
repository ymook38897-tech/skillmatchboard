interface LoadingScreenProps {
  label?: string
}

export function LoadingScreen({ label = '로딩 중' }: LoadingScreenProps) {
  return (
    <div className="voice-flow-page min-h-[100svh] bg-[#EEF1F4]">
      <main
        role="status"
        aria-live="polite"
        className="mx-auto flex min-h-[100svh] w-full max-w-[800px] flex-col items-center justify-center bg-white sm:rounded-[24px]"
      >
        <span
          aria-hidden="true"
          className="size-[clamp(116px,20vw,160px)] animate-spin rounded-full border-[16px] border-[#E6EDFA] border-r-[#2468F2] border-t-[#2468F2]"
        />
        <p className="mt-[clamp(48px,5svh,64px)] text-[clamp(32px,5vw,40px)] font-extrabold tracking-[-0.03em] text-[#111827]">
          {label}
        </p>
      </main>
    </div>
  )
}
