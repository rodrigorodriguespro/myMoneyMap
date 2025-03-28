import type { HttpContext } from '@adonisjs/core/http'
import AccountBank from '#models/account_bank'

export default class AccountBanksController {
  /**
   * Display a list of resources
   */
  async index({}: HttpContext) {
    return AccountBank.all()
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
      'initialBalance',
      'initialBalanceDate',
    ])
    return AccountBank.create(data)
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    return AccountBank.findOrFail(params.id)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const accountBank = await AccountBank.findOrFail(params.id)
    const data = request.only(['icon', 'name', 'initialBalance', 'initialBalanceDate'])
    accountBank.merge(data)
    await accountBank.save()
    return accountBank
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    const accountBank = await AccountBank.findOrFail(params.id)
    await accountBank.delete()
    return { message: 'AccountBank deleted successfully' }
  }
}
