import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { authApi, type LoginPayload, type RegisterPayload } from '../api/authApi'
import { TOKEN_STORAGE_KEY } from '../api/client'
import type { Usuario } from '../types/api'

const USER_STORAGE_KEY = 'gastos-app:usuario'

interface AuthContextValue {
  usuario: Usuario | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
  updateUsuario: (usuario: Usuario) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function readStoredUser(): Usuario | null {
  const raw = localStorage.getItem(USER_STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as Usuario
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(readStoredUser)
  const [isLoading, setIsLoading] = useState(false)

  const persist = useCallback((token: string, user: Usuario) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, token)
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
    setUsuario(user)
  }, [])

  const login = useCallback(
    async (payload: LoginPayload) => {
      setIsLoading(true)
      try {
        const response = await authApi.login(payload)
        persist(response.token, response.usuario)
      } finally {
        setIsLoading(false)
      }
    },
    [persist],
  )

  const register = useCallback(
    async (payload: RegisterPayload) => {
      setIsLoading(true)
      try {
        const response = await authApi.register(payload)
        persist(response.token, response.usuario)
      } finally {
        setIsLoading(false)
      }
    },
    [persist],
  )

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    localStorage.removeItem(USER_STORAGE_KEY)
    setUsuario(null)
  }, [])

  const updateUsuario = useCallback((user: Usuario) => {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
    setUsuario(user)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      usuario,
      isAuthenticated: usuario !== null,
      isLoading,
      login,
      register,
      logout,
      updateUsuario,
    }),
    [usuario, isLoading, login, register, logout, updateUsuario],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext deve ser usado dentro de um AuthProvider')
  }
  return context
}
