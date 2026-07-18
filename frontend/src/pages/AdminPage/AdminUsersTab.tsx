import { useAdminUsers } from '../../hooks/useAdmin'

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR')
}

export function AdminUsersTab() {
  const { data: users, isLoading } = useAdminUsers()

  if (isLoading || !users) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">Carregando...</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <th className="py-2 pr-4 font-medium">Nome</th>
            <th className="py-2 pr-4 font-medium">E-mail</th>
            <th className="py-2 pr-4 font-medium">Perfil</th>
            <th className="py-2 pr-4 font-medium">Cadastro</th>
            <th className="py-2 pr-4 font-medium">Lançamentos</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
              <td className="py-2 pr-4 text-slate-700 dark:text-slate-300">{user.nome}</td>
              <td className="py-2 pr-4 text-slate-700 dark:text-slate-300">{user.email}</td>
              <td className="py-2 pr-4 text-slate-700 dark:text-slate-300">{user.role}</td>
              <td className="py-2 pr-4 text-slate-700 dark:text-slate-300">
                {formatDateTime(user.createdAt)}
              </td>
              <td className="py-2 pr-4 text-slate-700 dark:text-slate-300">{user.totalLancamentos}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
        Apenas contagens agregadas são exibidas — nenhum valor financeiro individual de outro
        usuário é acessado.
      </p>
    </div>
  )
}
