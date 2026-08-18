import consultationBulbIcon from '../assets/icons/p0/consultation-bulb.svg'
import consultationHeartIcon from '../assets/icons/p0/consultation-heart.svg'
import startPlayIcon from '../assets/icons/p0/start-play.svg'
import { Button } from '../components/common/Button'

interface StartPageProps {
  onStart: () => void
  onHelp: () => void
}

export function StartPage({ onStart, onHelp }: StartPageProps) {
  return (
    <div className="v6-entry-page relative min-h-[max(100svh,800px)] overflow-x-hidden rounded-[clamp(20px,3.75vw,30px)] bg-[linear-gradient(102.244deg,#FFFDF9_0%,#EDF4F0_103.09%)] text-[#171C1A] shadow-[0_8px_24px_rgba(37,50,45,0.13)]">
      <div className="relative mx-auto min-h-[max(100svh,800px)] w-full max-w-[800px]">
        <div
          aria-hidden="true"
          className="absolute left-[clamp(24px,11.25vw,90px)] top-[clamp(70px,10.9375svh,140px)] size-[clamp(220px,45vw,360px)] rounded-full bg-[rgba(220,234,228,0.72)] blur-[27.5px]"
        />
        <div
          aria-hidden="true"
          className="absolute left-[clamp(120px,48.75vw,390px)] top-[clamp(220px,29.6875svh,380px)] size-[clamp(180px,37.5vw,300px)] rounded-full bg-[rgba(226,237,246,0.68)] blur-[30px]"
        />

        <main>
          <h1 className="absolute left-1/2 top-[clamp(180px,28.125svh,360px)] flex w-[min(644px,calc(100vw-48px))] -translate-x-1/2 flex-col text-center text-[clamp(36px,7vw,56px)] font-extrabold leading-[normal]">
            <span>일을 찾는 첫걸음,</span>
            <span>함께 준비해요</span>
          </h1>

          <Button
            type="button"
            variant="primary"
            size="4xl"
            onClick={onStart}
            className="!absolute !left-1/2 !top-[clamp(460px,62.5svh,800px)] !h-[clamp(80px,13vw,104px)] !min-h-0 !w-[min(600px,calc(100vw-48px))] !-translate-x-1/2 !rounded-[clamp(20px,3.5vw,28px)] !border-0 !bg-[linear-gradient(90deg,#486D92_0%,#71B48F_100%)] !px-0 !py-0 !text-[clamp(32px,5vw,40px)] !font-bold !leading-[normal] !shadow-[0_8px_24px_rgba(37,50,45,0.13)]"
          >
            <img
              src={startPlayIcon}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute left-[clamp(48px,15.333333%,92px)] top-1/2 size-[clamp(38px,5.75vw,46px)] -translate-y-1/2"
            />
            <span>시작하기</span>
          </Button>

          <button
            type="button"
            onClick={onHelp}
            className="absolute left-1/2 top-[clamp(580px,75.78125svh,970px)] h-[196px] w-[min(656px,calc(100vw-48px))] -translate-x-1/2 overflow-hidden rounded-[clamp(20px,3.25vw,26px)] border-[1.5px] border-[#CCDED4] bg-[linear-gradient(90deg,#FAFCF7_0%,#EDF7F0_100%)] text-left shadow-[0_8px_20px_rgba(46,77,64,0.12)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#5E7E72] focus-visible:ring-offset-4 focus-visible:ring-offset-[#FFFDF9] xs:h-[176px]"
          >
            <img
              src={consultationBulbIcon}
              alt=""
              aria-hidden="true"
              className="absolute left-[clamp(16px,2.4375vw,19.5px)] top-[clamp(47.5px,5.9375vw,57px)] size-[clamp(52px,8.5vw,68px)]"
            />

            <span className="absolute left-[clamp(78px,13.6875vw,109.5px)] right-[clamp(95px,21.9375vw,175.5px)] top-[clamp(26px,4.1875vw,33.5px)]">
              <span className="block text-[clamp(20px,3.125vw,25px)] font-bold leading-[1.35] text-[#213830] sm:whitespace-nowrap">
                구직 상담에 도움이 필요하신가요?
              </span>
              <span className="mt-[clamp(6px,1.03125vw,8.25px)] block text-[clamp(16px,2.5vw,20px)] font-bold leading-[1.35] text-[#4D665C] sm:whitespace-nowrap">
                직무 상담에 도움을 드리는 서비스입니다!
              </span>
            </span>

            <img
              src={consultationHeartIcon}
              alt=""
              aria-hidden="true"
              className="absolute right-[clamp(8px,2.8125vw,22.5px)] top-[clamp(39.5px,4.9375vw,51px)] h-[clamp(52px,11.25vw,90px)] w-[clamp(72px,15.5vw,124px)]"
            />
          </button>
        </main>
      </div>
    </div>
  )
}
