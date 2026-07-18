import { useMemo, useState } from 'react'
import { useCategories } from '../hooks/useCategories'
import {
  useCreateTransaction,
  useDeleteTransaction,
  useTransactions,
  useUpdateTransaction,
} from '../hooks/useTransactions'
import { currentMonth } from '../utils/monthUtils'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Modal } from '../components/ui/Modal'
import { TransactionFilters } from '../components/transactions/TransactionFilters'
import { TransactionForm } from '../components/transactions/TransactionForm'
import { TransactionList } from '../components/transactions/TransactionList'
import { extractErrorMessage, extractFieldErrors } from '../utils/apiError'
import type { Transacao, TransacaoRequest } from '../types/api'

export function LancamentosPage() {
  const [month, setMonth] = useState(currentMonth())
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined)

  const { data: categorias } = useCategories()
  const { data: transacoes, isLoading } = useTransactions(month, categoryId)

  const categoriaPorId = useMemo(
    () => new Map((categorias ?? []).map((c) => [c.id, c])),
    [categorias],
  )

  const createTransaction = useCreateTransaction()
  const updateTransaction = useUpdateTransaction()
  const deleteTransaction = useDeleteTransaction()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Transacao | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  function openCreate() {
    setEditing(null)
    setError(null)
    setFieldErrors({})
    setFormOpen(true)
  }

  function openEdit(transacao: Transacao) {
    setEditing(transacao)
    setError(null)
    setFieldErrors({})
    setFormOpen(true)
  }

  async function handleSubmit(payload: TransacaoRequest) {
    setError(null)
    setFieldErrors({})
    try {
      if (editing) {
        await updateTransaction.mutateAsync({ id: editing.id, payload })
      } else {
        await createTransaction.mutateAsync(payload)
      }
      setFormOpen(false)
    } catch (err) {
      const fields = extractFieldErrors(err)
      if (Object.keys(fields).length > 0) {
        setFieldErrors(fields)
      } else {
        setError(extractErrorMessage(err))
      }
    }
  }

  async function handleDelete(transacao: Transacao) {
    if (window.confirm('Excluir este lançamento?')) {
      await deleteTransaction.mutateAsync(transacao.id)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Lançamentos</h1>
        <Button onClick={openCreate}>Novo lançamento</Button>
      </div>

      <Card>
        <TransactionFilters
          month={month}
          onMonthChange={setMonth}
          categoryId={categoryId}
          onCategoryChange={setCategoryId}
          categorias={categorias ?? []}
        />
      </Card>

      <Card>
        {isLoading ? (
          <p className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">Carregando...</p>
        ) : (
          <TransactionList
            transacoes={transacoes ?? []}
            categoriaPorId={categoriaPorId}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        )}
      </Card>

      {formOpen && (
        <Modal title={editing ? 'Editar lançamento' : 'Novo lançamento'} onClose={() => setFormOpen(false)}>
          {error && <p className="mb-3 text-sm text-red-600 dark:text-red-400">{error}</p>}
          <TransactionForm
            categorias={categorias ?? []}
            initialValue={editing ?? undefined}
            onSubmit={handleSubmit}
            onCancel={() => setFormOpen(false)}
            isSubmitting={createTransaction.isPending || updateTransaction.isPending}
            fieldErrors={fieldErrors}
          />
        </Modal>
      )}
    </div>
  )
}
