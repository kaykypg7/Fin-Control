import { useState, type FormEvent } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import { userApi } from '../api/userApi'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Icon } from '../components/ui/Icon'
import { extractErrorMessage } from '../utils/apiError'

export function ConfiguracoesPage() {
  const { usuario, updateUsuario } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const [nome, setNome] = useState(usuario?.nome ?? '')
  const [email, setEmail] = useState(usuario?.email ?? '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setMessage(null)
    setError(null)
    setIsSubmitting(true)
    try {
      const updated = await userApi.updateProfile({ nome, email })
      updateUsuario(updated)
      setMessage('Perfil atualizado com sucesso.')
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Configurações</h1>

      <Card>
        <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">Aparência</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-700 dark:text-slate-300">
            Tema {theme === 'dark' ? 'escuro' : 'claro'}
          </span>
          <Button variant="secondary" onClick={toggleTheme}>
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} className="h-4 w-4" />
            Alternar para {theme === 'dark' ? 'claro' : 'escuro'}
          </Button>
        </div>
      </Card>

      <Card className="max-w-md">
        <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">Perfil</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Nome" name="nome" required value={nome} onChange={(e) => setNome(e.target.value)} />
          <Input
            label="E-mail"
            type="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          {message && <p className="text-sm text-emerald-600 dark:text-emerald-400">{message}</p>}
          <Button type="submit" disabled={isSubmitting} className="self-start">
            {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
