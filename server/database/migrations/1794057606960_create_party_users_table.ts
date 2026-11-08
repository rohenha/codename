import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'party_users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('uuid').primary().notNullable()
      table.string('username')
      table.string('token').notNullable()
      table.unique(['token'])
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
