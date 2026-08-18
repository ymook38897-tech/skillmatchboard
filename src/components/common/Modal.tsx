import { ReactNode, useEffect, useRef } from 'react'
import { Button } from './Button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  closeButtonLabel?: string
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  closeButtonLabel = '닫기',
}: ModalProps) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-[#FAF8F2]"
      >
        <div className="p-10 sm:p-12">
          <h2 id="modal-title" className="mb-10 text-5xl font-extrabold text-[#0D0C0C] sm:text-6xl">
            {title}
          </h2>
          <div className="text-3xl leading-relaxed text-[#4D4B46]">
            {children}
          </div>
        </div>

        <div className="sticky bottom-0 border-t-2 border-primary-100 bg-[#FAF8F2] p-8 sm:p-10">
          <Button
            variant="primary"
            size="2xl"
            onClick={onClose}
            className="w-full text-3xl"
          >
            {closeButtonLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
