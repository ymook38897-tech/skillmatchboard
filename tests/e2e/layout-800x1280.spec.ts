import { expect, test, type Page } from '@playwright/test'

test.use({ viewport: { width: 800, height: 1280 } })

const QUESTION_TEXT: Record<string, string> = {
  C: '고깃집처럼 연기와 냄새가 많은 곳에서 오래 서서 일하는 것은 피하고 싶어요.',
  D: '예전에 식당에서 손님을 안내하고 주문을 받은 뒤 주방 정리와 계산을 도운 경험이 있어요.',
  E: '사람들과 편안하게 이야기하면서 물건과 서류를 차분하게 정리하는 일을 해보고 싶어요.',
  F: '처음 보는 사람에게도 친절하게 설명하고 해야 할 일을 순서대로 정리하는 데 자신 있어요.',
  G: '운전면허증과 컴퓨터활용능력 자격증을 가지고 있어요.',
}

const JOBS = Array.from({ length: 5 }, (_, index) => ({
  id: index + 1,
  name: [
    '고객 상담 및 접수 사무원',
    '물류·배송 운영 지원 사무원',
    '음식 서비스 매장 관리 보조원',
    '문서 정리 및 자료 입력 사무원',
    '시설 안내 및 방문객 응대원',
  ][index],
  easyName: null,
  description: null,
  categoryId: 1,
  categoryName: '서비스',
  subCategoryName: null,
  detailCategoryName: null,
  requiresCert: false,
  certNote: null,
  isRecommendable: true,
  reason: '답변의 경험 및 희망 조건과 관련된 직무입니다.',
  matchedKeywords: ['customer_service'],
}))

interface LayoutMetrics {
  screen: string
  viewport: { width: number; height: number }
  documentScrollHeight: number
  hasDocumentScroll: boolean
  main: {
    top: number
    bottom: number
    height: number
    clientHeight: number
    scrollHeight: number
    hiddenOverflow: number
  } | null
  footer: { top: number; bottom: number; height: number } | null
  maxContentBottom: number
  footerOverlap: number
  outOfViewport: Array<{
    tag: string
    text: string
    top: number
    bottom: number
  }>
}

async function measureLayout(page: Page, screen: string) {
  const metrics = await page.evaluate((screenName): LayoutMetrics => {
    const round = (value: number) => Math.round(value * 10) / 10
    const main = document.querySelector('main')
    const footer = main?.querySelector('footer') ?? null
    const mainRect = main?.getBoundingClientRect() ?? null
    const footerRect = footer?.getBoundingClientRect() ?? null

    const contentElements = main
      ? Array.from(
          main.querySelectorAll(
            'h1, h2, p, article, section button, main > button',
          ),
        ).filter((element) => !footer?.contains(element))
      : []
    const contentBottoms = contentElements
      .map((element) => element.getBoundingClientRect())
      .filter((rect) => rect.width > 0 && rect.height > 0)
      .map((rect) => rect.bottom)
    const maxContentBottom = contentBottoms.length
      ? Math.max(...contentBottoms)
      : 0

    const viewportCandidates = main
      ? Array.from(main.querySelectorAll('h1, h2, p, article, button, footer'))
      : []
    const outOfViewport = viewportCandidates
      .map((element) => ({
        element,
        rect: element.getBoundingClientRect(),
      }))
      .filter(
        ({ rect }) =>
          rect.width > 0 &&
          rect.height > 0 &&
          (rect.top < -1 || rect.bottom > window.innerHeight + 1),
      )
      .slice(0, 12)
      .map(({ element, rect }) => ({
        tag: element.tagName.toLowerCase(),
        text: (element.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 80),
        top: round(rect.top),
        bottom: round(rect.bottom),
      }))

    return {
      screen: screenName,
      viewport: { width: window.innerWidth, height: window.innerHeight },
      documentScrollHeight: document.documentElement.scrollHeight,
      hasDocumentScroll:
        document.documentElement.scrollHeight > window.innerHeight + 1,
      main: mainRect
        ? {
            top: round(mainRect.top),
            bottom: round(mainRect.bottom),
            height: round(mainRect.height),
            clientHeight: main?.clientHeight ?? 0,
            scrollHeight: main?.scrollHeight ?? 0,
            hiddenOverflow: Math.max(
              0,
              (main?.scrollHeight ?? 0) - (main?.clientHeight ?? 0),
            ),
          }
        : null,
      footer: footerRect
        ? {
            top: round(footerRect.top),
            bottom: round(footerRect.bottom),
            height: round(footerRect.height),
          }
        : null,
      maxContentBottom: round(maxContentBottom),
      footerOverlap: footerRect
        ? round(Math.max(0, maxContentBottom - footerRect.top))
        : 0,
      outOfViewport,
    }
  }, screen)

  console.log(`LAYOUT ${JSON.stringify(metrics)}`)
  return metrics
}

