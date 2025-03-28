// eslint-disable-next-line @unicorn/filename-case
import { useAuth } from '~/stores/auth'

/**
 * Funções auxiliares para chamadas de API
 */
export const useApiService = () => {
  const { token } = useAuth()

  /**
   * Função genérica para fazer requisições HTTP
   * @param method Método HTTP (GET, POST, PUT, DELETE)
   * @param endpoint Endpoint da API
   * @param payload Dados a serem enviados (opcional)
   * @returns Promise com a resposta da requisição
   */
  const fetchApi = async <T = any>(
    method: string,
    endpoint: string,
    payload: Record<string, any> = {}
  ): Promise<T> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    // Adicionar token de autenticação se disponível
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${endpoint}`, {
      method,
      headers,
      body: method !== 'GET' ? JSON.stringify(payload) : undefined,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Ocorreu um erro na requisição')
    }

    return response.json()
  }

  /**
   * Métodos HTTP específicos
   */
  return {
    get: <T = any>(endpoint: string) => fetchApi<T>('GET', endpoint),

    post: <T = any>(endpoint: string, data: Record<string, any> = {}) =>
      fetchApi<T>('POST', endpoint, data),

    put: <T = any>(endpoint: string, data: Record<string, any> = {}) =>
      fetchApi<T>('PUT', endpoint, data),

    delete: <T = any>(endpoint: string) => fetchApi<T>('DELETE', endpoint),
  }
}
