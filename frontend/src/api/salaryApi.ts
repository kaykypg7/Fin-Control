import { apiClient } from './client'
import type { Salario } from '../types/api'

export const salaryApi = {
  current: () => apiClient.get<Salario>('/salary/current').then((r) => r.data),
  upsert: (mesReferencia: string, valor: number) =>
    apiClient.post<Salario>('/salary', { mesReferencia, valor }).then((r) => r.data),
}
