import staffHeadsetIcon from '../../assets/icons/answer-review-final/staff-headset.svg'

interface FinalFlowHeaderProps {
  onHelp: () => void
}

export function FinalFlowHeader({ onHelp }: FinalFlowHeaderProps) {
  return (
    <header className="absolute inset-x-0 top-0 z-20 h-[clamp(96px,14.5vw,116px)] bg-[rgba(255,255,255,0.72)] shadow-[0_8px_24px_rgba(37,50,45,0.13)] backdrop-blur-[9px]">
      <button
        type="button"
        onClick={onHelp}
        className="absolute right-[clamp(8px,3.5vw,28px)] top-[clamp(12px,2.5vw,20px)] z-10 flex h-[clamp(68px,9.5vw,76px)] w-[clamp(140px,28vw,224px)] transform-gpu items-center justify-center gap-[clamp(7px,1.5vw,12px)] rounded-[clamp(17px,2.375vw,19px)] border-[1.5px] border-[#5D776F] bg-[rgba(255,255,255,0.78)] text-[clamp(17px,3.125vw,25px)] font-bold leading-[normal] text-[#38564E] shadow-[0_8px_12px_rgba(37,50,45,0.14)] backdrop-blur-[9px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#5E7E72] focus-visible:ring-offset-4"
      >
        <img
          src={staffHeadsetIcon}
          alt=""
          aria-hidden="true"
          className="size-[clamp(28px,4.75vw,38px)]"
        />
        <span className="whitespace-nowrap">직원 상담</span>
      </button>
    </header>
  )
}
