import { Button } from '../common/Button'
import { TopBar } from '../common/TopBar'
import type { FlowTransitionState } from '../../types/flow'

interface FlowStatusProps {
  state: Exclude<FlowTransitionState, { kind: 'idle' }>
  onRetry: () => void
  onReviewAnswers: () => void
  onReviewProfile: () => void
  onHelp: () => void
}

export function FlowStatus({
  state,
  onRetry,
  onReviewAnswers,
  onReviewProfile,
  onHelp,
}: FlowStatusProps) {
  const isLoading = state.kind === 'loading'
  const isEmpty = state.kind === 'empty'

  return (
    <div className="min-h-screen bg-[#FAF8F2] text-[#0D0C0C]">
      <TopBar onHelp={onHelp} progressLabel="진행 중" />
      <main
        className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center px-6 pb-12 pt-32 text-center"
        aria-live="polite"
        aria-busy={isLoading}
      >
        <div
          aria-hidden="true"
          className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-primary-100 text-5xl font-extrabold text-primary-800"
        >
          {isLoading ? '…' : isEmpty ? '0' : '!'}
        </div>

        <h1 className="mb-6 text-[2.75rem] font-extrabold leading-tight">
          {isLoading
            ? state.target === 'questions'
              ? '질문을 준비하고 있어요'
              : '추천 일자리를 찾고 있어요'
            : isEmpty
              ? '지금 보여드릴 수 있는 일이 충분하지 않아요'
              : '이 단계부터 다시 이어갈 수 있어요'}
        </h1>

        <p className="mb-10 max-w-2xl text-2xl leading-normal text-[#4D4B46]">
          {isLoading
            ? '입력하신 내용은 이 기기 안에서 다음 화면으로 이어집니다.'
            : isEmpty
              ? '준비된 직무 범위를 더 넓힌 뒤 다시 확인할 수 있어요.'
              : '입력한 내용은 그대로 남아 있습니다. 다시 시도해 주세요.'}
        </p>

        {!isLoading && !isEmpty && (
          <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
            <Button variant="primary" size="xl" onClick={onRetry}>
              다시 시도
            </Button>
            <Button variant="outline" size="xl" onClick={onHelp}>
              직원 부르기
            </Button>
          </div>
        )}

        {isEmpty && (
          <div className="grid w-full max-w-2xl gap-4">
            <Button variant="primary" size="xl" onClick={onReviewAnswers}>
              답변 다시 보기
            </Button>
            <Button variant="outline" size="xl" onClick={onReviewProfile}>
              어려운 일 다시 고르기
            </Button>
            <Button variant="outline" size="xl" onClick={onHelp}>
              상담 선생님과 이야기하기
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
