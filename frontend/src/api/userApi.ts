import { apiClient } from './client'
import type { Usuario } from '../types/api'

export interface UpdateProfilePayload {
  nome: string
  email: string
}

export const userApi = {
  me: () => apiClient.get<Usuario>('/users/me').then((r) => r.data),
  updateProfile: (payload: UpdateProfilePayload) =>
    apiClient.put<Usuario>('/users/me', payload).then((r) => r.data),
}
