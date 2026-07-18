import { apiClient } from './client'
import type { CategoryEvolutionItem, MonthlyComparisonItem, MonthlySummaryResponse } from '../types/api'

export const reportApi = {
  summary: (month: string) =>
    apiClient.get<MonthlySummaryResponse>('/reports/summary', { params: { month } }).then((r) => r.data),
  monthlyComparison: (months = 6, until?: string) =>
    apiClient
      .get<MonthlyComparisonItem[]>('/reports/monthly-comparison', { params: { months, until } })
      .then((r) => r.data),
  categoryEvolution: (months = 6, categoryId?: number, until?: string) =>
    apiClient
      .get<CategoryEvolutionItem[]>('/reports/category-evolution', {
        params: { months, categoryId, until },
      })
      .then((r) => r.data),
}
