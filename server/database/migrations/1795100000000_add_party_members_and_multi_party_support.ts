import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('party_members', (table) => {
      table
        .uuid('party_uuid')
        .notNullable()
        .references('uuid')
        .inTable('parties')
        .onDelete('CASCADE')
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.primary(['party_uuid', 'user_id'])
    })
  }

  async down() {
    this.schema.dropTableIfExists('party_members')
  }
}
