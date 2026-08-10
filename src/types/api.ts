export type JobApiSchema = 'legacy' | 'new'

export interface LegacyApiJob {
  id: number
  code: string
  name: string
  categoryId: number
  categoryName: string
  avgSalaryBand: string | null
  outlook: string | null
  description: string | null
}

export interface NewApiJob {
  id: number
  name: string
  easyName: string | null
  description: string | null
  categoryId: number
  categoryName: string
  subCategoryName: string | null
  detailCategoryName: string | null
  requiresCert: boolean
  certNote: string | null
  isRecommendable: boolean
}

export type CompatibleApiJob = LegacyApiJob | NewApiJob

export interface ApiJobListResponse<
  TJob extends CompatibleApiJob = CompatibleApiJob,
> {
  total: number
  items: TJob[]
}

export interface NormalizedJob {
  id: number
  displayName: string
  description: string
  categoryId: number
  categoryName: string
  certificationNote: string | null
  sourceSchema: JobApiSchema
}
