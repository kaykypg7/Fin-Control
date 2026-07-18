import { CategoryBadge } from '../category/CategoryBadge'
import { ProgressBar } from '../ui/ProgressBar'
import { calcularProgresso, formatCurrency } from '../../utils/budgetMath'
import type { Categoria } from '../../types/api'

export function CategoryBudgetRow({
  categoria,
  valorMeta,
  valorGasto,
  onChange,
}: {
  categoria: Categoria
  valorMeta: number
  valorGasto: number
  onChange: (valor: number) => void
}) {
  const status = calcularProgresso(valorGasto, valorMeta)

  return (
    <div className="flex flex-col gap-2 border-b border-slate-100 py-3 last:border-0 dark:border-slate-800 sm:flex-row sm:items-center sm:gap-4">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className="truncate text-sm font-medium text-slate-900 dark:text-white">
          {categoria.nome}
        </span>
        <CategoryBadge cor={categoria.cor} grupo503020={categoria.grupo503020} />
      </div>

      <div className="flex items-center gap-2 sm:w-40">
        <span className="text-sm text-slate-500 dark:text-slate-400">R$</span>
        <input
          type="number"
          inputMode="decimal"
          min={0}
          step="0.01"
          value={Number.isFinite(valorMeta) ? valorMeta : 0}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />
      </div>

      <div className="sm:w-48">
        <ProgressBar
          percent={valorMeta > 0 ? (valorGasto / valorMeta) * 100 : valorGasto > 0 ? 100 : 0}
          status={status}
          showLabel={false}
        />
        <span className="text-xs text-slate-500 dark:text-slate-400">
          gasto: {formatCurrency(valorGasto)}
        </span>
      </div>
    </div>
  )
}
