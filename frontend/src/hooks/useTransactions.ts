import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { transactionApi } from '../api/transactionApi'
import type { TransacaoRequest } from '../types/api'

export function useTransactions(month: string, categoryId?: number) {
  return useQuery({
    queryKey: ['transactions', month, categoryId ?? null],
    queryFn: () => transactionApi.list(month, categoryId),
  })
}

function invalidateAfterMutation(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ['transactions'] })
  queryClient.invalidateQueries({ queryKey: ['reports'] })
}

export function useCreateTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TransacaoRequest) => transactionApi.create(payload),
    onSuccess: () => invalidateAfterMutation(queryClient),
  })
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: TransacaoRequest }) =>
      transactionApi.update(id, payload),
    onSuccess: () => invalidateAfterMutation(queryClient),
  })
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => transactionApi.remove(id),
    onSuccess: () => invalidateAfterMutation(queryClient),
  })
}
