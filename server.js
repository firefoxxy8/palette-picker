// The following several lines of code are bringing in the appropriate dependencies in order to be able to use express with the application, be able to parse our requests with body-parser, set the environment based on Node environment variable or default of 'development', connect to the database with knex, and server our static files from the 'public' directory using Express middleware.

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

// This sets the port at which one can view the application; defaults to localhost:3000 is the process.env.PORT variable is not available.
app.set('port', process.env.PORT || 3000);
// Within the locals object, this sets the title of the application to 'Palette Picker'
app.locals.title = 'Palette Picker';
// App.listen is listening for connections on the given port, which was previously set to default on localhost:3000, callback will then log in the terminal that 'Palette Picker' is running on the appropriate port.
app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

// ENDPOINTS

// The following Express routes follow a general format of app, the instance of our Express application, followed by the method (GET, POST, DELETE), the path or endpoint requested, and lastly the handler, or the function that includes logic for how the request should be handled and the response we will return to the client.  This handler includes the request and response object by default.

// Endpoints or paths follow a general format of '/api/v1'. We use relative paths to allow for the host to change between different environments (ie. development, production) and the restful design of 'api/v1' in case versions of the api change dramatically.

// retrieve all projects
app.get('/api/v1/projects', (request, response) => { // For 'GET' requests to '/api/v1/projects'
  database('projects').select() // In the database, select all from projects table, returns a promise
    .then( projects => response.status(200).json(projects) ) // Consume promise and edit response object to send client status of 200 (OK) and in json format, all of the projects returned from database.
    .catch( error => response.status(500).json({ error })) // If there is a server-side error, respond to client with a status 500, and in json format, the error that occurred.
});

// retrieve all palettes
app.get('/api/v1/palettes', (request, response) => { // For 'GET' requests to '/api/v1/palettes'
  database('palettes').select() // In the database, select all from palettes table, returns a promise
    .then( palettes => response.status(200).json(palettes)) // Consume promise and edit response object to send client status of 200 (OK) and in json format, all of the palettes returned from database.
    .catch( error => response.status(500).json({ error })) // If there is a server-side error, respond to client with a status 500, and in json, the error that occurred.
});

// create and save a new project folder
app.post('/api/v1/projects', (request, response) => { // For 'POST' requests to '/api/v1/projects'
  const { project_name } = request.body; // From the request object's body property, sent in by client, grab the project name value and set to a variable called project_name.
  if (!project_name) { // If project_name does not exist
    return response.status(422).json({ error: 'Missing required information of property: project_name to complete request' }) // Send client response status of 422 and an error message denoting that client must submit a property (with value) of 'project_name' in order to carry out request.
  }

  database('projects').insert({ project_name }, '*') // If the conditional is skipped (ie. a project_name did exist), insert the project_name and value into the projects table of the database and return all information for that project in promise form.
    .then( project => response.status(201).json(project)) // Consume promise, and edit response object to send client status of 201 (successfully created) and in json format, the project that was just added to the database.
    .catch( error => response.status(500).json({ error })) // If there is a server-side error, respond to client with a status 500, and in json, the error that occurred.
});

// save a palette to database
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

// delete a palette
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
