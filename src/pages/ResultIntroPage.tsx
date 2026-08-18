import completeIcon from '../assets/icons/final-flow/s2-complete.svg'
import downIcon from '../assets/icons/final-flow/s2-down.svg'
import nextIcon from '../assets/icons/final-flow/s2-next.svg'
import { FinalFlowHeader } from '../components/final-flow/FinalFlowHeader'

interface ResultIntroPageProps {
  onNext: () => void
  onHelp: () => void
}

export function ResultIntroPage({ onNext, onHelp }: ResultIntroPageProps) {
  return (
    <div className="v6-entry-page relative min-h-[max(100svh,1280px)] overflow-x-hidden rounded-[clamp(20px,3.5vw,28px)] bg-[linear-gradient(90deg,#FEFCF7_0%,#FAFBF7_62%,#EBF5ED_100%)] text-[#14211C] shadow-[0_14px_32px_rgba(20,38,31,0.18)]">
      <div className="relative mx-auto min-h-[max(100svh,1280px)] w-full max-w-[800px]">
        <FinalFlowHeader onHelp={onHelp} />

        <img
          src={completeIcon}
          alt=""
          aria-hidden="true"
          className="absolute left-1/2 top-[220px] size-[clamp(118px,18.75vw,150px)] -translate-x-1/2"
        />
        <h1 className="absolute left-[clamp(20px,8.75vw,70px)] right-[clamp(20px,8.75vw,70px)] top-[405px] text-center text-[clamp(40px,6.75vw,54px)] font-bold leading-[1.35]">
          거의 다 왔어요!
        </h1>
        <p className="absolute left-[clamp(20px,8.75vw,70px)] right-[clamp(20px,8.75vw,70px)] top-[490px] text-center text-[clamp(19px,3.125vw,25px)] font-bold leading-[1.35] text-[#476659]">
          선택한 내용을 상담용으로 정리했어요.
          <br />
          다음 화면을 상담 선생님께 보여주세요.
        </p>
        <img
          src={downIcon}
          alt=""
          aria-hidden="true"
          className="absolute left-1/2 top-[630px] h-[70px] w-[52px] -translate-x-1/2"
        />

        <section
          aria-labelledby="result-preview-title"
          className="absolute left-[clamp(24px,9.375vw,75px)] right-[clamp(24px,9.375vw,75px)] top-[730px] h-[280px] overflow-hidden rounded-[26px] border-[1.5px] border-[#CCDED4] bg-[rgba(255,255,255,0.78)] shadow-[0_8px_20px_rgba(41,71,59,0.10)] backdrop-blur-[7px]"
        >
          <h2
            id="result-preview-title"
            className="absolute left-[24px] right-[24px] top-[22px] text-[clamp(22px,3.375vw,27px)] font-bold leading-[1.4] text-[#1F362E]"
          >
            다음 화면에서 확인할 내용
          </h2>
          <ul className="absolute left-[32px] right-[20px] top-[82px] space-y-[14px] text-[clamp(19px,2.875vw,23px)] font-bold leading-[1.4] text-[#476659]">
            <li>✓ 내가 직접 고른 정보</li>
            <li>✓ 상담에서 먼저 확인할 점</li>
            <li>✓ 함께 확인할 직무 후보</li>
          </ul>
        </section>

        <button
          type="button"
          onClick={onNext}
          className="absolute left-[clamp(24px,9.375vw,75px)] right-[clamp(24px,9.375vw,75px)] top-[1100px] flex h-[92px] items-center justify-center rounded-[22px] bg-[linear-gradient(90deg,#456E94_0%,#6BAD8C_100%)] text-[clamp(25px,3.75vw,30px)] font-bold text-white shadow-[0_8px_18px_rgba(38,79,64,0.20)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#456E94] focus-visible:ring-offset-4"
        >
          상담 결과 보기
          <img
            src={nextIcon}
            alt=""
            aria-hidden="true"
            className="absolute right-[32px] size-[34px]"
          />
        </button>
      </div>
    </div>
  )
}
