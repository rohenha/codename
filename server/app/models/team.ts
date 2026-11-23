import { TeamSchema } from '#database/schema'
import { beforeCreate, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { randomUUID } from 'node:crypto'
import User from './user.ts'
import Party from './party.ts'

export default class Team extends TeamSchema {
  @beforeCreate()
  static assignUuid(team: Team) {
    team.uuid = randomUUID()
  }

  @column({ isPrimary: true })
  declare uuid: string

  @column()
  declare name: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @manyToMany(() => User, {
    pivotTable: 'team_members',
    localKey: 'uuid',
    relatedKey: 'id',
    pivotForeignKey: 'team_uuid',
    pivotRelatedForeignKey: 'user_id',
    onQuery: (query) => query.orderBy('username', 'desc'),
  })
  declare users: ManyToMany<typeof User>

  @belongsTo(() => Party, {
    foreignKey: 'partyUuid',
  })
  declare party: BelongsTo<typeof Party>
}

// table.uuid('uuid').primary().notNullable()
//       table.string('name').notNullable()
//       table.timestamp('created_at')
//       table.timestamp('updated_at')
//       table
//         .uuid('party_uuid')
//         .notNullable()
//         .references('uuid')
//         .inTable('parties')
//         .onDelete('CASCADE')
