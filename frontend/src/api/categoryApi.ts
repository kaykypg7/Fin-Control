import { apiClient } from './client'
import type { Categoria, CategoriaRequest } from '../types/api'

export const categoryApi = {
  list: () => apiClient.get<Categoria[]>('/categories').then((r) => r.data),
  create: (payload: CategoriaRequest) =>
    apiClient.post<Categoria>('/categories', payload).then((r) => r.data),
  update: (id: number, payload: CategoriaRequest) =>
    apiClient.put<Categoria>(`/categories/${id}`, payload).then((r) => r.data),
  remove: (id: number) => apiClient.delete<void>(`/categories/${id}`).then((r) => r.data),
}
