import { useState } from 'react'
import bodyIcon from '../assets/icons/barriers-final/body.svg'
import handsIcon from '../assets/icons/barriers-final/hands.svg'
import instructionsIcon from '../assets/icons/barriers-final/instructions.svg'
import noneIcon from '../assets/icons/barriers-final/none.svg'
import sensesIcon from '../assets/icons/barriers-final/senses.svg'
import nextIcon from '../assets/icons/p1/next.svg'
import previousIcon from '../assets/icons/p1/previous.svg'
import staffHeadsetIcon from '../assets/icons/p1/staff-headset.svg'
import { Button } from '../components/common/Button'
import {
  BARRIER_ACCORDION_GROUPS,
  type BarrierAccordionIcon,
} from '../data/profileOptions'

interface BarrierSelectionPageProps {
  selectedIds: readonly string[]
  noneSelected: boolean
  onToggle: (barrierId: string) => void
  onNone: () => void
  onPrev: () => void
  onNext: () => void
  onHelp: () => void
}

type BarrierAccordionGroupId =
  (typeof BARRIER_ACCORDION_GROUPS)[number]['id']

const BARRIER_ICONS: Record<BarrierAccordionIcon, string> = {
  body: bodyIcon,
  senses: sensesIcon,
  hands: handsIcon,
  instructions: instructionsIcon,
}

