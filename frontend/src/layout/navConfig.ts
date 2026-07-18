import type { IconName } from '../components/ui/Icon'
import type { Role } from '../types/api'

export interface NavEntry {
  label: string
  path: string
  icon: IconName
  roles: Role[]
}

export const navConfig: NavEntry[] = [
  { label: 'Dashboard', path: '/dashboard', icon: 'dashboard', roles: ['USER', 'ADMIN'] },
  { label: 'Categorias e Metas', path: '/categorias', icon: 'tag', roles: ['USER', 'ADMIN'] },
  { label: 'Lançamentos', path: '/lancamentos', icon: 'list', roles: ['USER', 'ADMIN'] },
  { label: 'Relatórios', path: '/relatorios', icon: 'chart', roles: ['USER', 'ADMIN'] },
  { label: 'Admin', path: '/admin', icon: 'shield', roles: ['ADMIN'] },
  { label: 'Configurações', path: '/configuracoes', icon: 'settings', roles: ['USER', 'ADMIN'] },
]
