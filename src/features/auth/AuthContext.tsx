import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { RoleName } from '../../shared/types'

export interface SessionUser {
  name: string
  email: string
  role: RoleName
  roleLabel: string
  branch: string
}

export const ROLE_OPTIONS: { role: RoleName; label: string }[] = [
  { role: 'EXECUTIVE_ADMIN', label: 'Executive Administrator' },
  { role: 'ISSUER_ADMIN', label: 'Issuer Administrator' },
  { role: 'BRANCH_ADMIN', label: 'Branch Administrator' },
  { role: 'CARD_OPERATIONS', label: 'Card Operations Specialist' },
  { role: 'BATCH_PROCESSOR', label: 'Batch Processing Specialist' },
  { role: 'PRINTING_OPERATOR', label: 'Printing Operator' },
  { role: 'COMPLIANCE_OFFICER', label: 'Compliance Officer' },
  { role: 'SYSTEM_ADMIN', label: 'System Administrator' },
  { role: 'BI_SPECIALIST', label: 'BI Specialist' },
]

interface AuthContextValue {
  user: SessionUser | null
  login: (user: SessionUser) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null)
  const login = useCallback((u: SessionUser) => setUser(u), [])
  const logout = useCallback(() => setUser(null), [])
  const value = useMemo(() => ({ user, login, logout }), [user, login, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
