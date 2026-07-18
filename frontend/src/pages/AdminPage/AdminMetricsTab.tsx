import { useAdminMetrics } from '../../hooks/useAdmin'
import { Card } from '../../components/ui/Card'

export function AdminMetricsTab() {
  const { data: metrics, isLoading } = useAdminMetrics()

  if (isLoading || !metrics) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">Carregando...</p>
  }

  const items = [
    { label: 'Usuários cadastrados', value: metrics.totalUsuarios },
    { label: 'Categorias do sistema', value: metrics.totalCategoriasSistema },
    { label: 'Lançamentos no total', value: metrics.totalLancamentos },
    { label: 'Média de lançamentos por usuário', value: metrics.mediaLancamentosPorUsuario },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label}>
          <p className="text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">{item.value}</p>
        </Card>
      ))}
    </div>
  )
}
