import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useTheme } from '../../hooks/useTheme'
import { categoricalPalette, CHART_INK } from '../../utils/chartColors'
import { formatCurrency } from '../../utils/budgetMath'
import { formatMonthLabel } from '../../utils/monthUtils'
import { pivotByMonth } from '../../utils/pivotByMonth'
import type { CategoryEvolutionItem } from '../../types/api'

export function CategoryEvolutionLineChart({ items }: { items: CategoryEvolutionItem[] }) {
  const { theme } = useTheme()
  const palette = categoricalPalette(theme)
  const ink = CHART_INK[theme]

  const { data, categoryNames } = pivotByMonth(items)
  const chartData = data.map((row) => ({ ...row, mes: formatMonthLabel(row.mesReferencia) }))

  if (categoryNames.length === 0) {
    return (
      <p className="flex h-64 items-center justify-center text-sm text-slate-500 dark:text-slate-400">
        Sem dados de gastos no período selecionado.
      </p>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={ink.grid} vertical={false} />
        <XAxis
          dataKey="mes"
          tick={{ fontSize: 11, fill: ink.muted }}
          axisLine={{ stroke: ink.grid }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: ink.muted }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value: number) => formatCurrency(value)}
          width={80}
        />
        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {categoryNames.map((nome, index) => (
          <Line
            key={nome}
            type="monotone"
            dataKey={nome}
            stroke={palette[index % palette.length]}
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
