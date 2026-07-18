import { Navigate, Outlet } from 'react-router-dom'
import { useCurrentSalary } from '../hooks/useSalary'

export function OnboardingGuard() {
  const { isLoading, isError } = useCurrentSalary()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500 dark:text-slate-400">
        Carregando...
      </div>
    )
  }

  if (isError) {
    return <Navigate to="/onboarding" replace />
  }

  return <Outlet />
}
