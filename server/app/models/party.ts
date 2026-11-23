import { randomInt, randomUUID } from 'node:crypto'
import {
  beforeCreate,
  beforeSave,
  belongsTo,
  column,
  hasMany,
  manyToMany,
} from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany, HasMany } from '@adonisjs/lucid/types/relations'
import { PartySchema } from '#database/schema'

import { DateTime } from 'luxon'
import User from '#models/user'
import encryption from '@adonisjs/core/services/encryption'
import { PartySteps } from '#enums/party_steps'
import Team from './team.ts'

const PARTY_PASSWORD_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
const PARTY_PASSWORD_LENGTH = 8

export default class Party extends PartySchema {
  static generatePartyPassword(length = PARTY_PASSWORD_LENGTH) {
    let password = ''

    for (let i = 0; i < length; i++) {
      password += PARTY_PASSWORD_CHARSET[randomInt(PARTY_PASSWORD_CHARSET.length)]
    }

    return password
  }

  @beforeCreate()
  static assignUuid(party: Party) {
    party.uuid = randomUUID()
  }

  @beforeCreate()
  static assignPassword(party: Party) {
    party.password = Party.generatePartyPassword()
  }

  @beforeSave()
  static async encryptPassword(party: Party) {
    if (party.$dirty.password) {
      party.password = await encryption.encrypt(party.password)
    }
  }

  @column({ isPrimary: true })
  declare uuid: string

  @column()
  declare password: string

  @column()
  declare name: string

  @column({ columnName: 'admin_id' })
  declare adminId: number | null

  // @column({
  //   prepare: (v: string[] | null) => (v && v.length ? v.join(',') : null),
  //   consume: (v: string | null) => (v ? v.split(',') : []),
  // })
  // declare themes: string[]

  // @column({
  //   // modèle (string[]) → base (TEXT)
  //   prepare: (value: string[] | null) => (value ? JSON.stringify(value) : null),
  //   // base (TEXT) → modèle (string[])
  //   consume: (value: string | null) => (value ? JSON.parse(value) : null),
  // })
  // declare public themes: string[] | null
  @column()
  declare themes: string | null

  public get themesList(): string[] | null {
    return this.themes ? this.themes.split(',') : null
    // return this.themes ? (JSON.parse(this.themes) as string[]) : null
  }

  public set themesList(value: string[] | null) {
    // this.themes = value ? JSON.stringify(value) : null
    this.themes = value ? value.join(',') : null
  }

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

  @column()
  declare step: PartySteps

  @column()
  declare round: number

  // @hasMany(() => Team, {
  //   pivotTable: 'team_members',
  //   localKey: 'id',
  //   relatedKey: 'uuid',
  //   pivotForeignKey: 'user_id',
  //   pivotRelatedForeignKey: 'party_uuid',
  // })
  // declare parties: ManyToMany<typeof Party>

  @hasMany(() => Team, {
    foreignKey: 'partyUuid',
    localKey: 'uuid',
    // onQuery: (query) => query.whereNull('deleted_at'),
  })
  declare teams: HasMany<typeof Team>
}
