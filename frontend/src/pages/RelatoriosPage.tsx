import { useState } from 'react'
import { useCategories } from '../hooks/useCategories'
import { useCategoryEvolution, useMonthlyComparison } from '../hooks/useReports'
import { Card } from '../components/ui/Card'
import { MonthlyComparisonBarChart } from '../components/charts/MonthlyComparisonBarChart'
import { CategoryEvolutionLineChart } from '../components/charts/CategoryEvolutionLineChart'
import { formatCurrency } from '../utils/budgetMath'
import { formatMonthLabel } from '../utils/monthUtils'

const MONTHS_WINDOW = 6

export function RelatoriosPage() {
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined)

  const { data: categorias } = useCategories()
  const { data: comparison, isLoading: loadingComparison } = useMonthlyComparison(MONTHS_WINDOW)
  const { data: evolution, isLoading: loadingEvolution } = useCategoryEvolution(
    MONTHS_WINDOW,
    categoryId,
  )

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Relatórios</h1>

      <Card>
        <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
          Comparativo dos últimos {MONTHS_WINDOW} meses
        </p>
        {loadingComparison || !comparison ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">Carregando...</p>
        ) : (
          <>
            <MonthlyComparisonBarChart items={comparison} />
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-400">
                    <th className="py-2 pr-4 font-medium">Mês</th>
                    <th className="py-2 pr-4 font-medium">Salário</th>
                    <th className="py-2 pr-4 font-medium">Meta</th>
                    <th className="py-2 pr-4 font-medium">Gasto</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((item) => (
                    <tr
                      key={item.mesReferencia}
                      className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                    >
                      <td className="py-2 pr-4 capitalize text-slate-700 dark:text-slate-300">
                        {formatMonthLabel(item.mesReferencia)}
                      </td>
                      <td className="py-2 pr-4 text-slate-700 dark:text-slate-300">
                        {item.salario !== null ? formatCurrency(item.salario) : '—'}
                      </td>
                      <td className="py-2 pr-4 text-slate-700 dark:text-slate-300">
                        {formatCurrency(item.totalMeta)}
                      </td>
                      <td className="py-2 pr-4 text-slate-700 dark:text-slate-300">
                        {formatCurrency(item.totalGasto)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>

      <Card>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-slate-500 dark:text-slate-400">Evolução por categoria</p>
          <select
            value={categoryId ?? ''}
            onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : undefined)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          >
            <option value="">Todas as categorias</option>
            {(categorias ?? []).map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </option>
            ))}
          </select>
        </div>
        {loadingEvolution || !evolution ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">Carregando...</p>
        ) : (
          <CategoryEvolutionLineChart items={evolution} />
        )}
      </Card>
    </div>
  )
}
