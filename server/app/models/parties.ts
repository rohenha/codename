import { randomUUID } from 'node:crypto'
import { BaseModel, beforeCreate, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import PartyUsers from './party_users.ts'

export default class Parties extends BaseModel {
  @beforeCreate()
  static assignUuid(party: Parties) {
    party.uuid = randomUUID()
  }

  @column({ isPrimary: true })
  declare uuid: string

  @column()
  declare name: string

  @column({ columnName: 'admin_uuid' })
  declare adminUuid: string | null

  @column({
    prepare: (v: string[] | null) => (v && v.length ? v.join(',') : null),
    consume: (v: string | null) => (v ? v.split(',') : []),
    serialize: (v: string[] | null) => v ?? [],
  })
  declare themes: string[]

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @manyToMany(() => PartyUsers, {
    pivotTable: 'party_members',
    pivotForeignKey: 'party_uuid',
    pivotRelatedForeignKey: 'party_user_uuid',
    onQuery: (query) => query.orderBy('username', 'desc'),
  })
  declare users: ManyToMany<typeof PartyUsers>

  @belongsTo(() => PartyUsers, {
    foreignKey: 'adminUuid',
  })
  declare admin: BelongsTo<typeof PartyUsers>
}
