import { useState, type FormEvent } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import type { CategoriaRequest, CategoryTipo, Grupo503020 } from '../../types/api'

const TIPO_OPTIONS = [
  { value: 'VARIAVEL', label: 'Variável' },
  { value: 'FIXA', label: 'Fixa' },
]

const GRUPO_OPTIONS = [
  { value: 'NECESSIDADE', label: 'Necessidade (50%)' },
  { value: 'DESEJO', label: 'Desejo (30%)' },
  { value: 'POUPANCA', label: 'Poupança (20%)' },
]

const DEFAULT_COR = '#2a78d6'

export function CategoryForm({
  initialValue,
  onSubmit,
  onCancel,
  isSubmitting,
  fieldErrors = {},
}: {
  initialValue?: CategoriaRequest
  onSubmit: (payload: CategoriaRequest) => void
  onCancel: () => void
  isSubmitting: boolean
  fieldErrors?: Record<string, string>
}) {
  const [nome, setNome] = useState(initialValue?.nome ?? '')
  const [tipo, setTipo] = useState<CategoryTipo>(initialValue?.tipo ?? 'VARIAVEL')
  const [grupo503020, setGrupo503020] = useState<Grupo503020>(initialValue?.grupo503020 ?? 'NECESSIDADE')
  const [cor, setCor] = useState(initialValue?.cor ?? DEFAULT_COR)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    onSubmit({ nome, tipo, grupo503020, cor, icone: initialValue?.icone ?? 'tag' })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Nome"
        name="nome"
        required
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        error={fieldErrors.nome}
      />
      <Select
        label="Tipo"
        name="tipo"
        options={TIPO_OPTIONS}
        value={tipo}
        onChange={(e) => setTipo(e.target.value as CategoryTipo)}
      />
      <Select
        label="Grupo 50/30/20"
        name="grupo503020"
        options={GRUPO_OPTIONS}
        value={grupo503020}
        onChange={(e) => setGrupo503020(e.target.value as Grupo503020)}
      />
      <div className="flex items-center gap-3">
        <label htmlFor="cor" className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Cor
        </label>
        <input
          id="cor"
          type="color"
          value={cor}
          onChange={(e) => setCor(e.target.value)}
          className="h-9 w-14 cursor-pointer rounded border border-slate-300 dark:border-slate-700"
        />
      </div>
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
