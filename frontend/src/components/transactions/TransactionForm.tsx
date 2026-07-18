import { useState, type FormEvent } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import type { Categoria, TransacaoRequest } from '../../types/api'

export function TransactionForm({
  categorias,
  initialValue,
  onSubmit,
  onCancel,
  isSubmitting,
  fieldErrors = {},
}: {
  categorias: Categoria[]
  initialValue?: TransacaoRequest
  onSubmit: (payload: TransacaoRequest) => void
  onCancel: () => void
  isSubmitting: boolean
  fieldErrors?: Record<string, string>
}) {
  const [categoryId, setCategoryId] = useState(initialValue?.categoryId ?? categorias[0]?.id ?? 0)
  const [valor, setValor] = useState(initialValue?.valor?.toString() ?? '')
  const [data, setData] = useState(initialValue?.data ?? new Date().toISOString().slice(0, 10))
  const [descricao, setDescricao] = useState(initialValue?.descricao ?? '')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    onSubmit({ categoryId, valor: Number(valor.replace(',', '.')), data, descricao })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Select
        label="Categoria"
        name="categoryId"
        value={categoryId}
        onChange={(e) => setCategoryId(Number(e.target.value))}
        options={categorias.map((c) => ({ value: String(c.id), label: c.nome }))}
      />
      <Input
        label="Valor (R$)"
        name="valor"
        inputMode="decimal"
        required
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        error={fieldErrors.valor}
      />
      <Input
        label="Data"
        type="date"
        name="data"
        required
        value={data}
        onChange={(e) => setData(e.target.value)}
        error={fieldErrors.data}
      />
      <Input
        label="Descrição"
        name="descricao"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
      />
      <div className="mt-2 flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>
    </form>
  )
}
