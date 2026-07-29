import { useEffect, useRef } from 'react'
import { Button } from './Button'

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
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
        aria-labelledby="help-title"
        tabIndex={-1}
        className="bg-white rounded-xl max-w-2xl w-full"
      >
        <div className="flex flex-col items-center justify-center p-12 sm:p-16 text-center min-h-96">
          <h2 id="help-title" className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12">
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
