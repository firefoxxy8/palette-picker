exports.seed = function(knex, Promise) {
  // Deletes all existing entries
  return knex('palettes').del()
    .then( () => knex('projects').del() )
    .then( () => {
      return Promise.all([
        knex('projects').insert({
          id: 1,
          project_name: 'Unicorns and Rainbows'
        }, 'id')
        .then( project => {
          return knex('palettes').insert([
            {
              id: 1,
              palette_name: 'pastels',
              hex_one: '#5910FF',
              hex_two: '#1B77A9',
              hex_three: '#7C54BC',
              hex_four: '#C755AC',
              hex_five: '#93673C',
              project_id: project[0]
            },
            {
              id: 2,
              palette_name: 'sunrise',
              hex_one: '#E84514',
              hex_two: '#95239A',
              hex_three: '#4BC6FB',
              hex_four: '#F7492A',
              hex_five: '#1CE6C7',
              project_id: project[0]
            }
          ])
        })
        .then( () => console.log('Seeding complete!'))
        .catch( error => console.log(`Error seeding data: ${error}`))
      ])
    })
    .catch( error => console.log(`Error seeding data: ${error}`))
};
