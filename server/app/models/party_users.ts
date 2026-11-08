import { randomUUID, randomBytes, createHash } from 'node:crypto'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Parties from '#models/parties'

export default class PartyUsers extends BaseModel {
  plainToken?: string

  @beforeCreate()
  static assignUuid(party: PartyUsers) {
    party.uuid = randomUUID()
    const plainToken = randomBytes(32).toString('hex')
    party.plainToken = plainToken
    party.token = createHash('sha256').update(plainToken).digest('hex')
  }

  serializeAfterCreation() {
    if (!this.plainToken) {
      throw new Error('Plain token is only available immediately after player creation')
    }

    return {
      ...this.serialize(),
      plainToken: this.plainToken,
    }
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

  @belongsTo(() => Parties, {
    foreignKey: 'partyUuid',
    localKey: 'uuid',
  })
  declare party: BelongsTo<typeof Parties>
}