async function recordAnswer(page: Page) {
  await page.getByRole('button', { name: '말하기' }).click()
  await expect(
    page.getByRole('button', { name: '녹음 끝내기' }),
  ).toBeVisible()
  await page.waitForTimeout(1_100)
  await page.getByRole('button', { name: '녹음 끝내기' }).click()
  await expect(page.getByText('인식한 답변')).toBeVisible()
}

test('800x1280 전체 화면 레이아웃 측정', async ({ page }) => {
  await page.route('**/api/sessions', async (route) => {
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({
        sessionId: 'layout-session',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 1_200_000).toISOString(),
        idleTimeoutSeconds: 300,
        maxTtlSeconds: 1_200,
      }),
    })
  })

  await page.route('**/voice-answers', async (route) => {
    const request = route.request().postDataJSON() as { questionKey: string }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        sessionId: 'layout-session',
        questionKey: request.questionKey,
        status: 'ok',
        sttText: QUESTION_TEXT[request.questionKey],
        keywords: ['customer_service'],
        confidence: 0.98,
        answeredAt: new Date().toISOString(),
      }),
    })
  })

  await page.route('**/voice-recommendations', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 700))
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        sessionId: 'layout-session',
        basedOnQuestions: ['C', 'D', 'E', 'F', 'G'],
        generatedAt: new Date().toISOString(),
        total: 5,
        isFallback: false,
        jobs: JOBS,
      }),
    })
  })

  const results: LayoutMetrics[] = []
  await page.goto('./')
  results.push(await measureLayout(page, 'StartPage'))

  await page.getByRole('button', { name: '시작하기' }).click()
  results.push(await measureLayout(page, 'TutorialPage-1'))
  await page.getByRole('button', { name: '다음', exact: true }).click()
  results.push(await measureLayout(page, 'TutorialPage-2'))
  await page.getByRole('button', { name: '다음', exact: true }).click()
  results.push(await measureLayout(page, 'TutorialPage-3'))

  await page.getByRole('button', { name: '시작하기' }).click()
  await expect(page.getByRole('button', { name: '말하기' })).toBeEnabled()
  results.push(await measureLayout(page, 'VoiceQuestionPage-idle'))

  for (let index = 0; index < 5; index += 1) {
    await recordAnswer(page)
    if (index === 0) {
      results.push(await measureLayout(page, 'VoiceQuestionPage-success'))
    }
    await page.getByRole('button', { name: '다음', exact: true }).click()
  }

  results.push(
    await measureLayout(page, 'VoiceCertificationSelectionPage'),
  )
  await page.getByRole('button', { name: '안 고르기' }).click()
  results.push(await measureLayout(page, 'AnswerReviewPage'))

  await page.getByRole('button', { name: '직무 찾기' }).click()
  await expect(page.getByRole('status')).toBeVisible()
  results.push(await measureLayout(page, 'LoadingScreen'))
  await expect(
    page.getByRole('heading', { name: '잘 맞는 직무를 선택해주세요' }),
  ).toBeVisible()
  results.push(await measureLayout(page, 'JobRecommendationPage'))

  const cards = page.locator('button[aria-pressed]')
  await cards.nth(0).click()
  await cards.nth(1).click()
  await cards.nth(2).click()
  await page.getByRole('button', { name: '선택 완료' }).click()
  results.push(await measureLayout(page, 'ResumeGenerationPage'))

  expect(results.every((result) => result.viewport.width === 800)).toBe(true)
  expect(results.every((result) => result.viewport.height === 1280)).toBe(true)
  for (const result of results) {
    expect.soft(result.hasDocumentScroll, `${result.screen}: document scroll`).toBe(false)
    expect.soft(result.main?.hiddenOverflow, `${result.screen}: hidden overflow`).toBe(0)
    expect.soft(result.footerOverlap, `${result.screen}: footer overlap`).toBe(0)
    expect.soft(result.outOfViewport, `${result.screen}: viewport clipping`).toEqual([])
  }
})
