exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('projects', (table) => {
      table.increments('id').primary()
      table.string('project_name').unique()
      table.timestamps(true, true)
    }),
    knex.schema.createTable('palettes', (table) => {
      table.increments('id').primary()
      table.string('palette_name')
      table.string('hex_one')
      table.string('hex_two')
      table.string('hex_three')
      table.string('hex_four')
      table.string('hex_five')
      table.integer('project_id').unsigned()
      table.foreign('project_id').references('projects.id')
      table.timestamps(true, true)
    })
  ])
}
exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('palettes'),
    knex.schema.dropTable('projects')
  ])
}
