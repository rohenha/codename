import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'party_users'

  async up() {
    const hasTable = await this.schema.hasTable(this.tableName)
    if (hasTable) {
      return
    }

    this.schema.createTable(this.tableName, (table) => {
      table.uuid('uuid').primary().notNullable()
      table.string('username')
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table
        .uuid('party_uuid')
        .notNullable()
        .references('uuid')
        .inTable('parties')
        .onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTableIfExists(this.tableName)
  }
}