export function BarrierSelectionPage({
  selectedIds,
  noneSelected,
  onToggle,
  onNone,
  onPrev,
  onNext,
  onHelp,
}: BarrierSelectionPageProps) {
  const [expandedGroupId, setExpandedGroupId] =
    useState<BarrierAccordionGroupId | null>('physical-work')

  const toggleGroup = (groupId: BarrierAccordionGroupId) => {
    setExpandedGroupId((previous) =>
      previous === groupId ? null : groupId,
    )
  }

  const handleNone = () => {
    if (!noneSelected) {
      setExpandedGroupId(null)
    }
    onNone()
  }

  return (
    <div className="v6-entry-page relative min-h-[max(100svh,800px)] overflow-x-hidden rounded-[clamp(20px,3.75vw,30px)] bg-[linear-gradient(102.244deg,#FFFDF9_0%,#EDF4F0_103.09%)] text-[#171C1A] shadow-[0_8px_24px_rgba(37,50,45,0.13)]">
      <div className="relative mx-auto min-h-[max(100svh,800px)] w-full max-w-[800px]">
        <header className="absolute inset-x-0 top-0 z-20 h-[clamp(96px,14.5vw,116px)] bg-[rgba(255,255,255,0.72)] shadow-[0_8px_24px_rgba(37,50,45,0.13)] backdrop-blur-[9px]">
          <div className="absolute left-[clamp(16px,4.75vw,38px)] top-[clamp(14px,2.25vw,18px)] h-[clamp(68px,9.75vw,78px)] w-[clamp(144px,45vw,360px)]">
            <p className="h-[clamp(26px,4.25vw,34px)] whitespace-pre-wrap text-[clamp(17px,2.75vw,22px)] font-bold leading-[normal] text-[#5E8C7A]">
              기본 정보&nbsp; 2 / 5
            </p>
            <div className="absolute inset-x-0 top-[clamp(43px,6.375vw,51px)] h-[clamp(8px,1.25vw,10px)] overflow-hidden rounded-full bg-[#D9E3E0]">
              <div className="h-full w-2/5 rounded-full bg-[#5E8C7A]" />
            </div>
          </div>

          <button
            type="button"
            onClick={onHelp}
            className="absolute right-[clamp(8px,3.5vw,28px)] top-[clamp(12px,2.5vw,20px)] flex h-[clamp(68px,9.5vw,76px)] w-[clamp(140px,28vw,224px)] items-center justify-center gap-[clamp(7px,1.5vw,12px)] rounded-[clamp(17px,2.375vw,19px)] border-[1.5px] border-[#5D776F] bg-[rgba(255,255,255,0.78)] text-[clamp(17px,3.125vw,25px)] font-bold leading-[normal] text-[#38564E] shadow-[0_8px_12px_rgba(37,50,45,0.14)] backdrop-blur-[9px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#5E7E72] focus-visible:ring-offset-4 focus-visible:ring-offset-[#FFFDF9]"
          >
            <img
              src={staffHeadsetIcon}
              alt=""
              aria-hidden="true"
              className="size-[clamp(28px,4.75vw,38px)]"
            />
            <span className="whitespace-nowrap">직원 상담</span>
          </button>
        </header>

        <main className="relative min-h-[max(100svh,800px)] pb-[clamp(160px,23vw,184px)] pt-[clamp(238px,31.25vw,250px)]">
          <h1 className="absolute left-[clamp(16px,4vw,32px)] right-[clamp(16px,4vw,32px)] top-[clamp(128px,17.75vw,142px)] text-[clamp(30px,5.25vw,42px)] font-bold leading-[normal]">
            하기 부담되는 일이 있나요?
          </h1>
          <p className="absolute left-[clamp(16px,4vw,32px)] right-[clamp(16px,4vw,32px)] top-[clamp(180px,25vw,200px)] text-[clamp(19px,3vw,24px)] font-bold leading-[normal] text-[#61716B]">
            여러 개 골라도 괜찮아요.
          </p>

          <section
            aria-label="어려운 일 선택"
            className="mx-[clamp(12px,3.25vw,26px)] flex flex-col gap-[clamp(14px,2.5vw,20px)]"
          >
            {BARRIER_ACCORDION_GROUPS.map((group, index) => {
              const expanded = expandedGroupId === group.id
              const selectedCount = group.options.filter((option) =>
                selectedIds.includes(option.id),
              ).length
              const panelId = `barrier-options-${group.id}`
              const isBodyGroup = index === 0

              return (
                <article
                  key={group.id}
                  className="overflow-hidden rounded-[clamp(16px,2.75vw,22px)] border-[1.5px] border-[#CED8D3] bg-[rgba(255,255,255,0.86)]"
                >
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={panelId}
                    onClick={() => toggleGroup(group.id)}
                    className={`relative flex w-full items-center text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#5E7E72] ${
                      group.id === 'multi-step-work'
                        ? 'min-h-[110px] sm:min-h-[90px]'
                        : 'h-[90px]'
                    } ${
                      isBodyGroup
                        ? 'gap-[clamp(12px,2vw,16px)] px-[clamp(14px,2.625vw,21px)]'
                        : 'gap-[clamp(12px,2vw,16px)] px-[clamp(14px,2.375vw,19px)]'
                    }`}
                  >
                    <img
                      src={BARRIER_ICONS[group.icon]}
                      alt=""
                      aria-hidden="true"
                      className={
                        isBodyGroup
                          ? 'size-[clamp(46px,6.75vw,54px)] shrink-0'
                          : 'size-[clamp(44px,6.25vw,50px)] shrink-0'
                      }
                    />
                    <span className="min-w-0 pr-[clamp(48px,8.5vw,68px)]">
                      <span
                        className={`block font-bold text-[#171C1A] ${
                          isBodyGroup
                            ? 'text-[clamp(21px,3.375vw,27px)] leading-[normal]'
                            : 'text-[clamp(17px,3vw,24px)] leading-[1.2]'
                        }`}
                      >
                        {group.label}
                      </span>
                      <span
                        className={`mt-[clamp(1px,0.5vw,4px)] block whitespace-nowrap font-bold leading-[normal] text-[#61716B] ${
                          isBodyGroup
                            ? 'text-[clamp(14px,2.25vw,18px)]'
                            : 'text-[clamp(13px,2.125vw,17px)]'
                        }`}
                      >
                        {group.summary}
                      </span>
                    </span>
                    {selectedCount > 0 ? (
                      <span className="absolute right-[clamp(50px,10vw,80px)] top-1/2 -translate-y-1/2 whitespace-nowrap text-[clamp(17px,3vw,24px)] font-bold leading-[normal] text-[#38564E]">
                        {selectedCount}개 선택
                      </span>
                    ) : null}
                    <span
                      aria-hidden="true"
                      className="absolute right-[clamp(20px,4vw,32px)] top-1/2 -translate-y-1/2 text-[clamp(27px,4.25vw,34px)] font-bold leading-none text-[#38564E]"
                    >
                      {expanded ? '⌃' : '⌄'}
                    </span>
                  </button>

                  {expanded ? (
                    <div
                      id={panelId}
                      className="mx-[clamp(10px,2.0625vw,16.5px)] mb-[clamp(18px,3.0625vw,24.5px)] grid gap-[clamp(9px,1.375vw,11px)] pt-[4.5px]"
                    >
                      {group.options.map((option) => {
                        const selected = selectedIds.includes(option.id)

                        return (
                          <button
                            key={option.id}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => onToggle(option.id)}
                            className={`flex h-[62px] min-w-0 items-center gap-[clamp(12px,3vw,24px)] rounded-[clamp(12px,1.75vw,14px)] border-[1.5px] px-[clamp(12px,2.3125vw,18.5px)] text-left text-[clamp(17px,2.625vw,21px)] font-bold leading-[normal] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#5E7E72] focus-visible:ring-offset-2 ${
                              selected
                                ? 'border-[#5D776F] bg-[#DCEAE4] text-[#38564E]'
                                : 'border-[#CED8D3] bg-white text-[#171C1A]'
                            }`}
                          >
                            <span
                              aria-hidden="true"
                              className={`flex size-[34px] shrink-0 items-center justify-center rounded-full border-[1.5px] text-[24px] font-bold leading-none ${
                                selected
                                  ? 'border-[#5D776F] bg-[#5D776F] text-white'
                                  : 'border-[#CED8D3] bg-white text-transparent'
                              }`}
                            >
                              ✓
                            </span>
                            <span className="min-w-0">{option.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  ) : null}
                </article>
              )
            })}

            <button
              type="button"
              aria-pressed={noneSelected}
              onClick={handleNone}
              className={`flex h-[88px] w-full items-center gap-[clamp(16px,2.75vw,22px)] rounded-[clamp(16px,2.25vw,18px)] border-[1.5px] px-[clamp(14px,2.625vw,21px)] text-left text-[clamp(18px,3vw,24px)] font-bold leading-[normal] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#5E7E72] focus-visible:ring-offset-4 focus-visible:ring-offset-[#FFFDF9] ${
                noneSelected
                  ? 'border-[#5D776F] bg-[#DCEAE4] text-[#38564E]'
                  : 'border-[#CED8D3] bg-white text-[#171C1A]'
              }`}
            >
              <img
                src={noneIcon}
                alt=""
                aria-hidden="true"
                className="size-[44px] shrink-0"
              />
              <span>특별히 어려운 일은 없어요</span>
            </button>
          </section>
        </main>
      </div>

      <footer className="fixed bottom-0 left-1/2 z-30 h-[clamp(108px,15.5vw,124px)] w-full max-w-[800px] -translate-x-1/2 bg-[rgba(255,255,255,0.78)] px-[clamp(16px,3vw,24px)] py-[clamp(14px,2.75vw,22px)] shadow-[0_-5px_18px_rgba(37,50,45,0.10)] backdrop-blur-[9px]">
        <div className="grid h-full w-full grid-cols-[minmax(0,0.759615fr)_minmax(0,1fr)] gap-[clamp(12px,2.5vw,20px)]">
          <Button
            type="button"
            variant="outline"
            size="xl"
            onClick={onPrev}
            className="!h-full !min-h-0 !rounded-[clamp(16px,2.25vw,18px)] !border-[1.5px] !border-[#CED8D3] !bg-[rgba(255,255,255,0.88)] !px-0 !py-0 !text-[clamp(23px,3.375vw,27px)] !font-bold !leading-[normal] !text-[#171C1A] !shadow-[0_8px_12px_rgba(37,50,45,0.14)]"
          >
            <img
              src={previousIcon}
              alt=""
              aria-hidden="true"
              className="mr-[clamp(8px,1.5vw,12px)] size-[clamp(30px,4.5vw,36px)]"
            />
            이전
          </Button>
          <Button
            type="button"
            variant="primary"
            size="xl"
            onClick={onNext}
            disabled={!noneSelected && selectedIds.length === 0}
            className="!h-full !min-h-0 !rounded-[clamp(16px,2.25vw,18px)] !border-0 !bg-[linear-gradient(90deg,#486D92_0%,#71B48F_100%)] !px-0 !py-0 !text-[clamp(23px,3.375vw,27px)] !font-bold !leading-[normal] !shadow-[0_8px_12px_rgba(37,50,45,0.14)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            다음
            <img
              src={nextIcon}
              alt=""
              aria-hidden="true"
              className="ml-[clamp(8px,1.5vw,12px)] size-[clamp(30px,4.5vw,36px)]"
            />
          </Button>
        </div>
      </footer>
    </div>
  )
}
