import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useTheme } from '../../hooks/useTheme'
import { categoricalPalette, CHART_INK } from '../../utils/chartColors'
import { formatCurrency } from '../../utils/budgetMath'
import { formatMonthLabel } from '../../utils/monthUtils'
import type { MonthlyComparisonItem } from '../../types/api'

export function MonthlyComparisonBarChart({ items }: { items: MonthlyComparisonItem[] }) {
  const { theme } = useTheme()
  const palette = categoricalPalette(theme)
  const ink = CHART_INK[theme]

  const data = items.map((item) => ({
    mes: formatMonthLabel(item.mesReferencia),
    Meta: item.totalMeta,
    Gasto: item.totalGasto,
  }))

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
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
        <Bar dataKey="Meta" fill={palette[0]} radius={[4, 4, 0, 0]} />
        <Bar dataKey="Gasto" fill={palette[1]} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
