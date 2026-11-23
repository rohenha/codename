import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('team_members', (table) => {
      table.uuid('team_uuid').notNullable().references('uuid').inTable('teams').onDelete('CASCADE')
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.primary(['team_uuid', 'user_id'])
    })
  }

  async down() {
    this.schema.dropTableIfExists('team_members')
  }
}
