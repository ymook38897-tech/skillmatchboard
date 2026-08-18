import nextIcon from '../assets/icons/p1/next.svg'
import previousIcon from '../assets/icons/p1/previous.svg'
import staffHeadsetIcon from '../assets/icons/p1/staff-headset.svg'
import { Button } from '../components/common/Button'
import {
  WORK_PREFERENCE_GROUPS,
  type WorkPreferenceDraft,
  type WorkPreferenceOptionId,
  type WorkPreferenceQuestionId,
} from '../data/workPreferenceOptions'

interface WorkPreferencePageProps {
  value: WorkPreferenceDraft
  onChange: (
    questionId: WorkPreferenceQuestionId,
    optionId: WorkPreferenceOptionId,
  ) => void
  onPrev: () => void
  onNext: () => void
  onHelp: () => void
}

function getOptionClassName(isAny: boolean, selected: boolean): string {
  const base =
    'flex h-[64px] min-w-0 items-center justify-center gap-[clamp(7px,1.25vw,10px)] rounded-[clamp(14px,2.25vw,18px)] border-2 px-[clamp(8px,1.5vw,12px)] text-[clamp(17px,2.75vw,22px)] font-bold leading-[normal] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#5E7E72] focus-visible:ring-offset-2'

  if (isAny) {
    return [
      base,
      selected
        ? 'border-[#B84738] bg-[#FCEDE9]'
        : 'border-[#B84738] bg-[#FDFCF9]',
    ].join(' ')
  }

  return [
    base,
    selected
      ? 'border-[#597A70] bg-[#DCEAE4] text-[#597A70]'
      : 'border-[#C9D6D1] bg-[#FDFCF9] text-[#141414]',
  ].join(' ')
}

export function WorkPreferencePage({
  value,
  onChange,
  onPrev,
  onNext,
  onHelp,
}: WorkPreferencePageProps) {
  return (
    <div className="v6-entry-page relative min-h-[max(100svh,1460px)] overflow-x-hidden rounded-[clamp(20px,3.75vw,30px)] bg-[linear-gradient(102.244deg,#FFFDF9_0%,#EDF4F0_103.09%)] text-[#171C1A] shadow-[0_8px_24px_rgba(37,50,45,0.13)] sm:min-h-[max(100svh,1280px)]">
      <div className="relative mx-auto min-h-[max(100svh,1460px)] w-full max-w-[800px] sm:min-h-[max(100svh,1280px)]">
        <header className="absolute inset-x-0 top-0 z-20 h-[clamp(96px,14.5vw,116px)] bg-[rgba(255,255,255,0.72)] shadow-[0_8px_24px_rgba(37,50,45,0.13)] backdrop-blur-[9px]">
          <div className="absolute left-[clamp(16px,4.75vw,38px)] top-[clamp(14px,2.25vw,18px)] h-[clamp(68px,9.75vw,78px)] w-[clamp(144px,45vw,360px)]">
            <p className="h-[clamp(26px,4.25vw,34px)] whitespace-pre-wrap text-[clamp(17px,2.75vw,22px)] font-bold leading-[normal] text-[#5E8C7A]">
              기본 정보  3 / 5
            </p>
            <div className="absolute inset-x-0 top-[clamp(43px,6.375vw,51px)] h-[clamp(8px,1.25vw,10px)] overflow-hidden rounded-full bg-[#D9E3E0]">
              <div className="h-full w-3/5 rounded-full bg-[#5E8C7A]" />
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

        <main>
          <h1 className="absolute left-[clamp(16px,4.25vw,34px)] right-[clamp(16px,4.25vw,34px)] top-[clamp(132px,18.25vw,146px)] text-[clamp(30px,5vw,40px)] font-extrabold leading-[normal]">
            원하는 근무 방식을 골라주세요
          </h1>
          <p className="absolute left-[clamp(16px,4.25vw,34px)] right-[clamp(16px,4.25vw,34px)] top-[clamp(184px,25.5vw,204px)] text-[clamp(17px,2.75vw,22px)] font-bold leading-[normal] text-[#61716B]">
            정하기 어려운 항목은 ‘상관없어요’를 눌러도 됩니다.
          </p>

          <section
            aria-label="근무 방식 선택"
            className="absolute left-[clamp(12px,4vw,32px)] right-[clamp(12px,4vw,32px)] top-[clamp(246px,33vw,264px)] grid gap-[clamp(16px,3vw,24px)]"
          >
            {WORK_PREFERENCE_GROUPS.map((group) => (
              <fieldset
                key={group.id}
                className="relative min-w-0 min-h-[230px] rounded-[clamp(18px,2.75vw,22px)] border-[1.5px] border-[#CED8D3] bg-[rgba(255,255,255,0.84)] px-[clamp(14px,2.25vw,18px)] pb-[clamp(14px,2.25vw,18px)] pt-[clamp(54px,10vw,80px)] shadow-[0_8px_18px_rgba(37,50,45,0.10)] backdrop-blur-[9px] sm:h-[186px] sm:min-h-0 sm:px-0 sm:pb-0 sm:pt-0"
              >
                <legend className="absolute left-[clamp(18px,2.8125vw,22.5px)] top-[clamp(14px,2.3125vw,18.5px)] text-[clamp(20px,3.125vw,25px)] font-bold leading-[normal]">
                  {group.question}
                </legend>

                <div className="grid grid-cols-2 gap-[clamp(10px,1.625vw,13px)] sm:absolute sm:left-[16.5px] sm:top-[80.5px] sm:w-[679px] sm:grid-cols-4">
                  {group.options.map((option) => {
                    const selected = value[group.id] === option.id
                    const isAny = 'isAny' in option && option.isAny
                    const icon =
                      selected && 'selectedIcon' in option
                        ? option.selectedIcon
                        : option.icon

                    return (
                      <button
                        key={option.id}
                        type="button"
                        aria-pressed={selected}
                        aria-label={isAny ? option.label : undefined}
                        onClick={() => onChange(group.id, option.id)}
                        className={getOptionClassName(isAny, selected)}
                      >
                        <img
                          src={icon}
                          alt=""
                          aria-hidden="true"
                          className={
                            isAny
                              ? 'size-[22px]'
                              : 'size-[clamp(25px,3.75vw,30px)] object-contain'
                          }
                        />
                        {isAny ? (
                          <span className="sr-only">{option.label}</span>
                        ) : (
                          <span className="whitespace-nowrap">
                            {option.label}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </fieldset>
            ))}
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
            disabled={Object.values(value).some((v) => v === null)}
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
