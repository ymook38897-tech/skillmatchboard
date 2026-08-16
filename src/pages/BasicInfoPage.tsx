import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Button } from '../components/common/Button'
import { TopBar } from '../components/common/TopBar'
import {
  BARRIER_OPTION_GROUPS,
  CERTIFICATION_OPTION_GROUPS,
  getBarrierLabel,
  getCertificationLabel,
  type ProfileCategoryIcon,
  type ProfileOptionGroup,
  type SelectionOption,
} from '../data/profileOptions'
import type { ProfileDraft } from '../types/flow'

interface BasicInfoPageProps {
  profile: ProfileDraft
  mode?: 'all' | 'certifications'
  onBarrierToggle: (barrierId: string) => void
  onBarrierNone: () => void
  onCertificationToggle: (certificationId: string) => void
  onCertificationNone: () => void
  onCertificationOtherChange: (value: string) => void
  onNext: () => void
  onPrev: () => void
  onHelp: () => void
}

type ActiveSheet =
  | { kind: 'barrier'; groupId: string }
  | { kind: 'certification'; groupId: string }
  | null

const MAX_SELECTIONS = 5
const SECTION_SCROLL_DURATION_MS = 260
const TOP_BAR_OFFSET_PX = 116

function CategoryIcon({ icon }: { icon: ProfileCategoryIcon }) {
  const sharedProps = {
    className: 'h-10 w-10 shrink-0',
    viewBox: '0 0 48 48',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 3,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }

  switch (icon) {
    case 'box':
      return (
        <svg {...sharedProps}>
          <path d="M7 15 24 7l17 8-17 9L7 15Z" />
          <path d="M7 15v18l17 8 17-8V15M24 24v17" />
        </svg>
      )
    case 'eye':
      return (
        <svg {...sharedProps}>
          <path d="M4 24s7-11 20-11 20 11 20 11-7 11-20 11S4 24 4 24Z" />
          <circle cx="24" cy="24" r="5" />
        </svg>
      )
    case 'conversation':
      return (
        <svg {...sharedProps}>
          <path d="M7 9h34v24H23l-10 7v-7H7V9Z" />
          <path d="M15 18h18M15 25h13" />
        </svg>
      )
    case 'clock':
      return (
        <svg {...sharedProps}>
          <circle cx="24" cy="24" r="18" />
          <path d="M24 13v12l8 5" />
        </svg>
      )
    case 'outdoors':
      return (
        <svg {...sharedProps}>
          <circle cx="37" cy="11" r="5" />
          <path d="M20 40V27M13 40h14M20 7 9 28h22L20 7Z" />
        </svg>
      )
    case 'vehicle':
      return (
        <svg {...sharedProps}>
          <path d="m8 29 4-12h23l5 12v8H8v-8Z" />
          <path d="M13 29h22M16 17l4-6h10l5 6" />
          <circle cx="15" cy="37" r="4" />
          <circle cx="34" cy="37" r="4" />
        </svg>
      )
    case 'meal':
      return (
        <svg {...sharedProps}>
          <path d="M8 24h28c0 9-6 15-14 15S8 33 8 24Z" />
          <path d="M13 18c0-4 3-4 3-8M22 18c0-4 3-4 3-8M31 18c0-4 3-4 3-8M6 42h32" />
        </svg>
      )
    case 'care':
      return (
        <svg {...sharedProps}>
          <path d="M24 40 7 24C-1 15 12 4 20 12l4 4 4-4c8-8 21 3 13 12L24 40Z" />
        </svg>
      )
    case 'computer':
      return (
        <svg {...sharedProps}>
          <rect x="6" y="8" width="36" height="27" rx="2" />
          <path d="M18 41h12M24 35v6" />
        </svg>
      )
  }
}

