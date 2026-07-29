import { Button } from './Button'

interface NavigationButtonsProps {
  onPrev: () => void
  onNext: () => void
  onHelp?: () => void
  prevLabel?: string
  nextLabel?: string
  nextDisabled?: boolean
  prevDisabled?: boolean
}

export function NavigationButtons({
  onPrev,
  onNext,
  onHelp,
  prevLabel = '이전',
  nextLabel = '다음',
  nextDisabled = false,
  prevDisabled = false,
}: NavigationButtonsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-6 sm:px-6 lg:px-8 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <div className="max-w-6xl mx-auto flex gap-4 justify-between items-stretch">
        <Button
          variant="outline"
          size="xl"
          onClick={onPrev}
          disabled={prevDisabled}
          className="flex-1 text-2xl"
        >
          {prevLabel}
        </Button>
        {onHelp && (
          <Button
            variant="secondary"
            size="xl"
            onClick={onHelp}
            className="flex-1 text-2xl"
          >
            직원 도움
          </Button>
        )}
        <Button
          variant="primary"
          size="xl"
          onClick={onNext}
          disabled={nextDisabled}
          className="flex-1 text-2xl"
        >
          {nextLabel}
        </Button>
      </div>
    </div>
  )
}
