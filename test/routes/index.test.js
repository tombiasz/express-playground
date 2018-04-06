const app = require('../../app');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mocha = require('mocha');


const { expect } = chai;
const { describe, it } = mocha;
chai.use(chaiHttp);

describe('Index routes', () => {
  describe('Root URL', () => {
    it('should redirect to catalog', (done) => {
      chai.request(app)
        .get('/')
        .redirects(0)
        .catch(err => err.res)
        .then((res) => {
          expect(res).to.have.status(302);
          expect(res).to.have.header('location', '/catalog');
          done();
        });
    });
    it('should responds with status 200', (done) => {
      chai
        .request(app)
        .get('/')
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });
});
