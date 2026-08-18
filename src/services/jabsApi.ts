export interface Job {
  id: string
  jobTitle: string
  categoryIds: string[]
  description: string
  mainDuties: string[]
  defaultReason: string
  requiredSkills: string[]
}

interface JobsResponse {
  jobs: Job[]
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function fetchJobs(
  categoryIds: string[],
  jobCategoryUnknown: boolean,
): Promise<Job[]> {
  const params = new URLSearchParams()

  if (!jobCategoryUnknown && categoryIds.length > 0) {
    params.set('categories', categoryIds.join(','))
  }

  const queryString = params.toString()
  const url = `${API_BASE_URL}/api/jobs${queryString ? `?${queryString}` : ''}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('직무 정보를 불러오지 못했습니다.')
  }

  const data = (await response.json()) as JobsResponse

  if (!Array.isArray(data.jobs)) {
    throw new Error('직무 데이터 형식이 올바르지 않습니다.')
  }

  return data.jobs
}