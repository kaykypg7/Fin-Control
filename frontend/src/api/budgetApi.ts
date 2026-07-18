import { apiClient } from './client'
import type { BudgetRecommendationResponse, Meta, MetaItemRequest } from '../types/api'

export const budgetApi = {
  byMonth: (month: string) =>
    apiClient.get<Meta[]>('/budgets', { params: { month } }).then((r) => r.data),
  bulkUpsert: (mesReferencia: string, itens: MetaItemRequest[]) =>
    apiClient.post<Meta[]>('/budgets', { mesReferencia, itens }).then((r) => r.data),
  recommend: (month: string) =>
    apiClient
      .post<BudgetRecommendationResponse>('/budgets/recommend', null, { params: { month } })
      .then((r) => r.data),
}
