import { formatCurrency } from '../../utils/budgetMath'

export function BudgetAlertBanner({ totalMetas, excedente }: { totalMetas: number; excedente: number }) {
  if (excedente <= 0) {
    return null
  }

  return (
    <div
      role="alert"
      className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200"
    >
      Suas metas somam {formatCurrency(totalMetas)}, que é {formatCurrency(excedente)} acima do
      seu salário mensal.
    </div>
  )
}
