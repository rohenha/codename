import { randomUUID, randomBytes, createHash } from 'node:crypto'
import { BaseModel, beforeCreate, column, manyToMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Parties from '#models/parties'
import {
  ACCESS_TOKEN_TTL_MINUTES,
  REFRESH_TOKEN_TTL_DAYS,
  type SessionTokens,
} from '#services/party_session'

export default class PartyUsers extends BaseModel {
  @beforeCreate()
  static assignUuid(party: PartyUsers) {
    party.uuid = randomUUID()

    // The token column is NOT NULL. A real session token is issued by
    // "issueSession" before the first save, this is only a safe fallback.
    if (!party.token) {
      party.token = PartyUsers.hashToken(randomBytes(32).toString('hex'))
    }
  }

  /**
   * Hashes a plain player token before storing or looking it up.
   */
  static hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex')
  }

  static findByAccessToken(token: string) {
    return PartyUsers.query().where('token', PartyUsers.hashToken(token)).preload('parties').first()
  }

  static findByRefreshToken(token: string) {
    return PartyUsers.query()
      .where('refresh_token', PartyUsers.hashToken(token))
      .preload('parties')
      .first()
  }

  @column({ isPrimary: true })
  declare uuid: string

  @column()
  declare username: string

  @column({ serializeAs: null })
  declare token: string

  @column.dateTime({ columnName: 'token_expires_at', serializeAs: null })
  declare tokenExpiresAt: DateTime | null

  @column({ columnName: 'refresh_token', serializeAs: null })
  declare refreshToken: string | null

  @column.dateTime({ columnName: 'refresh_token_expires_at', serializeAs: null })
  declare refreshTokenExpiresAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @manyToMany(() => Parties, {
    pivotTable: 'party_members',
    pivotForeignKey: 'party_user_uuid',
    pivotRelatedForeignKey: 'party_uuid',
  })
  declare parties: ManyToMany<typeof Parties>

  /**
   * Rotates the access and refresh tokens.
   *
   * The caller is responsible for saving the model. Nothing is persisted here so
   * the method can be used inside an existing database transaction.
   */
  issueSession(): SessionTokens {
    const accessToken = randomBytes(32).toString('hex')
    const refreshToken = randomBytes(48).toString('hex')

    this.token = PartyUsers.hashToken(accessToken)
    this.tokenExpiresAt = DateTime.now().plus({ minutes: ACCESS_TOKEN_TTL_MINUTES })
    this.refreshToken = PartyUsers.hashToken(refreshToken)
    this.refreshTokenExpiresAt = DateTime.now().plus({ days: REFRESH_TOKEN_TTL_DAYS })

    return { accessToken, refreshToken }
  }

  /**
   * Invalidates the current session without deleting the player.
   */
  async clearSession() {
    this.token = PartyUsers.hashToken(randomBytes(32).toString('hex'))
    this.tokenExpiresAt = null
    this.refreshToken = null
    this.refreshTokenExpiresAt = null
    await this.save()
  }

  hasValidAccessToken() {
    return !!this.tokenExpiresAt && this.tokenExpiresAt.toMillis() > Date.now()
  }

  hasValidRefreshToken() {
    return !!this.refreshTokenExpiresAt && this.refreshTokenExpiresAt.toMillis() > Date.now()
  }
}
