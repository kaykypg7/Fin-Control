import { useState } from 'react'
import {
  useAdminCategories,
  useCreateAdminCategory,
  useDeleteAdminCategory,
  useUpdateAdminCategory,
} from '../../hooks/useAdmin'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { CategoryForm } from '../../components/category/CategoryForm'
import { CategoryBadge } from '../../components/category/CategoryBadge'
import { Icon } from '../../components/ui/Icon'
import { extractErrorMessage } from '../../utils/apiError'
import type { Categoria, CategoriaRequest } from '../../types/api'

export function AdminCategoriesTab() {
  const { data: categorias, isLoading } = useAdminCategories()
  const createCategory = useCreateAdminCategory()
  const updateCategory = useUpdateAdminCategory()
  const deleteCategory = useDeleteAdminCategory()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Categoria | null>(null)
  const [error, setError] = useState<string | null>(null)

  function openCreate() {
    setEditing(null)
    setError(null)
    setFormOpen(true)
  }

  function openEdit(categoria: Categoria) {
    setEditing(categoria)
    setError(null)
    setFormOpen(true)
  }

  async function handleSubmit(payload: CategoriaRequest) {
    try {
      if (editing) {
        await updateCategory.mutateAsync({ id: editing.id, payload })
      } else {
        await createCategory.mutateAsync(payload)
      }
      setFormOpen(false)
    } catch (err) {
      setError(extractErrorMessage(err))
    }
  }

  async function handleDelete(categoria: Categoria) {
    if (window.confirm(`Excluir a categoria padrão "${categoria.nome}"?`)) {
      await deleteCategory.mutateAsync(categoria.id)
    }
  }

  if (isLoading || !categorias) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">Carregando...</p>
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Categorias padrão visíveis para todos os usuários
        </p>
        <Button variant="secondary" onClick={openCreate}>
          Nova categoria padrão
        </Button>
      </div>

      <ul className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800">
        {categorias.map((categoria) => (
          <li key={categoria.id} className="flex items-center justify-between gap-3 py-2.5">
            <div className="flex min-w-0 items-center gap-2">
              <span className="truncate text-sm text-slate-900 dark:text-white">{categoria.nome}</span>
              <CategoryBadge cor={categoria.cor} grupo503020={categoria.grupo503020} />
            </div>
            <div className="flex shrink-0 gap-1">
              <button
                type="button"
                onClick={() => openEdit(categoria)}
                aria-label={`Editar ${categoria.nome}`}
                className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <Icon name="edit" className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(categoria)}
                aria-label={`Excluir ${categoria.nome}`}
                className="rounded-full p-1.5 text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
              >
                <Icon name="trash" className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {formOpen && (
        <Modal
          title={editing ? 'Editar categoria padrão' : 'Nova categoria padrão'}
          onClose={() => setFormOpen(false)}
        >
          {error && <p className="mb-3 text-sm text-red-600 dark:text-red-400">{error}</p>}
          <CategoryForm
            initialValue={editing ?? undefined}
            onSubmit={handleSubmit}
            onCancel={() => setFormOpen(false)}
            isSubmitting={createCategory.isPending || updateCategory.isPending}
          />
        </Modal>
      )}
    </div>
  )
}
