import type {
  CompatibleApiJob,
  NewApiJob,
  NormalizedJob,
} from '../types/api'

function getNonEmptyText(value: string | null): string | null {
  const text = value?.trim()
  return text ? text : null
}

export function isNewApiJob(job: CompatibleApiJob): job is NewApiJob {
  return 'isRecommendable' in job
}

function getFallbackDescription(job: CompatibleApiJob): string {
  if (isNewApiJob(job)) {
    const category =
      getNonEmptyText(job.detailCategoryName) ??
      getNonEmptyText(job.subCategoryName) ??
      job.categoryName.trim()

    return `${category} 관련 업무를 수행합니다.`
  }

  return `${job.categoryName.trim()} 관련 업무를 수행합니다.`
}

export function normalizeJob(job: CompatibleApiJob): NormalizedJob {
  const isNew = isNewApiJob(job)
  const displayName =
    (isNew ? getNonEmptyText(job.easyName) : null) ?? job.name.trim()
  const description =
    getNonEmptyText(job.description) ?? getFallbackDescription(job)

  return {
    id: job.id,
    displayName,
    description,
    categoryId: job.categoryId,
    categoryName: job.categoryName.trim(),
    certificationNote:
      isNew && job.requiresCert ? getNonEmptyText(job.certNote) : null,
    sourceSchema: isNew ? 'new' : 'legacy',
  }
}
