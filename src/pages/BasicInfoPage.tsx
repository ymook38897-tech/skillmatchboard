import { useEffect, useRef } from 'react'
import { Button } from '../components/common/Button'
import { TopBar } from '../components/common/TopBar'
import {
  AGE_BAND_OPTIONS,
  MOCK_BARRIER_OPTIONS,
  MOCK_CERTIFICATION_OPTIONS,
} from '../data/profileOptions'
import type { AgeBandId, ProfileDraft } from '../types/flow'

interface BasicInfoPageProps {
  profile: ProfileDraft
  onAgeBandChange: (ageBand: AgeBandId) => void
  onBarrierToggle: (barrierId: string) => void
  onBarrierNone: () => void
  onCertificationToggle: (certificationId: string) => void
  onCertificationNone: () => void
  onNext: () => void
  onPrev: () => void
  onHelp: () => void
}

const MAX_SELECTIONS = 5

export function BasicInfoPage({
  profile,
  onAgeBandChange,
  onBarrierToggle,
  onBarrierNone,
  onCertificationToggle,
  onCertificationNone,
  onNext,
  onPrev,
  onHelp,
}: BasicInfoPageProps) {
  const barrierSectionRef = useRef<HTMLElement>(null)
  const certificationSectionRef = useRef<HTMLElement>(null)
  const previousAgeBandRef = useRef<AgeBandId | null>(profile.ageBand)
  const hadBarrierDecisionRef = useRef(
    profile.barrierNone || profile.barrierIds.length > 0,
  )

  const showBarriers = profile.ageBand !== null
  const hasBarrierDecision =
    profile.barrierNone || profile.barrierIds.length > 0
  const showCertifications = showBarriers && hasBarrierDecision

  useEffect(() => {
    if (previousAgeBandRef.current === null && profile.ageBand !== null) {
      barrierSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
    previousAgeBandRef.current = profile.ageBand
  }, [profile.ageBand])

  useEffect(() => {
    if (!hadBarrierDecisionRef.current && hasBarrierDecision) {
      certificationSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
    hadBarrierDecisionRef.current = hasBarrierDecision
  }, [hasBarrierDecision])

  return (
    <div className="min-h-screen bg-[#FAF8F2] pb-40 text-[#0D0C0C]">
      <TopBar pageId="P3" onHelp={onHelp} />
      <main className="mx-auto w-full max-w-5xl px-6 pt-32">
        <h1 className="mb-5 text-[2.75rem] font-extrabold leading-tight">
          먼저 기본 정보를 알려주세요
        </h1>
        <p className="mb-10 text-2xl leading-normal text-[#4D4B46]">
          하나를 고르면 다음 항목이 아래에 나타나요.
        </p>

        <section aria-labelledby="age-band-title" className="mb-12">
          <h2 id="age-band-title" className="mb-6 text-[2.375rem] font-extrabold leading-tight">
            나이를 알려주세요
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {AGE_BAND_OPTIONS.map((option) => {
              const selected = profile.ageBand === option.id
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onAgeBandChange(option.id)}
                  className={`min-h-[5.5rem] rounded-xl border-4 px-5 py-4 text-left text-3xl font-bold leading-snug focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-600 focus-visible:ring-offset-4 ${
                    selected
                      ? 'border-primary-600 bg-primary-100'
                      : 'border-[#4D4B46] bg-white'
                  }`}
                >
                  {selected ? '선택됨 · ' : ''}
                  {option.label}
                </button>
              )
            })}
          </div>
        </section>

        {showBarriers && (
          <section
            ref={barrierSectionRef}
            aria-labelledby="barrier-title"
            className="mb-12 scroll-mt-32"
          >
            <h2 id="barrier-title" className="mb-3 text-[2.375rem] font-extrabold leading-tight">
              일할 때 어려운 것이 있나요?
            </h2>
            <p className="mb-6 text-xl leading-normal text-[#4D4B46]">
              이 단계에서는 대표 항목으로 선택 흐름만 확인합니다. 최대 5개까지
              고를 수 있어요.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {MOCK_BARRIER_OPTIONS.map((option) => {
                const selected = profile.barrierIds.includes(option.id)
                const disabled =
                  profile.barrierNone ||
                  (!selected && profile.barrierIds.length >= MAX_SELECTIONS)

                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={selected}
                    disabled={disabled}
                    onClick={() => onBarrierToggle(option.id)}
                    className={`min-h-[5.5rem] rounded-xl border-4 px-5 py-4 text-left text-3xl font-bold leading-snug disabled:opacity-45 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-600 focus-visible:ring-offset-4 ${
                      selected
                        ? 'border-primary-600 bg-primary-100'
                        : 'border-[#4D4B46] bg-white'
                    }`}
                  >
                    {selected ? '선택됨 · ' : ''}
                    {option.label}
                  </button>
                )
              })}
            </div>
            <Button
              variant={profile.barrierNone ? 'primary' : 'outline'}
              size="xl"
              onClick={onBarrierNone}
              className="mt-4 w-full"
            >
              어려운 일이 없어요
            </Button>
          </section>
        )}

        {showCertifications && (
          <section
            ref={certificationSectionRef}
            aria-labelledby="certification-title"
            className="scroll-mt-32"
          >
            <h2 id="certification-title" className="mb-3 text-[2.375rem] font-extrabold leading-tight">
              가지고 있는 자격증이 있나요?
            </h2>
            <p className="mb-6 text-xl leading-normal text-[#4D4B46]">
              실제 자격증 목록이 연결되기 전 대표 항목만 보여드려요.
            </p>
            <Button
              variant={profile.certificationNone ? 'primary' : 'outline'}
              size="xl"
              onClick={onCertificationNone}
              className="mb-4 w-full"
            >
              자격증이 없어요
            </Button>
            <div className="grid gap-4 sm:grid-cols-2">
              {MOCK_CERTIFICATION_OPTIONS.map((option) => {
                const selected = profile.certificationIds.includes(option.id)
                const disabled =
                  profile.certificationNone ||
                  (!selected &&
                    profile.certificationIds.length >= MAX_SELECTIONS)

                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={selected}
                    disabled={disabled}
                    onClick={() => onCertificationToggle(option.id)}
                    className={`min-h-[5.5rem] rounded-xl border-4 px-5 py-4 text-left text-3xl font-bold leading-snug disabled:opacity-45 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-600 focus-visible:ring-offset-4 ${
                      selected
                        ? 'border-primary-600 bg-primary-100'
                        : 'border-[#4D4B46] bg-white'
                    }`}
                  >
                    {selected ? '선택됨 · ' : ''}
                    {option.label}
                  </button>
                )
              })}
            </div>
          </section>
        )}
      </main>

      <footer className="fixed inset-x-0 bottom-0 border-t-2 border-primary-100 bg-[#FAF8F2] px-6 py-4">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4">
          <Button variant="outline" size="xl" onClick={onPrev}>
            이전
          </Button>
          <Button
            variant="primary"
            size="xl"
            onClick={onNext}
            disabled={!showCertifications}
          >
            다음
          </Button>
        </div>
      </footer>
    </div>
  )
}
