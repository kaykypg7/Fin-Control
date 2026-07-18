import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { extractErrorMessage, extractFieldErrors } from '../utils/apiError'

export function RegisterPage() {
  const { register, isLoading } = useAuth()
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setFieldErrors({})
    try {
      await register({ nome, email, senha })
      navigate('/onboarding', { replace: true })
    } catch (err) {
      const fields = extractFieldErrors(err)
      if (Object.keys(fields).length > 0) {
        setFieldErrors(fields)
      } else {
        setError(extractErrorMessage(err, 'Não foi possível concluir o cadastro'))
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 className="mb-1 text-xl font-semibold text-slate-900 dark:text-white">Criar conta</h1>
        <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
          Comece a organizar seus gastos hoje.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Nome"
            name="nome"
            autoComplete="name"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            error={fieldErrors.nome}
          />
          <Input
            label="E-mail"
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={fieldErrors.email}
          />
          <Input
            label="Senha"
            type="password"
            name="senha"
            autoComplete="new-password"
            required
            minLength={6}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            error={fieldErrors.senha}
          />
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          <Button type="submit" disabled={isLoading} className="mt-2 w-full">
            {isLoading ? 'Criando conta...' : 'Criar conta'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Já tem conta?{' '}
          <Link to="/login" className="font-medium text-emerald-600 hover:underline dark:text-emerald-400">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
