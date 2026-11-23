import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'parties'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .enum('step', ['draft', 'teams', 'guessers', 'select_words', 'rounds'])
        .defaultTo('draft')
        .notNullable()
      table.integer('round').defaultTo(1)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('step')
      table.dropColumn('round')
    })
  }
}
