import { apiClient } from './client'
import type { Transacao, TransacaoRequest } from '../types/api'

export const transactionApi = {
  list: (month: string, categoryId?: number) =>
    apiClient
      .get<Transacao[]>('/transactions', { params: { month, categoryId } })
      .then((r) => r.data),
  create: (payload: TransacaoRequest) =>
    apiClient.post<Transacao>('/transactions', payload).then((r) => r.data),
  update: (id: number, payload: TransacaoRequest) =>
    apiClient.put<Transacao>(`/transactions/${id}`, payload).then((r) => r.data),
  remove: (id: number) => apiClient.delete<void>(`/transactions/${id}`).then((r) => r.data),
}
