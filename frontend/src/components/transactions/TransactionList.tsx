import { Icon } from '../ui/Icon'
import { formatCurrency } from '../../utils/budgetMath'
import type { Categoria, Transacao } from '../../types/api'

function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-')
  return `${day}/${month}/${year}`
}

export function TransactionList({
  transacoes,
  categoriaPorId,
  onEdit,
  onDelete,
}: {
  transacoes: Transacao[]
  categoriaPorId: Map<number, Categoria>
  onEdit: (transacao: Transacao) => void
  onDelete: (transacao: Transacao) => void
}) {
  if (transacoes.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Nenhum lançamento neste mês.
      </p>
    )
  }

  return (
    <ul className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800">
      {transacoes.map((transacao) => {
        const categoria = categoriaPorId.get(transacao.categoryId)
        return (
          <li key={transacao.id} className="flex items-center justify-between gap-3 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: categoria?.cor ?? '#898781' }}
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                  {transacao.descricao || categoria?.nome || 'Sem descrição'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {categoria?.nome ?? 'Categoria removida'} · {formatDate(transacao.data)}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {formatCurrency(transacao.valor)}
              </span>
              <button
                type="button"
                onClick={() => onEdit(transacao)}
                aria-label="Editar lançamento"
                className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <Icon name="edit" className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(transacao)}
                aria-label="Excluir lançamento"
                className="rounded-full p-1.5 text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
              >
                <Icon name="trash" className="h-4 w-4" />
              </button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
