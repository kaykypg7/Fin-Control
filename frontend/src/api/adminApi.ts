import { apiClient } from './client'
import type { AdminMetricsResponse, AdminUserResponse, Categoria, CategoriaRequest } from '../types/api'

export const adminApi = {
  users: () => apiClient.get<AdminUserResponse[]>('/admin/users').then((r) => r.data),
  categories: () => apiClient.get<Categoria[]>('/admin/categories').then((r) => r.data),
  createCategory: (payload: CategoriaRequest) =>
    apiClient.post<Categoria>('/admin/categories', payload).then((r) => r.data),
  updateCategory: (id: number, payload: CategoriaRequest) =>
    apiClient.put<Categoria>(`/admin/categories/${id}`, payload).then((r) => r.data),
  removeCategory: (id: number) => apiClient.delete<void>(`/admin/categories/${id}`).then((r) => r.data),
  metrics: () => apiClient.get<AdminMetricsResponse>('/admin/metrics').then((r) => r.data),
}
