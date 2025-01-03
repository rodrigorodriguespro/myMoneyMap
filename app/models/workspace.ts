import type { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, type ManyToMany } from '@adonisjs/lucid/orm'
import User from '#models/user'

export default class Workspace extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string | null

  @column()
  declare icon: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @manyToMany(() => User, {
    pivotTable: 'user_to_workspaces',
    pivotForeignKey: 'workspace_id',
  })
  public users: ManyToMany<typeof User>
}
