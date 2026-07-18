import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { budgetApi } from '../api/budgetApi'
import type { MetaItemRequest } from '../types/api'

export function useBudgetsByMonth(month: string) {
  return useQuery({
    queryKey: ['budgets', month],
    queryFn: () => budgetApi.byMonth(month),
  })
}

export function useSaveBudgets() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ mesReferencia, itens }: { mesReferencia: string; itens: MetaItemRequest[] }) =>
      budgetApi.bulkUpsert(mesReferencia, itens),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['budgets', variables.mesReferencia] })
      queryClient.invalidateQueries({ queryKey: ['reports'] })
    },
  })
}

export function useBudgetRecommendation() {
  return useMutation({
    mutationFn: (month: string) => budgetApi.recommend(month),
  })
}
