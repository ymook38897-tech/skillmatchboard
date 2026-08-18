import { useEffect, useRef, type ReactNode } from 'react'

interface BottomSheetDialogProps {
  children: ReactNode
  labelledBy: string
  onClose: () => void
  surfaceClassName: string
}

export function BottomSheetDialog({
  children,
  labelledBy,
  onClose,
  surfaceClassName,
}: BottomSheetDialogProps) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const onCloseRef = useRef(onClose)

  onCloseRef.current = onClose

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    sheetRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current()
        return
      }

      if (event.key !== 'Tab' || !sheetRef.current) return

      const focusableElements = Array.from(
        sheetRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])',
        ),
      )
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (!firstElement || !lastElement) {
        event.preventDefault()
        return
      }

      if (
        event.shiftKey &&
        (document.activeElement === firstElement ||
          document.activeElement === sheetRef.current)
      ) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      previousFocusRef.current?.focus()
    }
  }, [])

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onCloseRef.current()
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-[rgba(13,12,12,0.52)]"
      onClick={handleBackdropClick}
    >
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={`v6-entry-page w-full max-w-[800px] overflow-x-hidden rounded-t-[clamp(24px,4vw,32px)] bg-white text-[#0D0C0C] focus:outline-none ${surfaceClassName}`}
      >
        {children}
      </div>
    </div>
  )
}
