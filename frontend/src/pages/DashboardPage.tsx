import { useMonthlySummary } from '../hooks/useReports'
import { Card } from '../components/ui/Card'
import { ProgressBar } from '../components/ui/ProgressBar'
import { BudgetPieChart } from '../components/charts/BudgetPieChart'
import { BudgetVsActualBarChart } from '../components/charts/BudgetVsActualBarChart'
import { formatCurrency } from '../utils/budgetMath'
import { currentMonth, formatMonthLabel } from '../utils/monthUtils'

export function DashboardPage() {
  const month = currentMonth()
  const { data: summary, isLoading, isError } = useMonthlySummary(month)

  if (isLoading) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">Carregando...</p>
  }

  if (isError || !summary) {
    return <p className="text-sm text-red-600 dark:text-red-400">Não foi possível carregar o resumo do mês.</p>
  }

  const salario = summary.salario ?? 0
  const excedeu = salario > 0 && summary.totalGasto > salario
  const gastoPercent = salario > 0 ? (summary.totalGasto / salario) * 100 : 0

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Dashboard</h1>
        <span className="text-sm capitalize text-slate-500 dark:text-slate-400">
          {formatMonthLabel(month)}
        </span>
      </div>

      {excedeu && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
          Seus gastos deste mês (<strong>{formatCurrency(summary.totalGasto)}</strong>) já
          ultrapassaram seu salário de <strong>{formatCurrency(salario)}</strong>.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="md:col-span-1">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total gasto vs. salário</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
            {formatCurrency(summary.totalGasto)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            de {formatCurrency(salario)} de renda
          </p>
          <div className="mt-3">
            <ProgressBar
              percent={gastoPercent}
              status={gastoPercent > 100 ? 'vermelho' : gastoPercent >= 80 ? 'amarelo' : 'verde'}
            />
          </div>
        </Card>

        <Card className="md:col-span-1">
          <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">Metas por categoria</p>
          <BudgetPieChart porCategoria={summary.porCategoria} />
        </Card>

        <Card className="md:col-span-1">
          <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">Total de metas</p>
          <p className="text-2xl font-semibold text-slate-900 dark:text-white">
            {formatCurrency(summary.totalMetas)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {summary.porCategoria.length} categoria(s) com movimento este mês
          </p>
        </Card>
      </div>

      <Card>
        <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">Meta vs. gasto real por categoria</p>
        <BudgetVsActualBarChart porCategoria={summary.porCategoria} />
      </Card>
    </div>
  )
}
