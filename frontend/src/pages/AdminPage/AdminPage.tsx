import { useState } from 'react'
import { AdminUsersTab } from './AdminUsersTab'
import { AdminCategoriesTab } from './AdminCategoriesTab'
import { AdminMetricsTab } from './AdminMetricsTab'
import { Card } from '../../components/ui/Card'

type Tab = 'usuarios' | 'categorias' | 'metricas'

const TABS: { id: Tab; label: string }[] = [
  { id: 'metricas', label: 'Métricas' },
  { id: 'usuarios', label: 'Usuários' },
  { id: 'categorias', label: 'Categorias do sistema' },
]

export function AdminPage() {
  const [tab, setTab] = useState<Tab>('metricas')

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Admin</h1>

      <div className="flex gap-1 border-b border-slate-200 dark:border-slate-800">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
              tab === t.id
                ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Card>
        {tab === 'metricas' && <AdminMetricsTab />}
        {tab === 'usuarios' && <AdminUsersTab />}
        {tab === 'categorias' && <AdminCategoriesTab />}
      </Card>
    </div>
  )
}
