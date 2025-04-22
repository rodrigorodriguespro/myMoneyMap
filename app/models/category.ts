import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare workspaceId: number

  @column()
  declare icon: string

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare categoryType: string

  @column()
  declare expenseType: 'essential' | 'non-essential'

  @column()
  declare budget: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}