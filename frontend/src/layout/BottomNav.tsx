import { navConfig } from './navConfig'
import { NavItem } from './NavItem'
import { useAuth } from '../hooks/useAuth'

export function BottomNav() {
  const { usuario } = useAuth()
  const items = navConfig.filter((entry) => usuario && entry.roles.includes(usuario.role))

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] md:hidden dark:border-slate-800 dark:bg-slate-900">
      {items.map((entry) => (
        <NavItem key={entry.path} entry={entry} variant="bottom" />
      ))}
    </nav>
  )
}
