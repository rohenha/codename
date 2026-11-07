import { randomUUID } from 'node:crypto'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Parties from '#models/parties'

export default class PartyUsers extends BaseModel {
  @beforeCreate()
  static assignUuid(party: PartyUsers) {
    party.uuid = randomUUID()
  }

  @column({ columnName: 'party_uuid' })
  declare partyUuid: string

  @column({ isPrimary: true })
  declare uuid: string

  @column()
  declare username: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Parties, {
    foreignKey: 'partyUuid',
    localKey: 'uuid',
  })
  declare party: BelongsTo<typeof Parties>
}
