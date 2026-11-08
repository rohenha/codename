import { randomUUID, randomBytes, createHash } from 'node:crypto'
import { BaseModel, beforeCreate, column, hasMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Parties from '#models/parties'

export default class PartyUsers extends BaseModel {
  @beforeCreate()
  static assignUuid(party: PartyUsers) {
    party.uuid = randomUUID()
    const plainToken = randomBytes(32).toString('hex')
    party.token = PartyUsers.hashToken(plainToken)
  }

  /**
   * Hashes a plain player token before storing or looking it up.
   */
  static hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex')
  }

  @column({ columnName: 'party_uuid' })
  declare partyUuid: string

  @column({ isPrimary: true })
  declare uuid: string

  @column()
  declare username: string

  @column({ serializeAs: null })
  declare token: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => Parties, {
    foreignKey: 'uuid',
    localKey: 'partyUuid',
  })
  declare parties: HasMany<typeof Parties>
}
