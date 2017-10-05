const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

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


  
});
