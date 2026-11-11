import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'parties'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('admin_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(['admin_id'])
      table.dropUnique(['admin_id'])
      table.dropColumn('admin_id')
    })
  }
}
