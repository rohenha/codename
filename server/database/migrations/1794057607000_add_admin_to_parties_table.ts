import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'parties'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .uuid('admin_uuid')
        .nullable()
        .unique()
        .references('uuid')
        .inTable('party_users')
        .onDelete('SET NULL')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(['admin_uuid'])
      table.dropUnique(['admin_uuid'])
      table.dropColumn('admin_uuid')
    })
  }
}
