import { Button } from './Button'
import { FLOW_PAGE_IDS, type FlowPageId } from '../../types/flow'

interface TopBarProps {
  onHelp?: () => void
  pageId?: FlowPageId
  progressLabel?: string
  progressValue?: number
}

export function TopBar({
  onHelp,
  pageId,
  progressLabel,
  progressValue,
}: TopBarProps) {
  const pageIndex = pageId ? FLOW_PAGE_IDS.indexOf(pageId) : -1
  const resolvedLabel =
    progressLabel ??
    (pageIndex >= 0 ? `${pageIndex + 1} / ${FLOW_PAGE_IDS.length}` : null)
  const resolvedValue =
    progressValue ??
    (pageIndex >= 0 ? ((pageIndex + 1) / FLOW_PAGE_IDS.length) * 100 : 0)
  const showProgressBar = progressValue !== undefined || pageIndex >= 0

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b-2 border-primary-100 bg-[#FAF8F2]/95 px-4 py-3 backdrop-blur sm:px-6">
      <div className="mx-auto flex max-w-6xl items-center gap-5">
        <div className="shrink-0 text-2xl font-extrabold text-primary-800">
          SkillMatch
        </div>

        {resolvedLabel && (
          <div className="min-w-0 flex-1" aria-label={`진행 상황 ${resolvedLabel}`}>
            <div className="mb-2 text-center text-xl font-bold text-[#4D4B46]">
              {resolvedLabel}
            </div>
            {showProgressBar && (
              <div className="h-2 overflow-hidden rounded-full bg-primary-100">
                <div
                  className="h-full rounded-full bg-primary-600 transition-[width] duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, resolvedValue))}%` }}
                />
              </div>
            )}
          </div>
        )}

        {onHelp && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onHelp}
            className="shrink-0 whitespace-nowrap"
          >
            직원 도움
          </Button>
        )}
      </div>
    </header>
  )
}
