export interface ApiJob {
  id: number
  code: string
  name: string
  categoryId: number
  categoryName: string
  avgSalaryBand: string | null
  outlook: string | null
  description: string | null
}

export interface ApiJobListResponse {
  total: number
  items: ApiJob[]
}

