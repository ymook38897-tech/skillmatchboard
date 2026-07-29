import { Button } from './Button'

interface TopBarProps {
  onHelp?: () => void
}

export function TopBar({ onHelp }: TopBarProps) {
  if (!onHelp) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
      <div className="max-w-full flex justify-end">
        <Button
          variant="secondary"
          size="xl"
          onClick={onHelp}
          className="text-2xl min-w-fit"
        >
          직원 도움
        </Button>
      </div>
    </div>
  )
}
