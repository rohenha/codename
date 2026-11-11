import { randomUUID } from 'node:crypto'
import { BaseModel, beforeCreate, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import User from '#models/user'

export default class Parties extends BaseModel {
  @beforeCreate()
  static assignUuid(party: Parties) {
    party.uuid = randomUUID()
  }

  @column({ isPrimary: true })
  declare uuid: string

  @column()
  declare name: string

  @column({ columnName: 'admin_id' })
  declare adminId: number | null

  @column({
    prepare: (v: string[] | null) => (v && v.length ? v.join(',') : null),
    consume: (v: string | null) => (v ? v.split(',') : []),
  })
  declare themes: string[]

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @manyToMany(() => User, {
    pivotTable: 'party_members',
    localKey: 'uuid',
    relatedKey: 'id',
    pivotForeignKey: 'party_uuid',
    pivotRelatedForeignKey: 'user_id',
    onQuery: (query) => query.orderBy('username', 'desc'),
  })
  declare users: ManyToMany<typeof User>

  @belongsTo(() => User, {
    foreignKey: 'adminId',
  })
  declare admin: BelongsTo<typeof User>
}
