const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

const environment = process.env.NODE_ENV || "test";
const configuration = require("../knexfile")[environment];
const database = require("knex")(configuration);

chai.use(chaiHttp);

describe('Client Routes', () => {

  it('should return the homepage with text', (done) => {
    chai.request(server)
    .get('/')
    .end( (error, response) => {
      response.should.have.status(200);
      response.should.be.html;
      response.res.text.should.include('Palette Picker');
      done();
    });
  });

  it('should return a 404 route that does not exist', (done) => {
    chai.request(server)
    .get('/eureka')
    .end( (error, response) => {
      response.should.have.status(404);
      done();
    });
  });
});

describe('API Routes', () => {

  before((done) => {
    database.migrate.latest()
      .then(() => done())
      .catch(error => console.log(error));
  });

  beforeEach((done) => {
    database.seed.run()
      .then(() => done())
      .catch(error => console.log(error));
  });

  describe('GET /api/v1/projects', () => {
    it('should retrieve all projects', (done) => {
      chai.request(server)
      .get('/api/v1/projects')
      .end( (error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(1);
        response.body[0].should.have.property('project_name');
        response.body[0].project_name.should.equal('Unicorns and Rainbows');
        response.body[0].should.have.property('id');
        response.body[0].id.should.equal(1);
        done();
      });
    });

    it('should return a 404 status if the url is incorrect', (done) => {
      chai.request(server)
      .get('/api/v1/projectsss')
      .end( (error, response) => {
        response.should.have.status(404);
        done();
      });
    });

  });


  describe('GET /api/v1/palettes', () => {
    it('should retrieve all palettes', (done) => {
      chai.request(server)
      .get('/api/v1/palettes')
      .end( (error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(2);
        response.body[0].should.have.property('palette_name');
        response.body[0].palette_name.should.equal('pastels');
        response.body[0].should.have.property('id');
        response.body[0].id.should.equal(1);
        response.body[0].should.have.property('hex_one');
        response.body[0].hex_one.should.equal('#5910FF');
        response.body[0].should.have.property('hex_two');
        response.body[0].hex_two.should.equal('#1B77A9');
        response.body[0].should.have.property('hex_three');
        response.body[0].hex_three.should.equal('#7C54BC');
        response.body[0].should.have.property('hex_four');
        response.body[0].hex_four.should.equal('#C755AC');
        response.body[0].should.have.property('hex_five');
        response.body[0].hex_five.should.equal('#93673C');
        response.body[0].should.have.property('project_id');
        response.body[0].project_id.should.equal(1);
        done();
      });
    });

    it('should return a 404 status if the url is incorrect', (done) => {
      chai.request(server)
      .get('/api/v1/palettessss')
      .end( (error, response) => {
        response.should.have.status(404);
        done();
      });
    });

  });

  describe('POST /api/v1/projects', () => {
    it('should add a new project to the projects table in db', (done) => {
      chai.request(server)
      .post('/api/v1/projects')
      .send({
        project_name: 'New Sample Project'
      })
      .end( (error, response) => {
        response.should.have.status(201);
        response.body.should.be.a('array');
        response.body[0].should.have.property('project_name');
        response.body[0].project_name.should.equal('New Sample Project');
        response.body[0].should.have.property('id');
        done();
      });
    });

    it('should not add a new project if missing or incorrect data is passed in', (done) => {
      chai.request(server)
      .post('/api/v1/projects')
      .send({
        project: 'Another Sample Project'
      })
      .end( (error, response) => {
        response.should.have.status(422);
        response.body.error.should.equal('Missing required information of property: project_name to complete request');
        done();
      });
    });
  });

  describe('POST /api/v1/palettes', () => {
    it('should add a new palette to the palettes table in db', (done) => {
      chai.request(server)
      .post('/api/v1/palettes')
      .send({
          id: 3,
          palette_name: 'Lollipops',
          hex_one: '#E84514',
          hex_two: '#95239A',
          hex_three: '#4BC6FB',
          hex_four: '#F7492A',
          hex_five: '#1CE6C7',
          project_id: 1
      })
      .end( (error, response) => {
        response.should.have.status(201);
        response.body.should.be.a('array');
        response.body[0].should.have.property('palette_name');
        response.body[0].palette_name.should.equal('Lollipops');
        response.body[0].should.have.property('id');
        response.body[0].id.should.equal(3);
        response.body[0].should.have.property('hex_one');
        response.body[0].hex_one.should.equal('#E84514');
        response.body[0].should.have.property('hex_two');
        response.body[0].hex_two.should.equal('#95239A');
        response.body[0].should.have.property('hex_three');
        response.body[0].hex_three.should.equal('#4BC6FB');
        response.body[0].should.have.property('hex_four');
        response.body[0].hex_four.should.equal('#F7492A');
        response.body[0].should.have.property('hex_five');
        response.body[0].hex_five.should.equal('#1CE6C7');
        response.body[0].should.have.property('project_id');
        response.body[0].project_id.should.equal(1);
        done();
      });
    });

    it('should not add a new palette if missing or incorrect data is passed in', (done) => {
      chai.request(server)
      .post('/api/v1/palettes')
      .send({
        id: 45,
        palette_name: 'Sample'
      })
      .end( (error, response) => {
        response.should.have.status(422);
        response.body.error.should.equal(`Expected format: { palette_name: <String>, hex_one: <String>, hex_two: <String>, hex_three: <String>, hex_four: <String>, hex_five: <String>, project_id: <Integer> }. You're missing a hex_one property.`);
        done();
      });
    });
  });

  describe('DELETE /api/v1/palettes/:id', () => {
    it('should successfully delete a palette from the palettes table', (done) => {
      chai.request(server)
      .delete('/api/v1/palettes/1')
      .end( (error, response) => {
        response.should.have.status(204);
        done();
      });
    });

    it('should return return a status 422 if palette cannot be found', (done) => {
      chai.request(server)
      .delete('/api/v1/palettes/100')
      .end( (error, response) => {
        response.should.have.status(422);
        response.body.error.should.equal('A palette matching the id submitted could not be found');
        done();
      });
    });
  });



});
