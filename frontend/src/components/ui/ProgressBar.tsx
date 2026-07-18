import { useTheme } from '../../hooks/useTheme'
import { STATUS_COLORS } from '../../utils/chartColors'
import type { ProgressoStatus } from '../../utils/budgetMath'

const STATUS_KEY: Record<ProgressoStatus, keyof typeof STATUS_COLORS.light> = {
  verde: 'good',
  amarelo: 'warning',
  vermelho: 'critical',
}

const STATUS_LABEL: Record<ProgressoStatus, string> = {
  verde: 'dentro do esperado',
  amarelo: 'próximo do limite',
  vermelho: 'acima da meta',
}

export function ProgressBar({
  percent,
  status,
  showLabel = true,
}: {
  percent: number
  status: ProgressoStatus
  showLabel?: boolean
}) {
  const { theme } = useTheme()
  const color = STATUS_COLORS[theme][STATUS_KEY[status]]
  const clamped = Math.min(Math.max(percent, 0), 100)

  return (
    <div className="flex flex-col gap-1">
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
        role="progressbar"
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${clamped}%`, backgroundColor: color }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {percent.toFixed(0)}% · {STATUS_LABEL[status]}
        </span>
      )}
    </div>
  )
}
