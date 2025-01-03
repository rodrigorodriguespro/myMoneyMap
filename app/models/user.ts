import type { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, manyToMany, type ManyToMany, afterCreate } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Workspace from '#models/workspace'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @manyToMany(() => Workspace, {
    pivotTable: 'user_to_workspaces',
    pivotForeignKey: 'user_id',
  })
  public workspaces: ManyToMany<typeof Workspace>

  static accessTokens = DbAccessTokensProvider.forModel(User)

  @afterCreate()
  static async ensureWorkspace(user: User) {
    const workspaces = await user.related('workspaces').query()
    if (workspaces.length === 0) {
      const workspace = await Workspace.create({ name: 'My Workspace' })
      await user.related('workspaces').attach([workspace.id])
    }
  }
}
