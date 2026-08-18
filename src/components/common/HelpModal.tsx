import { useEffect, useRef } from 'react'
import helpPointerIcon from '../../assets/icons/p1/help-pointer.svg'
import staffHeadsetIcon from '../../assets/icons/p1/staff-headset.svg'
import { Button } from './Button'

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
  variant?: 'default' | 'tutorial'
}

export function HelpModal({
  isOpen,
  onClose,
  variant = 'default',
}: HelpModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement
      dialogRef.current?.focus()
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
      previousFocusRef.current?.focus()
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  if (!isOpen) return null

  if (variant === 'tutorial') {
    return (
      <div className="v6-entry-page fixed inset-0 z-50 overflow-x-hidden rounded-[clamp(20px,3.75vw,30px)] bg-[rgba(25,33,30,0.58)] text-[#171C1A]">
        <div className="relative mx-auto min-h-full w-full max-w-[800px]">
          <div className="absolute right-[clamp(16px,3.5vw,28px)] top-[clamp(12px,2.5vw,20px)] flex h-[clamp(68px,9.5vw,76px)] w-[clamp(190px,28vw,224px)] items-center justify-center gap-[clamp(9px,1.5vw,12px)] rounded-[clamp(17px,2.375vw,19px)] border-[1.5px] border-[#5D776F] bg-[rgba(255,255,255,0.78)] text-[clamp(21px,3.125vw,25px)] font-bold leading-[normal] text-[#38564E] shadow-[0_8px_12px_rgba(37,50,45,0.14)] backdrop-blur-[9px]">
            <img
              src={staffHeadsetIcon}
              alt=""
              aria-hidden="true"
              className="size-[clamp(34px,4.75vw,38px)]"
            />
            <span>직원 상담</span>
          </div>

          <img
            src={helpPointerIcon}
            alt=""
            aria-hidden="true"
            className="absolute right-[clamp(28px,13.75vw,110px)] top-[clamp(112px,10.3125vw,132px)] h-[clamp(105px,18.75vw,150px)] w-[clamp(119px,21.25vw,170px)]"
          />

          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="tutorial-help-title"
            tabIndex={-1}
            className="absolute left-1/2 top-[clamp(250px,25.78125svh,330px)] h-[clamp(350px,48.75vw,390px)] w-[min(676px,calc(100vw-32px))] -translate-x-1/2 rounded-[clamp(26px,4.25vw,34px)] bg-[rgba(255,255,255,0.92)] text-center shadow-[0_8px_24px_rgba(37,50,45,0.13)] backdrop-blur-[9px] focus:outline-none"
          >
            <h2
              id="tutorial-help-title"
              className="absolute left-[clamp(20px,4.75vw,38px)] right-[clamp(20px,4.75vw,38px)] top-[clamp(42px,6.75vw,54px)] text-[clamp(30px,4.75vw,38px)] font-bold leading-[normal]"
            >
              잘 모르겠다면
              <br />
              직원에게 도움을 받을 수 있어요.
            </h2>
            <p className="absolute left-[clamp(20px,4.75vw,38px)] right-[clamp(20px,4.75vw,38px)] top-[clamp(160px,22vw,176px)] text-[clamp(18px,2.75vw,22px)] font-bold leading-[normal] text-[#61716B]">
              입력한 내용은 그대로 유지됩니다.
            </p>
            <Button
              type="button"
              variant="primary"
              size="xl"
              onClick={onClose}
              className="!absolute !bottom-[clamp(30px,5.75vw,46px)] !left-[clamp(20px,4.75vw,38px)] !right-[clamp(20px,4.75vw,38px)] !h-[clamp(76px,11vw,88px)] !min-h-0 !w-auto !rounded-[clamp(17px,2.5vw,20px)] !border-0 !bg-[linear-gradient(90deg,#486D92_0%,#71B48F_100%)] !px-0 !py-0 !text-[clamp(24px,3.5vw,28px)] !font-bold !leading-[normal] !shadow-[0_8px_24px_rgba(37,50,45,0.13)]"
            >
              다음
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-title"
        tabIndex={-1}
        className="w-full max-w-2xl rounded-xl bg-[#FAF8F2]"
      >
        <div className="flex flex-col items-center justify-center p-12 sm:p-16 text-center min-h-96">
          <h2 id="help-title" className="mb-12 text-3xl font-extrabold text-[#0D0C0C] sm:text-4xl">
            직원의 도움이 필요하시면<br />가까운 직원에게 말씀해주세요.
          </h2>
          <Button
            variant="primary"
            size="xl"
            onClick={onClose}
            className="w-full sm:w-80"
          >
            확인
          </Button>
        </div>
      </div>
    </div>
  )
}
