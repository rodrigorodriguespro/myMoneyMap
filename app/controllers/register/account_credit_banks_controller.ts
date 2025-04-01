import type { HttpContext } from '@adonisjs/core/http'
import AccountCreditBank from '#models/account_credit_bank'

export default class AccountCreditBanksController {
  /**
   * Display a list of resources
   */
  async index({}: HttpContext) {
    return AccountCreditBank.all()
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    const data = request.only([
      'userId',
      'workspaceId',
      'icon',
      'name',
      'closing',
      'maturity',
      'totalLimit',
    ])
    return AccountCreditBank.create(data)
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    return AccountCreditBank.findOrFail(params.id)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const accountCreditBank = await AccountCreditBank.findOrFail(params.id)
    const data = request.only(['icon', 'name', 'closing', 'maturity', 'totalLimit'])
    accountCreditBank.merge(data)
    await accountCreditBank.save()
    return accountCreditBank
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    const accountCreditBank = await AccountCreditBank.findOrFail(params.id)
    await accountCreditBank.delete()
    return { message: 'AccountCreditBank deleted successfully' }
  }
}
