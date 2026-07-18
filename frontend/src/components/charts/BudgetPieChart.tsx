import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { useTheme } from '../../hooks/useTheme'
import { categoricalPalette, foldIntoOther } from '../../utils/chartColors'
import { formatCurrency } from '../../utils/budgetMath'
import type { CategorySummaryItem } from '../../types/api'

export function BudgetPieChart({ porCategoria }: { porCategoria: CategorySummaryItem[] }) {
  const { theme } = useTheme()
  const palette = categoricalPalette(theme)

  const withMeta = porCategoria.filter((item) => item.valorMeta > 0)
  const data = foldIntoOther(
    withMeta.map((item) => ({ nome: item.nome, valor: item.valorMeta })),
    (item) => item.nome,
  )

  if (data.length === 0) {
    return (
      <p className="flex h-64 items-center justify-center text-sm text-slate-500 dark:text-slate-400">
        Nenhuma meta definida para este mês.
      </p>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="valor"
          nameKey="label"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
        >
          {data.map((entry, index) => (
            <Cell key={entry.label} fill={palette[index % palette.length]} stroke="none" />
          ))}
        </Pie>
        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
        <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}
