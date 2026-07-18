import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { categoryApi } from '../api/categoryApi'
import type { CategoriaRequest } from '../types/api'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.list,
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CategoriaRequest) => categoryApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CategoriaRequest }) =>
      categoryApi.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => categoryApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  })
}
