import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { salaryApi } from '../api/salaryApi'

export function useCurrentSalary() {
  return useQuery({
    queryKey: ['salary', 'current'],
    queryFn: salaryApi.current,
    retry: false,
  })
}

export function useUpsertSalary() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ mesReferencia, valor }: { mesReferencia: string; valor: number }) =>
      salaryApi.upsert(mesReferencia, valor),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salary'] })
    },
  })
}
