import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../api/adminApi'
import type { CategoriaRequest } from '../types/api'

export function useAdminUsers() {
  return useQuery({ queryKey: ['admin', 'users'], queryFn: adminApi.users })
}

export function useAdminMetrics() {
  return useQuery({ queryKey: ['admin', 'metrics'], queryFn: adminApi.metrics })
}

export function useAdminCategories() {
  return useQuery({ queryKey: ['admin', 'categories'], queryFn: adminApi.categories })
}

function invalidateAdminCategories(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] })
  queryClient.invalidateQueries({ queryKey: ['categories'] })
}

export function useCreateAdminCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CategoriaRequest) => adminApi.createCategory(payload),
    onSuccess: () => invalidateAdminCategories(queryClient),
  })
}

export function useUpdateAdminCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CategoriaRequest }) =>
      adminApi.updateCategory(id, payload),
    onSuccess: () => invalidateAdminCategories(queryClient),
  })
}

export function useDeleteAdminCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => adminApi.removeCategory(id),
    onSuccess: () => invalidateAdminCategories(queryClient),
  })
}
