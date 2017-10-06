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

  });



});
