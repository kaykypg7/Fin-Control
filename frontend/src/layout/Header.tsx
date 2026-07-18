import { Icon } from '../components/ui/Icon'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'

export function Header() {
  const { usuario, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur md:px-6 dark:border-slate-800 dark:bg-slate-900/80">
      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
        Olá, {usuario?.nome.split(' ')[0]}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Alternar tema"
          className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
        </button>
        <button
          type="button"
          onClick={logout}
          aria-label="Sair"
          className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <Icon name="logout" />
        </button>
      </div>
    </header>
  )
}