function CategoryButton({
  group,
  onClick,
}: {
  group: ProfileOptionGroup
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[5.5rem] min-w-0 items-center gap-4 rounded-xl border-[3px] border-[#4D4B46] bg-white px-5 py-4 text-left text-[1.875rem] font-bold leading-[1.35] hover:bg-primary-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-600 focus-visible:ring-offset-4"
    >
      <CategoryIcon icon={group.icon} />
      <span className="min-w-0 break-keep">{group.label}</span>
    </button>
  )
}

function SelectionChip({
  label,
  onRemove,
}: {
  label: string
  onRemove: () => void
}) {
  return (
    <div className="flex min-h-14 min-w-0 max-w-full items-stretch overflow-hidden rounded-xl bg-primary-600 text-white">
      <span className="min-w-0 flex-1 break-words px-5 py-3 text-2xl font-bold leading-8">
        {label}
      </span>
      <button
        type="button"
        aria-label={`${label} 해제`}
        onClick={onRemove}
        className="flex min-h-14 shrink-0 items-center gap-2 border-l-2 border-white/50 px-4 text-xl font-bold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-inset"
      >
        <span aria-hidden="true" className="text-2xl">
          X
        </span>
        <span>해제</span>
      </button>
    </div>
  )
}

function SelectionSheet({
  title,
  description,
  children,
  onClose,
}: {
  title: string
  description: string
  children: ReactNode
  onClose: () => void
}) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    sheetRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab' || !sheetRef.current) return

      const focusableElements = Array.from(
        sheetRef.current.querySelectorAll<HTMLElement>(
          'button:not(:disabled), input:not(:disabled), [tabindex]:not([tabindex="-1"])',
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
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 pt-16 sm:px-4">
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="selection-sheet-title"
        aria-describedby="selection-sheet-description"
        tabIndex={-1}
        className="v6-entry-page flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl bg-[#FAF8F2] text-[#0D0C0C] shadow-2xl sm:rounded-t-[2rem]"
      >
        <header className="border-b-2 border-primary-100 px-6 pb-5 pt-6 sm:px-8">
          <div aria-hidden="true" className="mx-auto mb-5 h-2 w-24 rounded-full bg-[#4D4B46]" />
          <h2
            id="selection-sheet-title"
            className="text-[2.375rem] font-extrabold leading-[1.3]"
          >
            {title}
          </h2>
          <p
            id="selection-sheet-description"
            className="mt-3 text-2xl font-normal leading-9 text-[#4D4B46]"
          >
            {description}
          </p>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 sm:px-8">
          {children}
        </div>

        <footer className="border-t-2 border-primary-100 bg-[#FAF8F2] px-6 py-4 sm:px-8">
          <Button variant="primary" size="xl" onClick={onClose} className="w-full">
            선택 완료
          </Button>
        </footer>
      </div>
    </div>
  )
}

function SheetOptionList({
  options,
  selectedIds,
  selectionCount = selectedIds.length,
  onToggle,
}: {
  options: SelectionOption[]
  selectedIds: string[]
  selectionCount?: number
  onToggle: (id: string) => void
}) {
  const reachedLimit = selectionCount >= MAX_SELECTIONS

  return (
    <>
      <div className="grid gap-3">
        {options.map((option) => {
          const selected = selectedIds.includes(option.id)
          const disabled = !selected && reachedLimit

          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              aria-describedby={reachedLimit ? 'selection-limit-message' : undefined}
              disabled={disabled}
              onClick={() => onToggle(option.id)}
              className={`flex min-h-[5.5rem] min-w-0 items-center justify-between gap-4 rounded-xl border-[3px] px-5 py-4 text-left text-[1.875rem] font-bold leading-[1.35] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-600 focus-visible:ring-offset-4 ${
                selected
                  ? 'border-primary-600 bg-primary-100'
                  : 'border-[#4D4B46] bg-white'
              }`}
            >
              <span className="min-w-0 break-words">{option.label}</span>
              {selected && (
                <span className="shrink-0 text-xl text-primary-800">선택됨</span>
              )}
            </button>
          )
        })}
      </div>

      {reachedLimit && (
        <p
          id="selection-limit-message"
          role="status"
          aria-live="polite"
          className="mt-4 rounded-xl bg-primary-100 px-5 py-4 text-xl leading-[1.5] text-[#0D0C0C]"
        >
          5개까지 고르실 수 있어요
        </p>
      )}
    </>
  )
}

