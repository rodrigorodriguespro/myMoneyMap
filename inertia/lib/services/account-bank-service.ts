/* eslint-disable @unicorn/filename-case */
import { useApiService } from './api-service'

/**
 * Interface para o modelo de conta bancária
 */
export interface AccountBank {
  id?: number
  userId: number
  workspaceId: number
  icon?: string | null
  name: string
  initialBalance: number
  initialBalanceDate: string
  createdAt?: string
  updatedAt?: string
}

/**
 * Serviço para gerenciar contas bancárias
 */
export const useAccountBankService = () => {
  const api = useApiService()
  const baseEndpoint = '/api/register/account_banks'

  return {
    /**
     * Busca todas as contas bancárias
     */
    getAll: () => api.get<AccountBank[]>(baseEndpoint),

    /**
     * Busca uma conta bancária pelo ID
     */
    getById: (id: number) => api.get<AccountBank>(`${baseEndpoint}/${id}`),

    /**
     * Cria uma nova conta bancária
     */
    create: (data: Omit<AccountBank, 'id' | 'createdAt' | 'updatedAt'>) =>
      api.post<AccountBank>(baseEndpoint, data),

    /**
     * Atualiza uma conta bancária existente
     */
    update: (
      id: number,
      data: Partial<Omit<AccountBank, 'id' | 'userId' | 'workspaceId' | 'createdAt' | 'updatedAt'>>
    ) => api.put<AccountBank>(`${baseEndpoint}/${id}`, data),

    /**
     * Remove uma conta bancária
     */
    delete: (id: number) => api.delete(`${baseEndpoint}/${id}`),
  }
}
