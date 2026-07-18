import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { Header } from './Header'

export function AppShell() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <div className="flex min-h-screen flex-col md:pl-56">
        <Header />
        <main className="flex-1 px-4 pb-20 pt-4 md:px-6 md:pb-6 md:pt-6">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