export function BasicInfoPage({
  profile,
  mode = 'all',
  onBarrierToggle,
  onBarrierNone,
  onCertificationToggle,
  onCertificationNone,
  onCertificationOtherChange,
  onNext,
  onPrev,
  onHelp,
}: BasicInfoPageProps) {
  const barrierSectionRef = useRef<HTMLElement>(null)
  const barrierTitleRef = useRef<HTMLHeadingElement>(null)
  const certificationSectionRef = useRef<HTMLElement>(null)
  const certificationTitleRef = useRef<HTMLHeadingElement>(null)
  const scrollAnimationRef = useRef<number | null>(null)
  const restoreScrollBehaviorRef = useRef<(() => void) | null>(null)
  const [activeSheet, setActiveSheet] = useState<ActiveSheet>(null)
  const [barrierStageComplete, setBarrierStageComplete] = useState(
    () =>
      profile.barrierNone ||
      profile.barrierIds.length > 0 ||
      profile.certificationNone ||
      profile.certificationIds.length > 0 ||
      profile.certificationOther.trim().length > 0,
  )

  const showBarriers = mode === 'all'
  const showCertifications =
    mode === 'certifications' || (showBarriers && barrierStageComplete)
  const certificationSelectionCount =
    profile.certificationIds.length +
    (profile.certificationOther.trim().length > 0 ? 1 : 0)
  const previouslyShowedBarriersRef = useRef(showBarriers)
  const previouslyShowedCertificationsRef = useRef(showCertifications)

  const scrollToSection = (
    section: HTMLElement | null,
    heading: HTMLHeadingElement | null,
  ) => {
    if (!section) return

    heading?.focus({ preventScroll: true })
    if (scrollAnimationRef.current !== null) {
      window.cancelAnimationFrame(scrollAnimationRef.current)
    }
    restoreScrollBehaviorRef.current?.()

    const documentElement = document.documentElement
    const previousScrollBehavior = documentElement.style.scrollBehavior
    documentElement.style.scrollBehavior = 'auto'
    restoreScrollBehaviorRef.current = () => {
      documentElement.style.scrollBehavior = previousScrollBehavior
      restoreScrollBehaviorRef.current = null
    }

    const startY = window.scrollY
    const targetY = Math.max(
      0,
      section.getBoundingClientRect().top + startY - TOP_BAR_OFFSET_PX,
    )
    const distance = targetY - startY
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (reduceMotion || Math.abs(distance) < 2) {
      window.scrollTo({ top: targetY })
      restoreScrollBehaviorRef.current?.()
      return
    }

    const startedAt = performance.now()
    const animate = (now: number) => {
      const progress = Math.min(
        (now - startedAt) / SECTION_SCROLL_DURATION_MS,
        1,
      )
      const easedProgress = 1 - Math.pow(1 - progress, 3)
      window.scrollTo({ top: startY + distance * easedProgress })

      if (progress < 1) {
        scrollAnimationRef.current = window.requestAnimationFrame(animate)
      } else {
        scrollAnimationRef.current = null
        restoreScrollBehaviorRef.current?.()
      }
    }

    scrollAnimationRef.current = window.requestAnimationFrame(animate)
  }

  useEffect(() => {
    if (showBarriers && !previouslyShowedBarriersRef.current) {
      scrollToSection(barrierSectionRef.current, barrierTitleRef.current)
    }
    previouslyShowedBarriersRef.current = showBarriers
  }, [showBarriers])

  useEffect(() => {
    if (
      showCertifications &&
      !previouslyShowedCertificationsRef.current &&
      activeSheet === null
    ) {
      scrollToSection(
        certificationSectionRef.current,
        certificationTitleRef.current,
      )
    }
    previouslyShowedCertificationsRef.current = showCertifications
  }, [activeSheet, showCertifications])

  useEffect(() => {
    return () => {
      if (scrollAnimationRef.current !== null) {
        window.cancelAnimationFrame(scrollAnimationRef.current)
      }
      restoreScrollBehaviorRef.current?.()
    }
  }, [])

  const activeGroup = activeSheet
    ? (activeSheet.kind === 'barrier'
        ? BARRIER_OPTION_GROUPS
        : CERTIFICATION_OPTION_GROUPS
      ).find((group) => group.id === activeSheet.groupId) ?? null
    : null

  const closeSheet = useCallback(() => {
    if (activeSheet?.kind === 'barrier') {
      setBarrierStageComplete(true)
    }
    setActiveSheet(null)
  }, [activeSheet])

  const chooseBarrierNone = () => {
    if (!profile.barrierNone) onBarrierNone()
    setActiveSheet(null)
    setBarrierStageComplete(true)
  }

  const chooseCertificationNone = () => {
    if (!profile.certificationNone) onCertificationNone()
    setActiveSheet(null)
  }

  return (
    <div className="v6-entry-page min-h-screen bg-[#FAF8F2] pb-40 text-[#0D0C0C]">
      <TopBar pageId="P3" onHelp={onHelp} />

      <main className="mx-auto w-full max-w-5xl px-6 pt-32">
        <h1 className="mb-5 text-[2.75rem] font-extrabold leading-[1.25]">
          기본 정보를 알려주세요
        </h1>
        <p className="mb-10 text-2xl font-normal leading-9 text-[#4D4B46]">
          하나를 고르면 다음 항목이 아래에 나타나요.
        </p>

        {showBarriers && (
          <section
            id="barrier-section"
            ref={barrierSectionRef}
            aria-labelledby="barrier-title"
            className="mb-12 scroll-mt-32"
          >
            <h2
              id="barrier-title"
              ref={barrierTitleRef}
              tabIndex={-1}
              className="mb-3 text-[2.375rem] font-extrabold leading-[1.3] focus:outline-none"
            >
              일할 때 어려운 것이 있나요?
            </h2>
            <p className="mb-6 text-2xl font-normal leading-9 text-[#4D4B46]">
              생활과 가까운 이름을 눌러 골라주세요.
            </p>

            <button
              type="button"
              aria-pressed={profile.barrierNone}
              onClick={chooseBarrierNone}
              className={`mb-4 min-h-[5.5rem] w-full rounded-xl border-[3px] px-5 py-4 text-left text-[1.875rem] font-bold leading-[1.35] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-600 focus-visible:ring-offset-4 ${
                profile.barrierNone
                  ? 'border-primary-600 bg-primary-100'
                  : 'border-primary-600 bg-white'
              }`}
            >
              어려운 일이 없어요
              {profile.barrierNone && (
                <span className="ml-3 text-xl text-primary-800">선택됨</span>
              )}
            </button>

            {profile.barrierIds.length > 0 && (
              <div
                aria-label="선택한 어려운 일"
                className="mb-4 grid min-w-0 gap-3 sm:grid-cols-2"
              >
                {profile.barrierIds.map((id) => (
                  <SelectionChip
                    key={id}
                    label={getBarrierLabel(id)}
                    onRemove={() => onBarrierToggle(id)}
                  />
                ))}
              </div>
            )}

            {profile.barrierIds.length >= MAX_SELECTIONS && (
              <p
                role="status"
                className="mb-4 rounded-xl bg-primary-100 px-5 py-4 text-xl leading-[1.5]"
              >
                5개까지 고르실 수 있어요
              </p>
            )}

            <div className="grid min-w-0 gap-4 sm:grid-cols-2">
              {BARRIER_OPTION_GROUPS.map((group) => (
                <CategoryButton
                  key={group.id}
                  group={group}
                  onClick={() =>
                    setActiveSheet({ kind: 'barrier', groupId: group.id })
                  }
                />
              ))}
            </div>
          </section>
        )}

        {showCertifications && (
          <section
            id="certification-section"
            ref={certificationSectionRef}
            aria-labelledby="certification-title"
            className="scroll-mt-32"
          >
            <h2
              id="certification-title"
              ref={certificationTitleRef}
              tabIndex={-1}
              className="mb-3 text-[2.375rem] font-extrabold leading-[1.3] focus:outline-none"
            >
              가지고 있는 자격증이 있나요?
            </h2>
            <p className="mb-6 text-2xl font-normal leading-9 text-[#4D4B46]">
              가까운 분야를 누르면 자격증 이름이 나와요.
            </p>

            <button
              type="button"
              aria-pressed={profile.certificationNone}
              onClick={chooseCertificationNone}
              className={`mb-4 min-h-[5.5rem] w-full rounded-xl border-[3px] px-5 py-4 text-left text-[1.875rem] font-bold leading-[1.35] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-600 focus-visible:ring-offset-4 ${
                profile.certificationNone
                  ? 'border-primary-600 bg-primary-100'
                  : 'border-primary-600 bg-white'
              }`}
            >
              자격증이 없어요
              {profile.certificationNone && (
                <span className="ml-3 text-xl text-primary-800">선택됨</span>
              )}
            </button>

            {(profile.certificationIds.length > 0 ||
              profile.certificationOther.trim()) && (
              <div
                aria-label="선택하거나 직접 입력한 자격증"
                className="mb-4 grid min-w-0 gap-3 sm:grid-cols-2"
              >
                {profile.certificationIds.map((id) => (
                  <SelectionChip
                    key={id}
                    label={getCertificationLabel(id)}
                    onRemove={() => onCertificationToggle(id)}
                  />
                ))}
                {profile.certificationOther.trim() && (
                  <SelectionChip
                    label={`직접 입력 · ${profile.certificationOther.trim()}`}
                    onRemove={() => onCertificationOtherChange('')}
                  />
                )}
              </div>
            )}

            {certificationSelectionCount >= MAX_SELECTIONS && (
              <p
                role="status"
                className="mb-4 rounded-xl bg-primary-100 px-5 py-4 text-xl leading-[1.5]"
              >
                5개까지 고르실 수 있어요
              </p>
            )}

            <div className="grid min-w-0 gap-4 sm:grid-cols-2">
              {CERTIFICATION_OPTION_GROUPS.map((group) => (
                <CategoryButton
                  key={group.id}
                  group={group}
                  onClick={() =>
                    setActiveSheet({
                      kind: 'certification',
                      groupId: group.id,
                    })
                  }
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-primary-100 bg-[#FAF8F2] px-6 py-4">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4">
          <Button variant="outline" size="xl" onClick={onPrev}>
            이전
          </Button>
          <Button variant="primary" size="xl" onClick={onNext}>
            다음
          </Button>
        </div>
      </footer>

      {activeSheet && activeGroup && (
        <SelectionSheet
          title={activeGroup.label}
          description="고르신 내용은 시트를 닫아도 그대로 남아 있어요."
          onClose={closeSheet}
        >
          <SheetOptionList
            options={activeGroup.options}
            selectedIds={
              activeSheet.kind === 'barrier'
                ? profile.barrierIds
                : profile.certificationIds
            }
            selectionCount={
              activeSheet.kind === 'barrier'
                ? profile.barrierIds.length
                : certificationSelectionCount
            }
            onToggle={
              activeSheet.kind === 'barrier'
                ? onBarrierToggle
                : onCertificationToggle
            }
          />

          {activeSheet.kind === 'certification' && (
            <div className="mt-6 border-t-2 border-primary-100 pt-6">
              <label
                htmlFor="certification-other"
                className="block text-[1.875rem] font-bold leading-[1.35]"
              >
                찾는 게 없어요
              </label>
              <p className="mt-2 text-xl font-normal leading-[1.5] text-[#4D4B46]">
                직접 적은 내용은 추천에 사용하지 않고 상담 때 확인해요.
              </p>
              <input
                id="certification-other"
                type="text"
                value={profile.certificationOther}
                disabled={
                  certificationSelectionCount >= MAX_SELECTIONS &&
                  profile.certificationOther.trim().length === 0
                }
                onChange={(event) =>
                  onCertificationOtherChange(event.target.value)
                }
                placeholder="자격증 이름을 적어주세요"
                className="mt-4 min-h-14 w-full min-w-0 rounded-xl border-[3px] border-[#4D4B46] bg-white px-5 py-3 text-2xl leading-8 placeholder:text-[#4D4B46] disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-600 focus-visible:ring-offset-4"
              />
            </div>
          )}
        </SelectionSheet>
      )}
    </div>
  )
}
