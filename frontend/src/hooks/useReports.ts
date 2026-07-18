import { useQuery } from '@tanstack/react-query'
import { reportApi } from '../api/reportApi'

export function useMonthlySummary(month: string) {
  return useQuery({
    queryKey: ['reports', 'summary', month],
    queryFn: () => reportApi.summary(month),
  })
}

export function useMonthlyComparison(months: number, until?: string) {
  return useQuery({
    queryKey: ['reports', 'monthly-comparison', months, until],
    queryFn: () => reportApi.monthlyComparison(months, until),
  })
}

export function useCategoryEvolution(months: number, categoryId?: number, until?: string) {
  return useQuery({
    queryKey: ['reports', 'category-evolution', months, categoryId, until],
    queryFn: () => reportApi.categoryEvolution(months, categoryId, until),
  })
}
