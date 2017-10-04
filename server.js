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

// ENDPOINTS
// retrieve all projects
app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then( projects => {
      if (!projects.length) {
        return response.status(404).json({ error: 'No projects were found' })
      }
      response.status(200).json(projects);
    })
    .catch( error => {
      response.status(500).json({ error });
    })
})

// retrieve all palettes
app.get('/api/v1/palettes', (request, response) => {
  database('palettes').select()
    .then( palettes => {
      if (!palettes.length) {
        return response.status(404).json({ error: 'No palettes were found' })
      }
      response.status(200).json(palettes);
    })
    .catch( error => {
      response.status(500).json({ error });
    })
})

// create and save a new project folder
app.post('api/v1/projects', (request, response) => {
  const { project_name } = request.body;
  if (!project_name) {
    return response.status(422).json({ error: 'Missing required information to complete request' })
  }

  database('projects').insert({ project_name }, '*')
    .then( project => {
      response.status(201).json(project)
    })
    .catch( error => {
      response.status(500).json({ error });
    });
});

// save a palette to database
app.post('api/v1/palettes', (request, response) => {
  const paletteObject = request.body;
  for (let requiredParameter of Object.Keys(paletteObject)) {
      if (!paletteObject[requiredParameter]) {
        return response
          .status(422)
          .send({ error: 'Missing required information to complete request' });
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

// delete a palette
app.delete('api/v1/palettes/:id', (request, response) => {

})

// delete a project (also deletes palettes)
app.delete('api/v1/projects/:id', (request, response) => {
  
})


app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});
