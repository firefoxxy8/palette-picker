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
      table.array('palette_colors')
      table.integer('project_id').unsigned()
      table.foreign('project_id').references('projects.id')
      table.timestamps(true, true)
    })
  ])
}

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('projects'),
    knex.schema.dropTable('palettes')
  ])
}
