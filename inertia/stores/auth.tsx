import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface Workspace {
  id: number
  name: string
  icon?: string
}

interface User {
  id: number
  fullName: string
  email: string
  activeWorkspace?: Workspace
  workspaces?: Array<Workspace>
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

interface AuthContextType {
  user: User | null
  token: string | null
  activeWorkspace: Workspace | null
  isReady: boolean
  setActiveWorkspace: (workspace: Workspace) => void
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => Promise<void>
  me: () => Promise<User>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null)
  const [initialized, setInitialized] = useState(false)
  const [isReady, setIsReady] = useState(false)

  // Recupera token e workspace salvos no localStorage na montagem do componente
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token')
      if (storedToken) {
        setToken(storedToken)
      } else {
        // Se não há token, podemos marcar como pronto (não autenticado)
        setIsReady(true)
      }
      
      const savedWorkspace = localStorage.getItem('activeWorkspace')
      if (savedWorkspace) {
        setActiveWorkspace(JSON.parse(savedWorkspace))
      }
    }
  }, [])

  // Chama o método me() apenas uma vez após o token ser definido, evitando chamadas repetidas
  useEffect(() => {
    if (token && !user && !initialized) {
      me()
        .then(() => {
          setInitialized(true)
          setIsReady(true)
        })
        .catch(err => {
          console.error('Erro ao buscar dados do usuário:', err)
          setIsReady(true) // Marca como pronto mesmo em caso de erro
        })
    }
  }, [token, user, initialized])

  // Função genérica para fazer chamadas à API
  const api = async <T extends object>(method: string, url: string, payload: T = {} as T) => {
    // Verifica se o token está disponível para requisições autenticadas
    if (!token && url.includes('/auth/me')) {
      throw new Error('Token de autenticação não disponível')
    }

    const response = await fetch(`${url}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: method !== 'GET' ? JSON.stringify(payload) : null,
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    return response.json()
  }

  // Armazena o token no estado e no localStorage
  const authenticate = (result: AuthResult) => {
    setToken(result.token)
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', result.token)
    }
  }

  // Gerencia o workspace ativo com base na lista de workspaces do usuário
  const handleWorkspaces = (workspaces: Array<Workspace>) => {
    const savedWorkspace = localStorage.getItem('activeWorkspace')
    if (savedWorkspace) {
      const parsedWorkspace = JSON.parse(savedWorkspace)
      const isValidWorkspace = workspaces.some(workspace => workspace.id === parsedWorkspace.id)
      if (isValidWorkspace) {
        setActiveWorkspace(parsedWorkspace)
      } else if (workspaces.length > 0) {
        setActiveWorkspace(workspaces[0])
        localStorage.setItem('activeWorkspace', JSON.stringify(workspaces[0]))
      }
    } else {
      if (workspaces.length > 0) {
        setActiveWorkspace(workspaces[0])
        localStorage.setItem('activeWorkspace', JSON.stringify(workspaces[0]))
      }
    }
  }

  // Login: autentica o usuário, armazena token e busca dados do usuário
  const login = async (payload: LoginPayload) => {
    const result = await api('POST', '/auth/login', payload)
    authenticate(result)
    const userData = await me()
    handleWorkspaces(userData.workspaces || [])
  }

  // Registro: cadastra o usuário, armazena token e busca dados do usuário
  const register = async (payload: RegisterPayload) => {
    const result = await api('POST', '/auth/register', payload)
    authenticate(result)
    const userData = await me()
    handleWorkspaces(userData.workspaces || [])
  }

  // Logout: encerra a sessão do usuário e limpa os dados armazenados
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

  // Busca os dados do usuário a partir do token
  const me = async () => {
    const result = await api('GET', '/auth/me')
    setUser(result.user)
    handleWorkspaces(result.user.workspaces || [])
    return result.user
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        activeWorkspace,
        isReady,
        setActiveWorkspace,
        login,
        register,
        logout,
        me,
      }}
    >
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
