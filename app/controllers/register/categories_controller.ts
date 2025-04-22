import type { HttpContext } from '@adonisjs/core/http'
import Category from '#models/category'
import { categoryValidator } from '#validators/category'

export default class CategoriesController {
  /**
   * Display a list of resource
   */
  async index({ response, auth }: HttpContext) {
    const userId = auth.user!.id
    const categories = await Category.query().where('userId', userId)
    return response.ok(categories)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, auth }: HttpContext) {
    const userId = auth.user!.id
    const workspaceId = request.input('workspaceId')

    const data = request.all()

    const payload = await categoryValidator.validate(data)
    
    const category = await Category.create({
      ...payload,
      userId,
      workspaceId
    })
    
    return response.created(category)
  }

  /**
   * Show individual record
   */
  async show({ params, response, auth }: HttpContext) {
    const userId = auth.user!.id
    const category = await Category.query()
      .where('id', params.id)
      .where('userId', userId)
      .firstOrFail()
    
    return response.ok(category)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response, auth }: HttpContext) {
    const userId = auth.user!.id
    const data = request.all()
    const category = await Category.query()
      .where('id', params.id)
      .where('userId', userId)
      .firstOrFail()
    
      const payload = await categoryValidator.validate(data)
    
    category.merge(payload)
    await category.save()
    
    return response.ok(category)
  }

  /**
   * Delete record
   */
  async destroy({ params, response, auth }: HttpContext) {
    const userId = auth.user!.id
    const category = await Category.query()
      .where('id', params.id)
      .where('userId', userId)
      .firstOrFail()
    
    await category.delete()
    
    return response.noContent()
  }
}