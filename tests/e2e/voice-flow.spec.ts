import { expect, test, type Page } from '@playwright/test'

const VOICE_QUESTIONS = [
  { key: 'C', title: '피하고 싶은 일이 있나요?' },
  { key: 'D', title: '기억나는 일이 있나요?' },
  { key: 'E', title: '해보고 싶은 일이 있나요?' },
  { key: 'F', title: '평소에 자주 하는 일이 있나요?' },
  { key: 'G', title: '자격증이 있으신가요?' },
] as const

interface VoiceAnswerResponse {
  questionKey: string
  status: string
  sttText: string
  confidence: number
}

interface RecommendationJob {
  id: number
  name: string
  easyName: string | null
}

interface RecommendationResponse {
  basedOnQuestions: string[]
  total: number
  jobs: RecommendationJob[]
}

async function recordAndSubmit(
  page: Page,
  question: (typeof VOICE_QUESTIONS)[number],
) {
  await expect(
    page.getByRole('heading', { name: question.title }),
  ).toBeVisible()

  const startButton = page.getByRole('button', { name: '말하기' })
  await expect(startButton).toBeEnabled()
  await startButton.click()

  const stopButton = page.getByRole('button', { name: '녹음 끝내기' })
  await expect(stopButton).toBeVisible()
  await expect(page.locator('span.sr-only')).toHaveText(
    /(?:1\.[2-9]|[2-9]\d*\.\d)초/,
  )

  const responsePromise = page.waitForResponse(
    (response) => {
      const request = response.request()
      if (
        request.method() !== 'POST' ||
        !response.url().endsWith('/voice-answers')
      ) {
        return false
      }

      const body = request.postDataJSON() as { questionKey?: string } | null
      return body?.questionKey === question.key
    },
    { timeout: 125_000 },
  )

  await stopButton.click()
  const response = await responsePromise
  expect(response.status()).toBe(200)

  const requestBody = response.request().postDataJSON() as {
    questionKey: string
    audio: { format: string; encoding: string; data: string }
  }
  expect(requestBody.questionKey).toBe(question.key)
  expect(requestBody.audio.format).toBe('webm')
  expect(requestBody.audio.encoding).toBe('base64')
  expect(requestBody.audio.data.length).toBeGreaterThan(0)

  const responseBody = (await response.json()) as VoiceAnswerResponse
  expect(responseBody).toMatchObject({
    questionKey: question.key,
    status: 'ok',
    confidence: 0.99,
  })
  expect(responseBody.sttText.length).toBeGreaterThan(0)
  await expect(
    page.getByText(responseBody.sttText, { exact: true }),
  ).toBeVisible()

  await page.getByRole('button', { name: '다음', exact: true }).click()
}

