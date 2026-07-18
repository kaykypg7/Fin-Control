import { Icon } from '../ui/Icon'
import { CategoryBadge } from './CategoryBadge'
import type { Categoria } from '../../types/api'

export function CategoryList({
  categorias,
  onEdit,
  onDelete,
}: {
  categorias: Categoria[]
  onEdit: (categoria: Categoria) => void
  onDelete: (categoria: Categoria) => void
}) {
  return (
    <ul className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800">
      {categorias.map((categoria) => (
        <li key={categoria.id} className="flex items-center justify-between gap-3 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate text-sm text-slate-900 dark:text-white">{categoria.nome}</span>
            <CategoryBadge cor={categoria.cor} grupo503020={categoria.grupo503020} />
            {categoria.sistemaPadrao && (
              <span className="text-xs text-slate-400 dark:text-slate-500">padrão</span>
            )}
          </div>
          {!categoria.sistemaPadrao && (
            <div className="flex shrink-0 gap-1">
              <button
                type="button"
                onClick={() => onEdit(categoria)}
                aria-label={`Editar ${categoria.nome}`}
                className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <Icon name="edit" className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(categoria)}
                aria-label={`Excluir ${categoria.nome}`}
                className="rounded-full p-1.5 text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
              >
                <Icon name="trash" className="h-4 w-4" />
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}
