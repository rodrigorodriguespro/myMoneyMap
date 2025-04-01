import { useApiService } from './api-service'

/**
 * Interface para o modelo de conta de crédito
 */
export interface AccountCreditBank {
  id?: number
  userId: number
  workspaceId: number
  icon?: string | null
  name: string
  closing: number
  maturity: number
  totalLimit: number
  createdAt?: string
  updatedAt?: string
}

/**
 * Serviço para gerenciar contas de crédito
 */
export const useAccountCreditBankService = () => {
  const api = useApiService()
  const baseEndpoint = '/api/register/account_credit_banks'

  return {
    /**
     * Busca todas as contas de crédito
     */
    getAll: () => api.get<AccountCreditBank[]>(baseEndpoint),

    /**
     * Busca uma conta de crédito pelo ID
     */
    getById: (id: number) => api.get<AccountCreditBank>(`${baseEndpoint}/${id}`),

    /**
     * Cria uma nova conta de crédito
     */
    create: (data: Omit<AccountCreditBank, 'id' | 'createdAt' | 'updatedAt'>) => 
      api.post<AccountCreditBank>(baseEndpoint, data),

    /**
     * Atualiza uma conta de crédito existente
     */
    update: (id: number, data: Partial<Omit<AccountCreditBank, 'id' | 'userId' | 'workspaceId' | 'createdAt' | 'updatedAt'>>) => 
      api.put<AccountCreditBank>(`${baseEndpoint}/${id}`, data),

    /**
     * Remove uma conta de crédito
     */
    delete: (id: number) => api.delete(`${baseEndpoint}/${id}`)
  }
}
