import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface User {
  id: number
  fullName: string
  email: string
  activeWorkspace?: Object
  workspaces?: Array<Workspace>
}

interface Workspace {
  id: number
  name: string
  icon?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  activeWorkspace: Workspace | null
  setActiveWorkspace: (workspace: Workspace) => void;
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => Promise<void>
  me: () => Promise<User>
}

interface LoginPayload {
  email: string
  password: string
}

interface RegisterPayload {
  email: string
  password: string
}

interface AuthResult {
  token: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [activeWorkspace, setActiveWorkspace] = useState<Object | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('token'))
      const savedWorkspace = localStorage.getItem('activeWorkspace')
      if (savedWorkspace) {
        setActiveWorkspace(JSON.parse(savedWorkspace))
      }
    }
  }, [])

  const api = async <T extends object>(method: string, url: string, payload: T = {} as T) => {
    const response = await fetch(`${url}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: method !== 'GET' ? JSON.stringify(payload) : null,
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    return response.json()
  }

  const authenticate = (result: AuthResult) => {
    setToken(result.token)
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', result.token)
    }
  }

  const handleWorkspaces = (workspaces: Array<{ id: number, name: string, icon?: string }>) => {
    const savedWorkspace = localStorage.getItem('activeWorkspace')
    if (savedWorkspace) {
      const parsedWorkspace = JSON.parse(savedWorkspace)
      const isValidWorkspace = workspaces.some(workspace => workspace.id === parsedWorkspace.id)
      if (isValidWorkspace) {
        setActiveWorkspace(parsedWorkspace)
      } else {
        setActiveWorkspace(workspaces[0])
        localStorage.setItem('activeWorkspace', JSON.stringify(workspaces[0]))
      }
    } else {
      setActiveWorkspace(workspaces[0])
      localStorage.setItem('activeWorkspace', JSON.stringify(workspaces[0]))
    }
  }

  const login = async (payload: LoginPayload) => {
    const result = await api('POST', '/auth/login', payload)
    authenticate(result)
    const user = await me()
    handleWorkspaces(user.workspaces || [])
  }

  const register = async (payload: RegisterPayload) => {
    const result = await api('POST', '/auth/register', payload)
    authenticate(result)
    const user = await me()
    handleWorkspaces(user.workspaces || [])
  }

  const logout = async () => {
    await api('DELETE', '/auth/logout')
    setToken(null)
    setUser(null)
    setActiveWorkspace(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('activeWorkspace')
    }
  }

  const me = async () => {
    const result = await api('GET', '/auth/me')
    setUser(result.user)
    handleWorkspaces(result.user.workspaces || [])
    return result.user
  }

  return (
    <AuthContext.Provider value={{ user, token, activeWorkspace, setActiveWorkspace, login, register, logout, me }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
