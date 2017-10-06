const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();

const environment = process.env.NODE_ENV || "development";
const configuration = require("./knexfile")[environment];
const database = require("knex")(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Palette Picker';

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

// ENDPOINTS

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then( projects => response.status(200).json(projects) )
    .catch( error => response.status(500).json({ error }))
});

app.get('/api/v1/palettes', (request, response) => {
  database('palettes').select()
    .then( palettes => response.status(200).json(palettes))
    .catch( error => response.status(500).json({ error }))
});

app.post('/api/v1/projects', (request, response) => {
  const { project_name } = request.body;
  if (!project_name) {
    return response.status(422).json({ error: 'Missing required information of property: project_name to complete request' })
  }

  database('projects').insert({ project_name }, '*')
    .then( project => response.status(201).json(project))
    .catch( error => response.status(500).json({ error }))
});

app.post('/api/v1/palettes', (request, response) => {
  const paletteObject = request.body;
  for (let requiredParameter of [
    'palette_name',
    'hex_one',
    'hex_two',
    'hex_three',
    'hex_four',
    'hex_five',
    'project_id'
  ]) {
      if (!paletteObject[requiredParameter]) {
        return response
          .status(422)
          .send({ error: `Expected format: { palette_name: <String>, hex_one: <String>, hex_two: <String>, hex_three: <String>, hex_four: <String>, hex_five: <String>, project_id: <Integer> }. You're missing a ${requiredParameter} property.` });
      }
    }

  database('palettes').insert(paletteObject, '*')
    .then( palette => {
      response.status(201).json(palette)
    })
    .catch( error => {
      response.status(500).json({ error });
    });
});

app.delete('/api/v1/palettes/:id', (request, response) => {
  const { id } = request.params;

  database('palettes').where({ id }).del()
    .then( deleted => !deleted ?
      response.status(404).json({ error: 'A palette matching the id submitted could not be found' })
      :
      response.sendStatus(204) )
    .catch( error => response.status(500).json({ error }) );
});


module.exports = app;