test('Tutorial skip부터 Resume과 처음 화면 복귀까지 실제 Render flow가 동작한다', async ({
  page,
}) => {
  test.setTimeout(420_000)

  await page.goto('./')
  await expect(
    page.getByRole('heading', { name: '희망직종 찾기' }),
  ).toBeVisible()

  await page.getByRole('button', { name: '시작하기' }).click()
  await expect(page.getByText('1/3', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: '건너뛰기' }).click()
  await expect(
    page.getByRole('heading', { name: VOICE_QUESTIONS[0].title }),
  ).toBeVisible()

  for (const question of VOICE_QUESTIONS) {
    await recordAndSubmit(page, question)
  }

  await expect(
    page.getByRole('heading', { name: '보유한 자격증을 선택해 주세요' }),
  ).toBeVisible()
  await page.getByRole('button', { name: '안 고르기' }).click()

  await expect(
    page.getByRole('heading', { name: '답변을 확인해 주세요' }),
  ).toBeVisible()

  const recommendationResponsePromise = page.waitForResponse(
    (response) =>
      response.request().method() === 'POST' &&
      response.url().endsWith('/voice-recommendations'),
  )
  await page.getByRole('button', { name: '직무 찾기' }).click()

  const recommendationResponse = await recommendationResponsePromise
  expect(recommendationResponse.status()).toBe(200)
  const recommendationBody =
    (await recommendationResponse.json()) as RecommendationResponse
  expect(recommendationBody.total).toBe(5)
  expect(recommendationBody.basedOnQuestions).toEqual([
    'C',
    'D',
    'E',
    'F',
    'G',
  ])
  expect(recommendationBody.jobs).toHaveLength(5)

  await expect(
    page.getByRole('heading', { name: '잘 맞는 직무를 선택해주세요' }),
  ).toBeVisible()
  const jobCards = page.locator('button[aria-pressed]')
  await expect(jobCards).toHaveCount(5)

  for (let index = 0; index < 3; index += 1) {
    await jobCards.nth(index).click()
    await expect(jobCards.nth(index)).toHaveAttribute('aria-pressed', 'true')
  }

  await page.getByRole('button', { name: '선택 완료', exact: true }).click()
  await expect(
    page.getByRole('heading', {
      name: /구직신청서에\s*희망직종을 적어 주세요/,
    }),
  ).toBeVisible()

  for (const [index, job] of recommendationBody.jobs.slice(0, 3).entries()) {
    await expect(
      page.getByText(
        `${index + 1}. ${job.easyName?.trim() || job.name}`,
        { exact: true },
      ),
    ).toBeVisible()
  }

  await page.getByRole('button', { name: '처음으로 돌아가기' }).click()
  await expect(
    page.getByRole('heading', { name: '희망직종 찾기' }),
  ).toBeVisible()
})

test('Tutorial 1/3부터 3/3까지 진행한 뒤 첫 질문으로 이동한다', async ({
  page,
}) => {
  await page.goto('./')
  await page.getByRole('button', { name: '시작하기' }).click()

  await expect(page.getByText('1/3', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: '다음', exact: true }).click()
  await expect(page.getByText('2/3', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: '다음', exact: true }).click()

  await expect(page.getByRole('heading', { name: '녹음 카드' })).toBeVisible()
  await page.getByRole('button', { name: '시작하기' }).click()

  await expect(
    page.getByRole('heading', { name: VOICE_QUESTIONS[0].title }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { name: '버튼 설명' }),
  ).toHaveCount(0)
})

test('녹음 시작 후 5초 동안 말이 없으면 STT 요청 없이 다시 말하기를 안내한다', async ({
  page,
}) => {
  await page.addInitScript(() => {
    class SilentAudioContext {
      state = 'running'
      sampleRate = 48_000

      createMediaStreamSource() {
        return {
          connect() {},
          disconnect() {},
        }
      }

      createAnalyser() {
        return {
          fftSize: 2_048,
          getFloatTimeDomainData(samples: Float32Array) {
            samples.fill(0)
          },
        }
      }

      async resume() {}
      async close() {}
    }

    Object.defineProperty(window, 'AudioContext', {
      configurable: true,
      value: SilentAudioContext,
    })
  })

  await page.route('**/api/sessions', async (route) => {
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({
        sessionId: 'silent-session',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 120_000).toISOString(),
        idleTimeoutSeconds: 120,
        maxTtlSeconds: 1_200,
      }),
    })
  })

  let voiceAnswerRequestCount = 0
  page.on('request', (request) => {
    if (request.url().endsWith('/voice-answers')) {
      voiceAnswerRequestCount += 1
    }
  })

  await page.goto('./')
  await page.getByRole('button', { name: '시작하기' }).click()
  await page.getByRole('button', { name: '건너뛰기' }).click()
  await page.getByRole('button', { name: '말하기' }).click()

  await expect(
    page.getByRole('heading', { name: '목소리를 듣지 못했어요' }),
  ).toBeVisible({ timeout: 7_000 })
  await expect(
    page.getByRole('button', { name: '다시 말하기' }),
  ).toBeVisible()
  expect(voiceAnswerRequestCount).toBe(0)
})
