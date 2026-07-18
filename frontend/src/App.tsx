import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { AdminRoute } from './routes/AdminRoute'
import { OnboardingGuard } from './routes/OnboardingGuard'
import { AppShell } from './layout/AppShell'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { OnboardingPage } from './pages/OnboardingPage'
import { DashboardPage } from './pages/DashboardPage'
import { CategoriasMetasPage } from './pages/CategoriasMetasPage'
import { LancamentosPage } from './pages/LancamentosPage'
import { RelatoriosPage } from './pages/RelatoriosPage'
import { AdminPage } from './pages/AdminPage/AdminPage'
import { ConfiguracoesPage } from './pages/ConfiguracoesPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/onboarding" element={<OnboardingPage />} />

                <Route element={<OnboardingGuard />}>
                  <Route element={<AppShell />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/categorias" element={<CategoriasMetasPage />} />
                    <Route path="/lancamentos" element={<LancamentosPage />} />
                    <Route path="/relatorios" element={<RelatoriosPage />} />
                    <Route path="/configuracoes" element={<ConfiguracoesPage />} />
                    <Route element={<AdminRoute />}>
                      <Route path="/admin" element={<AdminPage />} />
                    </Route>
                  </Route>
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
