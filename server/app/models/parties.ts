import { randomUUID } from 'node:crypto'
import { BaseModel, beforeCreate, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
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

  @hasMany(() => PartyUsers, {
    foreignKey: 'partyUuid',
    onQuery: (query) => query.orderBy('username', 'desc'),
  })
  declare users: HasMany<typeof PartyUsers>
}
