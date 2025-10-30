
import React, { createContext, useContext, useEffect, useState } from 'react'
import { login as apiLogin, me as apiMe } from './api'
import type { User } from './types'

type AuthState = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}
const AuthContext = createContext<AuthState | null>(null)
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  useEffect(()=>{ (async()=>{
    const t = localStorage.getItem('access')
    if (t) {
      try { const r = await apiMe(); setUser(r.data) } catch { localStorage.clear() }
    }
  })() }, [])
  async function login(email: string, password: string){
    const r = await apiLogin(email, password)
    localStorage.setItem('access', r.data.access)
    localStorage.setItem('refresh', r.data.refresh)
    const me = await apiMe()
    setUser(me.data)
  }
  function logout(){ localStorage.clear(); setUser(null) }
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}
export function useAuth(){ const v = useContext(AuthContext); if(!v) throw new Error('useAuth inside provider'); return v }
