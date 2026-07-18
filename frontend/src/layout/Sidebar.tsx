import { navConfig } from './navConfig'
import { NavItem } from './NavItem'
import { useAuth } from '../hooks/useAuth'

export function Sidebar() {
  const { usuario } = useAuth()
  const items = navConfig.filter((entry) => usuario && entry.roles.includes(usuario.role))

  return (
    <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-56 md:flex-col md:border-r md:border-slate-200 md:bg-white md:px-3 md:py-6 dark:md:border-slate-800 dark:md:bg-slate-900">
      <div className="mb-6 px-3 text-lg font-semibold text-slate-900 dark:text-white">Gastos App</div>
      <nav className="flex flex-1 flex-col gap-1">
        {items.map((entry) => (
          <NavItem key={entry.path} entry={entry} variant="sidebar" />
        ))}
      </nav>
    </aside>
  )
}
