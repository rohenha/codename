import { UserSchema } from '#database/schema'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import { column, manyToMany } from '@adonisjs/lucid/orm'
import Parties from '#models/parties'

export default class User extends compose(
  UserSchema,
  withAuthFinder(hash, {
    uids: ['username'],
    passwordColumnName: 'password',
  })
) {
  @column()
  declare username: string

  @manyToMany(() => Parties, {
    pivotTable: 'party_members',
    localKey: 'id',
    relatedKey: 'uuid',
    pivotForeignKey: 'user_id',
    pivotRelatedForeignKey: 'party_uuid',
  })
  declare parties: ManyToMany<typeof Parties>
}
