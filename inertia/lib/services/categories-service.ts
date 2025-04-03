import { useApiService } from './api-service'

/**
 * Interface para o modelo de categoria
 */
export interface Category {
  id?: number
  userId: number
  workspaceId: number
  name: string
  icon?: string | null
  description?: string | null
  type?: string
  createdAt?: string
  updatedAt?: string
}

/**
 * Serviço para gerenciar categorias
 */
export const useCategoryService = () => {
  const api = useApiService()
  const baseEndpoint = '/api/register/categories'

  return {
    /**
     * Busca todas as categorias
     */
    getAll: () => api.get<Category[]>(baseEndpoint),

    /**
     * Busca uma categoria pelo ID
     */
    getById: (id: number) => api.get<Category>(`${baseEndpoint}/${id}`),

    /**
     * Cria uma nova categoria
     */
    create: (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) =>
      api.post<Category>(baseEndpoint, data),

    /**
     * Atualiza uma categoria existente
     */
    update: (
      id: number,
      data: Partial<Omit<Category, 'id' | 'userId' | 'workspaceId' | 'createdAt' | 'updatedAt'>>
    ) => api.put<Category>(`${baseEndpoint}/${id}`, data),

    /**
     * Remove uma categoria
     */
    delete: (id: number) => api.delete(`${baseEndpoint}/${id}`),
  }
}
