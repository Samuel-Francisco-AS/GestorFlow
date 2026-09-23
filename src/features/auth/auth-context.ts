import { createContext, useContext } from 'react'

export type AuthMode = 'demo' | 'authenticated'
export type AuthContextValue = {
  mode: AuthMode
  userId: string | null
  leave: () => Promise<void>
}
export const AuthContext = createContext<AuthContextValue | null>(null)
export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('AuthProvider ausente')
  return value
}
