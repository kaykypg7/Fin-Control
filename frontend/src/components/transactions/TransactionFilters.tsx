import type { Categoria } from '../../types/api'

export function TransactionFilters({
  month,
  onMonthChange,
  categoryId,
  onCategoryChange,
  categorias,
}: {
  month: string
  onMonthChange: (month: string) => void
  categoryId: number | undefined
  onCategoryChange: (categoryId: number | undefined) => void
  categorias: Categoria[]
}) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1">
        <label htmlFor="filtro-mes" className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Mês
        </label>
        <input
          id="filtro-mes"
          type="month"
          value={month}
          onChange={(e) => onMonthChange(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="filtro-categoria" className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Categoria
        </label>
        <select
          id="filtro-categoria"
          value={categoryId ?? ''}
          onChange={(e) => onCategoryChange(e.target.value ? Number(e.target.value) : undefined)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        >
          <option value="">Todas</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nome}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
