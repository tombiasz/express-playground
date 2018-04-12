const chai = require('chai');
const httpMocks = require('node-mocks-http');
const mocha = require('mocha');
const sinon = require('sinon');

const Author = require('../../models/author');
const Book = require('../../models/book');
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
          family_name: 'Daniels',
        });

        return Promise
          .all([
            this.author1.save(),
            this.author2.save(),
          ]);
      })
      .then((savedAuthors) => {
        this.authors = savedAuthors;

        const book1 = new Book({
          title: 'Book 1',
          author: this.author1.id,
          summary: 'Summary',
          isbn: '123456789',
          genre: [],
        });
        const book2 = new Book({
          title: 'Book 2',
          author: this.author1.id,
          summary: 'Summary',
          isbn: '123456789',
          genre: [],
        });

        return Promise
          .all([
            book1.save(),
            book2.save(),
          ]);
      })
      .then(() => {
        done();
      })
      .catch(done);
  });

  beforeEach((done) => {
    this.req = httpMocks.createRequest();
    this.res = httpMocks.createResponse();
    this.next = sinon.spy();
    done();
  });

  describe('getAuthorById', () => {
    it('should set author property on response object based on passed id parameter', (done) => {
      const { res, req, next, author1 } = this;

      req.params.id = author1.id;
      authorController
        .getAuthorById(req, res, next)
        .then(() => {
          expect(res.author.id).to.equal(author1.id);
          expect(next.calledWithExactly()).to.be.true;
          done();
        })
        .catch(done);
    });

    it('should call next with 404 error when author was not found', (done) => {
      const { res, req, next } = this;

      req.params.id = '507f1f77bcf86cd799439011';
      authorController
        .getAuthorById(req, res, next)
        .then(() => {
          const [httpError] = next.firstCall.args;
          expect(httpError.status).to.equal(404);
          expect(httpError.message).to.equal('Author not found');
          done();
        })
        .catch(done);
    });
  });

  describe('getAllAuthors', () => {
    it('should set authorList property on response object', (done) => {
      const { req, res, next } = this;
      authorController
        .getAllAuthors(req, res, next)
        .then(() => {
          expect(res).to.have.property('authorList');
          done();
        })
        .catch(done);
    });

    it('should authorList be an array of Author objects', (done) => {
      const { req, res, next } = this;
      authorController
        .getAllAuthors(req, res, next)
        .then(() => {
          const obj = res.authorList.pop();
          expect(res.authorList).to.be.a('array');
          expect(obj.constructor.modelName).to.equal('Author');
          done();
        })
        .catch(done);
    });

    it('should authorList contain all authors', (done) => {
      const { author1, author2, req, res, next } = this;
      authorController
        .getAllAuthors(req, res, next)
        .then(() => {
          const foundIds = res.authorList.map(obj => obj.id);

          expect(res.authorList.length).to.equal(2);
          expect(foundIds).to.include(author1.id);
          expect(foundIds).to.include(author2.id);
          done();
        })
        .catch(done);
    });

    it('should authorList have elements sorted in ascending order by family_name', (done) => {
      const { author1, author2, req, res, next } = this;
      authorController
        .getAllAuthors(req, res, next)
        .then(() => {
          const authors = [author1, author2];
          const getFamilyName = obj => obj.family_name;
          const actual = res.authorList.map(getFamilyName);
          const expected = authors.map(getFamilyName);

          expect(actual).to.deep.equal(expected.sort());
          done();
        })
        .catch(done);
    });

    it('should authorList be an empty array when there are no authors', (done) => {
      const { authors, req, res, next } = this;

      Author
        .remove()
        .exec()
        .then(() => authorController.getAllAuthors(req, res, next))
        .then(() => {
          expect(res.authorList).to.be.a('array');
          expect(res.authorList).to.be.empty;
          return Promise.resolve();
        })
        .then(() => Author.insertMany(authors))
        .then(() => done())
        .catch(done);
    });
  });

  describe('getAuthorBooks', () => {
    it('should set authorBooks property on response object', (done) => {
      const { author1, req, res, next } = this;

      res.author = author1;
      authorController
        .getAuthorBooks(req, res, next)
        .then(() => {
          expect(res).to.have.property('authorBooks');
          done();
        })
        .catch(done);
    });

    it('should authorBooks be an array of Book objects', (done) => {
      const { author1, req, res, next } = this;

      res.author = author1;
      authorController
        .getAuthorBooks(req, res, next)
        .then(() => {
          const { authorBooks } = res;
          expect(authorBooks).to.be.a('array');

          const getModelName = obj => obj.constructor.modelName;
          const models = authorBooks.map(getModelName);
          models.forEach(obj => expect(obj).to.equal('Book'));
          done();
        })
        .catch(done);
    });

    it('should authorBooks container books by same author', (done) => {
      const { author1, req, res, next } = this;

      res.author = author1;
      authorController
        .getAuthorBooks(req, res, next )
        .then(() => {
          const { authorBooks } = res;
          expect(authorBooks).to.be.a('array');

          const getAuthorId = obj => obj.author.toString();
          const authors = authorBooks.map(getAuthorId);
          authors.forEach(obj => expect(obj).to.equal(res.author.id));
          done();
        })
        .catch(done);
    });

    it('should authorBooks container books by same author', (done) => {
      const { author1, req, res, next } = this;

      res.author = author1;
      authorController
        .getAuthorBooks(req, res, next)
        .then(() => {
          const { authorBooks } = res;
          expect(authorBooks).to.be.a('array');

          const getAuthorId = obj => obj.author.toString();
          const authors = authorBooks.map(getAuthorId);
          authors.forEach(obj => expect(obj).to.equal(res.author.id));
          done();
        })
        .catch(done);
    });

    it('should authorBooks be an empty array when author has no books', (done) => {
      const { author2, req, res, next } = this;

      res.author = author2;
      authorController
        .getAuthorBooks(req, res, next)
        .then(() => {
          const { authorBooks } = res;
          expect(authorBooks).to.be.a('array');
          expect(authorBooks).to.be.empty;
          done();
        })
        .catch(done);
    });
  });

  describe('renderAuthorList', () => {
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

  describe('renderAuthoDetail', () => {
    it('should render author_detail view file', (done) => {
      const { res, req } = this;
      authorController.renderAuthorDetail(req, res);
      expect(res._getRenderView()).to.equal('author_detail');
      done();
    });

    it('should pass title variable to view file', (done) => {
      const { res, req } = this;

      authorController.renderAuthorDetail(req, res);

      const locals = res._getRenderData();
      expect(locals).to.have.property('title');
      expect(locals.title).to.equal('Author Detail');
      done();
    });

    it('should pass response attribute author to view file as author variable', (done) => {
      const { res, req } = this;

      res.author = 'test';
      authorController.renderAuthorDetail(req, res);

      const locals = res._getRenderData();
      expect(locals).to.have.property('author');
      expect(locals.author).to.equal(res.author);
      done();
    });

    it('should pass response attribute authorBooks to view file as author_books variable', (done) => {
      const { res, req } = this;

      res.authorBooks = [1, 2];
      authorController.renderAuthorDetail(req, res);

      const locals = res._getRenderData();
      expect(locals).to.have.property('author_books');
      expect(locals.author_books).to.equal(res.authorBooks);
      done();
    });
  });

  describe('renderAuthorCreateForm', () => {
    it('should render author_form view file', (done) => {
      const { res, req } = this;
      authorController.renderAuthorCreateForm(req, res);
      expect(res._getRenderView()).to.equal('author_form');
      done();
    });

    it('should pass title variable to view file', (done) => {
      const { res, req } = this;

      authorController.renderAuthorCreateForm(req, res);

      const locals = res._getRenderData();
      expect(locals).to.have.property('title');
      expect(locals.title).to.equal('Create Author');
      done();
    });
  });
});
