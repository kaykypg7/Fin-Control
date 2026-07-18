import type { Grupo503020 } from '../../types/api'

const GRUPO_LABEL: Record<Grupo503020, string> = {
  NECESSIDADE: 'Necessidade',
  DESEJO: 'Desejo',
  POUPANCA: 'Poupança',
}

export function CategoryBadge({ cor, grupo503020 }: { cor: string; grupo503020: Grupo503020 }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300">
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cor }} aria-hidden="true" />
      {GRUPO_LABEL[grupo503020]}
    </span>
  )
}
