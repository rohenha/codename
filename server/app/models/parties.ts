import { randomInt, randomUUID } from 'node:crypto'
import {
  BaseModel,
  beforeCreate,
  beforeSave,
  belongsTo,
  column,
  manyToMany,
} from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import User from '#models/user'
import encryption from '@adonisjs/core/services/encryption'

const PARTY_PASSWORD_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
const PARTY_PASSWORD_LENGTH = 8

export default class Parties extends BaseModel {
  static generatePartyPassword(length = PARTY_PASSWORD_LENGTH) {
    let password = ''

    for (let i = 0; i < length; i++) {
      password += PARTY_PASSWORD_CHARSET[randomInt(PARTY_PASSWORD_CHARSET.length)]
    }

    return password
  }

  @beforeCreate()
  static assignUuid(party: Parties) {
    party.uuid = randomUUID()
  }

  @beforeCreate()
  static assignPassword(party: Parties) {
    party.password = Parties.generatePartyPassword()
  }

  @beforeSave()
  static async encryptPassword(party: Parties) {
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
