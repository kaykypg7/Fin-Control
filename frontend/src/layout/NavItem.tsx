import { NavLink } from 'react-router-dom'
import { Icon } from '../components/ui/Icon'
import type { NavEntry } from './navConfig'

export function NavItem({ entry, variant }: { entry: NavEntry; variant: 'sidebar' | 'bottom' }) {
  const baseClasses =
    variant === 'sidebar'
      ? 'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors'
      : 'flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium transition-colors'

  return (
    <NavLink
      to={entry.path}
      className={({ isActive }) =>
        [
          baseClasses,
          isActive
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white',
          variant === 'sidebar' && isActive ? 'bg-emerald-50 dark:bg-emerald-500/10' : '',
        ]
          .filter(Boolean)
          .join(' ')
      }
    >
      <Icon name={entry.icon} className={variant === 'sidebar' ? 'h-5 w-5' : 'h-6 w-6'} />
      <span>{entry.label}</span>
    </NavLink>
  )
}
