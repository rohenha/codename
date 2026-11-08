import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'party_users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.timestamp('token_expires_at').nullable()
      table.string('refresh_token').nullable().unique()
      table.timestamp('refresh_token_expires_at').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropUnique(['refresh_token'])
      table.dropColumn('token_expires_at')
      table.dropColumn('refresh_token')
      table.dropColumn('refresh_token_expires_at')
    })
  }
}
