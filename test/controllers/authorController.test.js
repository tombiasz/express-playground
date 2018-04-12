const chai = require('chai');
const httpMocks = require('node-mocks-http');
const mocha = require('mocha');
const sinon = require('sinon');

const Author = require('../../models/author');
const authorController = require('../../controllers/authorController');
const dbUtils = require('../../utils/db.js');


const { expect } = chai;
const { describe, it, before, beforeEach } = mocha;


describe('Author controller', () => {
  before((done) => {
    dbUtils
      .dropAllCollections()
      .then(() => {
        this.author1 = new Author({
          first_name: 'John',
          family_name: 'Doe',
        });
        this.author2 = new Author({
          first_name: 'Jane',
          family_name: 'Doe',
        });

        return Promise
          .all([
            this.author1.save(),
            this.author2.save(),
          ]);
      })
      .then((results) => {
        this.authors = results;
        done();
      });
  });

  describe('getAuthorById', () => {
    beforeEach((done) => {
      this.req = httpMocks.createRequest();
      this.res = httpMocks.createResponse();
      this.next = sinon.spy();
      done();
    });

    it('should set author property on response object based on passed id parameter', (done) => {
      const { res, req, next, author1 } = this;

      req.params.id = author1.id;
      authorController.getAuthorById(req, res, next).then(() => {
        expect(res.author.id).to.equal(author1.id);
        expect(next.calledWithExactly()).to.be.true;
        done();
      });
    });

    it('should call next with 404 error when author was not found', (done) => {
      const { res, req, next } = this;

      req.params.id = '507f1f77bcf86cd799439011';
      authorController.getAuthorById(req, res, next).then(() => {
        const [httpError] = next.firstCall.args;
        expect(httpError.status).to.equal(404);
        expect(httpError.message).to.equal('Author not found');
        done();
      });
    });
  });

  describe('renderAuthorList', () => {
    beforeEach((done) => {
      this.req = httpMocks.createRequest();
      this.res = httpMocks.createResponse();
      done();
    });

    it('should render author_list view file', (done) => {
      const { res, req } = this;
      authorController.renderAuthorList(req, res);
      expect(res._getRenderView()).to.equal('author_list');
      done();
    });

    it('should pass title variable to view file', (done) => {
      const { res, req } = this;

      authorController.renderAuthorList(req, res);

      const locals = res._getRenderData();
      expect(locals).to.have.property('title');
      expect(locals.title).to.equal('Author List');
      done();
    });

    it('should pass response attribute authorList to view file as author_list variable', (done) => {
      const { res, req } = this;

      res.authorList = [1, 2];
      authorController.renderAuthorList(req, res);

      const locals = res._getRenderData();
      expect(locals).to.have.property('author_list');
      expect(locals.author_list).to.equal(res.authorList);
      done();
    });
  });
});