## Palette Picker
Project application generating colour palettes, allowing user to save palettes for future use. Backend built with Node/Express, PostgreSQL/Knex.

### Getting Started
Once you've forked/cloned the repo down, run `npm install` to install the appropriate dependencies and `node server.js` to spin up the server. You should be able to view the application on port 3000 (localhost:3000)

### Postgres Databases
You'll need to have Postgresql installed, which can be downloaded [here](https://www.postgresql.org/download/)
Manually create a database called `palette_picker` and optionally, `palette_picker_test` within Postgresql.  For more information, on creating databases, refer to these [docs](https://www.postgresql.org/docs/10/static/tutorial-createdb.html)

Run `knex migrate:rollback` and then `knex migrate:latest` to run the proper migration files.

Then, run `knex seed:run` to seed the database with sample data.

After that, everything should be working correctly. You can test it out in the browser by saving palettes and projects, and check if the data has been stored correctly through the `psql` CLI or by using this app (if you're using a Mac) - [Postico](https://eggerapps.at/postico/)
