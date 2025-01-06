import type { HttpContext } from '@adonisjs/core/http'
import Workspace from '#models/workspace'

export default class WorkspacesController {
  /**
   * Display a list of resource
   */
  async index(_: HttpContext) {
    const workspaces = await Workspace.all()
    return workspaces
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    const data = request.only(['name', 'icon'])
    const workspace = await Workspace.create(data)
    return workspace
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    const workspace = await Workspace.findOrFail(params.id)
    return workspace
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const workspace = await Workspace.findOrFail(params.id)
    const data = request.only(['name', 'icon'])
    workspace.merge(data)
    await workspace.save()
    return workspace
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    const workspace = await Workspace.findOrFail(params.id)
    await workspace.delete()
    return { message: 'Workspace deleted successfully' }
  }
}
