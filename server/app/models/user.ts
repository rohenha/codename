import { UserSchema } from '#database/schema'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import { column, manyToMany } from '@adonisjs/lucid/orm'
import Party from '#models/party'
import Team from './team.ts'

export default class User extends compose(
  UserSchema,
  withAuthFinder(hash, {
    uids: ['username'],
    passwordColumnName: 'password',
  })
) {
  @column()
  declare username: string

  @manyToMany(() => Party, {
    pivotTable: 'party_members',
    localKey: 'id',
    relatedKey: 'uuid',
    pivotForeignKey: 'user_id',
    pivotRelatedForeignKey: 'party_uuid',
  })
  declare parties: ManyToMany<typeof Party>

  @manyToMany(() => Team, {
    pivotTable: 'team_members',
    localKey: 'id',
    relatedKey: 'uuid',
    pivotForeignKey: 'user_id',
    pivotRelatedForeignKey: 'team_uuid',
    onQuery: (query) => query.orderBy('name', 'desc'),
  })
  declare teams: ManyToMany<typeof Team>
}
