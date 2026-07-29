import { Button } from './Button'

interface NavigationButtonsProps {
  onPrev: () => void
  onNext: () => void
  prevLabel?: string
  nextLabel?: string
  nextDisabled?: boolean
  prevDisabled?: boolean
}

export function NavigationButtons({
  onPrev,
  onNext,
  prevLabel = '이전',
  nextLabel = '다음',
  nextDisabled = false,
  prevDisabled = false,
}: NavigationButtonsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto flex gap-4 justify-between">
        <Button
          variant="outline"
          size="lg"
          onClick={onPrev}
          disabled={prevDisabled}
          className="flex-1"
        >
          {prevLabel}
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={onNext}
          disabled={nextDisabled}
          className="flex-1"
        >
          {nextLabel}
        </Button>
      </div>
    </div>
  )
}
