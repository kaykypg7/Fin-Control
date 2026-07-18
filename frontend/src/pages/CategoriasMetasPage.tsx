import { useEffect, useMemo, useRef, useState } from 'react'
import { useCategories, useCreateCategory, useDeleteCategory, useUpdateCategory } from '../hooks/useCategories'
import { useBudgetRecommendation, useBudgetsByMonth, useSaveBudgets } from '../hooks/useBudgets'
import { useCurrentSalary } from '../hooks/useSalary'
import { useMonthlySummary } from '../hooks/useReports'
import { useBudgetAlert } from '../hooks/useBudgetAlert'
import { currentMonth, formatMonthLabel } from '../utils/monthUtils'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Modal } from '../components/ui/Modal'
import { BudgetAlertBanner } from '../components/budget/BudgetAlertBanner'
import { RecommendationButton } from '../components/budget/RecommendationButton'
import { CategoryBudgetRow } from '../components/budget/CategoryBudgetRow'
import { CategoryForm } from '../components/category/CategoryForm'
import { CategoryList } from '../components/category/CategoryList'
import { extractErrorMessage, extractFieldErrors } from '../utils/apiError'
import type { Categoria, CategoriaRequest } from '../types/api'

export function CategoriasMetasPage() {
  const month = currentMonth()

  const { data: categorias, isLoading: loadingCategorias } = useCategories()
  const { data: salario } = useCurrentSalary()
  const { data: budgets } = useBudgetsByMonth(month)
  const { data: summary } = useMonthlySummary(month)

  const [metaValues, setMetaValues] = useState<Record<number, number>>({})
  const hydratedRef = useRef(false)

  useEffect(() => {
    if (!hydratedRef.current && budgets) {
      const initial: Record<number, number> = {}
      budgets.forEach((b) => {
        initial[b.categoryId] = b.valorMeta
      })
      setMetaValues(initial)
      hydratedRef.current = true
    }
  }, [budgets])

  const gastoPorCategoria = useMemo(() => {
    const map: Record<number, number> = {}
    summary?.porCategoria.forEach((item) => {
      map[item.categoryId] = item.valorGasto
    })
    return map
  }, [summary])

  const alert = useBudgetAlert(Object.values(metaValues), salario?.valor ?? 0)

  const recommendation = useBudgetRecommendation()
  const saveBudgets = useSaveBudgets()
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)

  async function handleRecommend() {
    setSaveMessage(null)
    setSaveError(null)
    try {
      const result = await recommendation.mutateAsync(month)
      setMetaValues((current) => {
        const next = { ...current }
        result.grupos.forEach((grupo) => {
          grupo.categorias.forEach((item) => {
            next[item.categoryId] = item.valorSugerido
          })
        })
        return next
      })
    } catch (err) {
      setSaveError(extractErrorMessage(err, 'Não foi possível gerar a recomendação'))
    }
  }

  async function handleSave() {
    setSaveMessage(null)
    setSaveError(null)
    const itens = Object.entries(metaValues)
      .filter(([, valor]) => Number.isFinite(valor))
      .map(([categoryId, valorMeta]) => ({ categoryId: Number(categoryId), valorMeta }))

    if (itens.length === 0) {
      setSaveError('Defina ao menos uma meta antes de salvar')
      return
    }

    try {
      await saveBudgets.mutateAsync({ mesReferencia: month, itens })
      setSaveMessage('Metas salvas com sucesso.')
    } catch (err) {
      setSaveError(extractErrorMessage(err))
    }
  }

  // --- Gerenciamento de categorias ---
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Categoria | null>(null)
  const [categoryFieldErrors, setCategoryFieldErrors] = useState<Record<string, string>>({})

  function openCreate() {
    setEditing(null)
    setCategoryFieldErrors({})
    setFormOpen(true)
  }

  function openEdit(categoria: Categoria) {
    setEditing(categoria)
    setCategoryFieldErrors({})
    setFormOpen(true)
  }

  async function handleCategorySubmit(payload: CategoriaRequest) {
    setCategoryFieldErrors({})
    try {
      if (editing) {
        await updateCategory.mutateAsync({ id: editing.id, payload })
      } else {
        await createCategory.mutateAsync(payload)
      }
      setFormOpen(false)
    } catch (err) {
      setCategoryFieldErrors(extractFieldErrors(err))
    }
  }

  async function handleCategoryDelete(categoria: Categoria) {
    if (window.confirm(`Excluir a categoria "${categoria.nome}"?`)) {
      await deleteCategory.mutateAsync(categoria.id)
      setMetaValues((current) => {
        const next = { ...current }
        delete next[categoria.id]
        return next
      })
    }
  }

  if (loadingCategorias || !categorias) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">Carregando...</p>
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Categorias e Metas</h1>
        <span className="text-sm capitalize text-slate-500 dark:text-slate-400">
          {formatMonthLabel(month)}
        </span>
      </div>

      <BudgetAlertBanner totalMetas={alert.totalMetas} excedente={alert.excedente} />

      <Card>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Defina a meta mensal de cada categoria
          </p>
          <RecommendationButton onClick={handleRecommend} isLoading={recommendation.isPending} />
        </div>

        <div>
          {categorias.map((categoria) => (
            <CategoryBudgetRow
              key={categoria.id}
              categoria={categoria}
              valorMeta={metaValues[categoria.id] ?? 0}
              valorGasto={gastoPorCategoria[categoria.id] ?? 0}
              onChange={(valor) =>
                setMetaValues((current) => ({ ...current, [categoria.id]: valor }))
              }
            />
          ))}
        </div>

        {saveError && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{saveError}</p>}
        {saveMessage && (
          <p className="mt-3 text-sm text-emerald-600 dark:text-emerald-400">{saveMessage}</p>
        )}

        <div className="mt-4 flex justify-end">
          <Button onClick={handleSave} disabled={saveBudgets.isPending}>
            {saveBudgets.isPending ? 'Salvando...' : 'Salvar metas'}
          </Button>
        </div>
      </Card>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">Minhas categorias</p>
          <Button variant="secondary" onClick={openCreate}>
            Nova categoria
          </Button>
        </div>
        <CategoryList categorias={categorias} onEdit={openEdit} onDelete={handleCategoryDelete} />
      </Card>

      {formOpen && (
        <Modal title={editing ? 'Editar categoria' : 'Nova categoria'} onClose={() => setFormOpen(false)}>
          <CategoryForm
            initialValue={editing ?? undefined}
            onSubmit={handleCategorySubmit}
            onCancel={() => setFormOpen(false)}
            isSubmitting={createCategory.isPending || updateCategory.isPending}
            fieldErrors={categoryFieldErrors}
          />
        </Modal>
      )}
    </div>
  )
}
