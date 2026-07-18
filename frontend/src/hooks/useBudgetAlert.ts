import { useMemo } from 'react'
import { calcularExcedente } from '../utils/budgetMath'

export interface BudgetAlertResult {
  totalMetas: number
  excedente: number
  isOverBudget: boolean
}

/**
 * Recalcula o excedente de metas em relacao ao salario a cada mudanca dos valores do
 * formulario. Puramente client-side (nenhuma chamada de rede) para dar feedback
 * instantaneo enquanto o usuario digita, sem precisar salvar.
 */
export function useBudgetAlert(valores: number[], salario: number): BudgetAlertResult {
  return useMemo(() => {
    const totalMetas = valores.reduce((acc, valor) => acc + (Number.isFinite(valor) ? valor : 0), 0)
    const excedente = calcularExcedente(valores, salario)
    return { totalMetas, excedente, isOverBudget: excedente > 0 }
  }, [valores, salario])
}
