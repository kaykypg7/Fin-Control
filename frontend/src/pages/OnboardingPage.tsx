import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUpsertSalary } from '../hooks/useSalary'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { extractErrorMessage } from '../utils/apiError'
import { currentMonth } from '../utils/monthUtils'

export function OnboardingPage() {
  const navigate = useNavigate()
  const upsertSalary = useUpsertSalary()
  const [valor, setValor] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    const parsed = Number(valor.replace(',', '.'))
    if (!Number.isFinite(parsed) || parsed < 0) {
      setError('Informe um valor válido')
      return
    }
    try {
      await upsertSalary.mutateAsync({ mesReferencia: currentMonth(), valor: parsed })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(extractErrorMessage(err))
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 className="mb-1 text-xl font-semibold text-slate-900 dark:text-white">
          Qual é a sua renda mensal?
        </h1>
        <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
          Usamos esse valor para calcular suas metas e a recomendação 50/30/20. Você pode
          alterá-lo depois em Configurações.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Salário mensal (R$)"
            name="valor"
            inputMode="decimal"
            placeholder="0,00"
            required
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          <Button type="submit" disabled={upsertSalary.isPending} className="mt-2 w-full">
            {upsertSalary.isPending ? 'Salvando...' : 'Continuar'}
          </Button>
        </form>
      </div>
    </div>
  )
}
