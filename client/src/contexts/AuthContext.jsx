import React, { createContext, useState, useEffect, useContext } from 'react'
import authService from '../services/authService'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
      ;(async () => {
        try {
          const me = await authService.me(token)
          setUser(me.user || me)
        } catch (e) {
          setUser(null)
        }
      })()
    } else {
      localStorage.removeItem('token')
      setUser(null)
    }
  }, [token])

  const login = (newToken, userInfo) => {
    setToken(newToken)
    if (userInfo) setUser(userInfo)
  }
  const logout = () => setToken(null)

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}

export default AuthContext