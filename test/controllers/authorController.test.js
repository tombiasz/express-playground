const chai = require('chai');
const httpMocks = require('node-mocks-http');
const mocha = require('mocha');
const moment = require('moment');
const sinon = require('sinon');
const { validationResult } = require('express-validator/check');

const Author = require('../../models/author');
const Book = require('../../models/book');
const authorController = require('../../controllers/authorController');
const dbUtils = require('../../utils/db');
const testUtils = require('../../utils/test');


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

  describe('validateAuthorForm', () => {
    it('should verify if first_name was provided', (done) => {
      const { res, req, next } = this;
      const formData = {
        first_name: null,
      };

      req.body = formData;
      testUtils
        .testExpressValidatorArrayMiddleware(req, res, next, authorController.validateAuthorForm)
        .then(() => {
          const errors = validationResult(req);
          const { first_name } = errors.mapped();
          expect(first_name.msg).to.equal('First name must be specified.');
          done();
        })
        .catch(done);
    });

    it('should verify if first_name has only alphanumeric characters', (done) => {
      const { res, req, next } = this;
      const formData = {
        first_name: 'name with space',
      };

      req.body = formData;
      testUtils
        .testExpressValidatorArrayMiddleware(req, res, next, authorController.validateAuthorForm)
        .then(() => {
          const errors = validationResult(req);
          const { first_name } = errors.mapped();
          expect(first_name.msg).to.equal('First name has non-alphanumeric characters.');
          done();
        })
        .catch(done);
    });

    it('should verify if valid first_name will not rise validation error', (done) => {
      const { res, req, next } = this;
      const formData = {
        first_name: 'propername',
      };

      req.body = formData;
      testUtils
        .testExpressValidatorArrayMiddleware(req, res, next, authorController.validateAuthorForm)
        .then(() => {
          const errors = validationResult(req);
          const { first_name } = errors.mapped();
          expect(first_name).to.equal(undefined);
          done();
        })
        .catch(done);
    });

    it('should verify if family_name was provided', (done) => {
      const { res, req, next } = this;
      const formData = {
        family_name: null,
      };

      req.body = formData;
      testUtils
        .testExpressValidatorArrayMiddleware(req, res, next, authorController.validateAuthorForm)
        .then(() => {
          const errors = validationResult(req);
          const { family_name } = errors.mapped();
          expect(family_name.msg).to.equal('Family name must be specified.');
          done();
        })
        .catch(done);
    });

    it('should verify if family_name has only alphanumeric characters', (done) => {
      const { res, req, next } = this;
      const formData = {
        family_name: 'name with space',
      };

      req.body = formData;
      testUtils
        .testExpressValidatorArrayMiddleware(req, res, next, authorController.validateAuthorForm)
        .then(() => {
          const errors = validationResult(req);
          const { family_name } = errors.mapped();
          expect(family_name.msg).to.equal('Family name has non-alphanumeric characters.');
          done();
        })
        .catch(done);
    });

    it('should verify if valid family_name will not rise validation error', (done) => {
      const { res, req, next } = this;
      const formData = {
        family_name: 'propername',
      };

      req.body = formData;
      testUtils
        .testExpressValidatorArrayMiddleware(req, res, next, authorController.validateAuthorForm)
        .then(() => {
          const errors = validationResult(req);
          const { family_name } = errors.mapped();
          expect(family_name).to.equal(undefined);
          done();
        })
        .catch(done);
    });

    it('should verify if date_of_birth can be null', (done) => {
      const { res, req, next } = this;
      const formData = {
        date_of_birth: null,
      };

      req.body = formData;
      testUtils
        .testExpressValidatorArrayMiddleware(req, res, next, authorController.validateAuthorForm)
        .then(() => {
          const errors = validationResult(req);
          const { date_of_birth } = errors.mapped();
          expect(date_of_birth).to.equal(undefined);
          done();
        })
        .catch(done);
    });

    it('should verify if valid date_of_birth will not rise validation error', (done) => {
      const { res, req, next } = this;
      const formData = {
        date_of_birth: '1922-01-22',
      };

      req.body = formData;
      testUtils
        .testExpressValidatorArrayMiddleware(req, res, next, authorController.validateAuthorForm)
        .then(() => {
          const errors = validationResult(req);
          const { date_of_birth } = errors.mapped();
          expect(date_of_birth).to.equal(undefined);
          done();
        })
        .catch(done);
    });

    it('should verify if invalid date_of_birth will rise validation error', (done) => {
      const { res, req, next } = this;
      const formData = {
        date_of_birth: '1922-61-22',
      };

      req.body = formData;
      testUtils
        .testExpressValidatorArrayMiddleware(req, res, next, authorController.validateAuthorForm)
        .then(() => {
          const errors = validationResult(req);
          const { date_of_birth } = errors.mapped();
          expect(date_of_birth.msg).to.equal('Invalid date of birth');
          done();
        })
        .catch(done);
    });

    it('should verify if date_of_death can be null', (done) => {
      const { res, req, next } = this;
      const formData = {
        date_of_death: null,
      };

      req.body = formData;
      testUtils
        .testExpressValidatorArrayMiddleware(req, res, next, authorController.validateAuthorForm)
        .then(() => {
          const errors = validationResult(req);
          const { date_of_death } = errors.mapped();
          expect(date_of_death).to.equal(undefined);
          done();
        })
        .catch(done);
    });

    it('should verify if valid date_of_death will not rise validation error', (done) => {
      const { res, req, next } = this;
      const formData = {
        date_of_death: '1922-01-22',
      };

      req.body = formData;
      testUtils
        .testExpressValidatorArrayMiddleware(req, res, next, authorController.validateAuthorForm)
        .then(() => {
          const errors = validationResult(req);
          const { date_of_death } = errors.mapped();
          expect(date_of_death).to.equal(undefined);
          done();
        })
        .catch(done);
    });

    it('should verify if invalid date_of_death will rise validation error', (done) => {
      const { res, req, next } = this;
      const formData = {
        date_of_death: '1922-61-22',
      };

      req.body = formData;
      testUtils
        .testExpressValidatorArrayMiddleware(req, res, next, authorController.validateAuthorForm)
        .then(() => {
          const errors = validationResult(req);
          const { date_of_death } = errors.mapped();
          expect(date_of_death.msg).to.equal('Invalid date of death');
          done();
        })
        .catch(done);
    });

    it('should verify if first_name will be trimmed', (done) => {
      const { res, req, next } = this;
      const formData = {
        first_name: '     name      ',
      };

      req.body = formData;
      testUtils
        .testExpressValidatorArrayMiddleware(req, res, next, authorController.validateAuthorForm)
        .then(() => {
          expect(req.body.first_name).to.equal('name');
          done();
        })
        .catch(done);
    });

    it('should verify if first_name will be escaped', (done) => {
      const { res, req, next } = this;
      const formData = {
        first_name: 'name<script>alert(1)</script>',
      };

      req.body = formData;
      testUtils
        .testExpressValidatorArrayMiddleware(req, res, next, authorController.validateAuthorForm)
        .then(() => {
          const actual = req.body.first_name;
          const expected = 'name&lt;script&gt;alert(1)&lt;&#x2F;script&gt;';
          expect(actual).to.equal(expected);
          done();
        })
        .catch(done);
    });

    it('should verify if family_name will be trimmed', (done) => {
      const { res, req, next } = this;
      const formData = {
        family_name: '     name      ',
      };

      req.body = formData;
      testUtils
        .testExpressValidatorArrayMiddleware(req, res, next, authorController.validateAuthorForm)
        .then(() => {
          expect(req.body.family_name).to.equal('name');
          done();
        })
        .catch(done);
    });

    it('should verify if family_name will be escaped', (done) => {
      const { res, req, next } = this;
      const formData = {
        family_name: 'name<script>alert(1)</script>',
      };

      req.body = formData;
      testUtils
        .testExpressValidatorArrayMiddleware(req, res, next, authorController.validateAuthorForm)
        .then(() => {
          const { family_name } = req.body;
          expect(family_name).to.equal('name&lt;script&gt;alert(1)&lt;&#x2F;script&gt;');
          done();
        })
        .catch(done);
    });

    it('should verify if date_of_birth will be cast to Date', (done) => {
      const { res, req, next } = this;
      const formData = {
        date_of_birth: '1925-01-23',
      };

      req.body = formData;
      testUtils
        .testExpressValidatorArrayMiddleware(req, res, next, authorController.validateAuthorForm)
        .then(() => {
          const { date_of_birth } = req.body;
          expect(date_of_birth instanceof Date).to.be.true;
          done();
        })
        .catch(done);
    });

    it('should verify if date_of_death will be cast to Date', (done) => {
      const { res, req, next } = this;
      const formData = {
        date_of_death: '1925-01-23',
      };

      req.body = formData;
      testUtils
        .testExpressValidatorArrayMiddleware(req, res, next, authorController.validateAuthorForm)
        .then(() => {
          const { date_of_death } = req.body;
          expect(date_of_death instanceof Date).to.be.true;
          done();
        })
        .catch(done);
    });
  });

  describe('processAuthorUpdateForm', () => {
    it('should render author_form view when there are form errors', (done) => {
      const { author1, req, res, next } = this;

      req._validationErrors = [1, 2, 3]; // fake express-validator errors
      res.author = author1;
      authorController.processAuthorUpdateForm(req, res, next);
      expect(res._getRenderView()).to.be.equal('author_form');
      done();
    });

    it('should pass form data back to the view as author object when there are form errors', (done) => {
      const { author1, req, res, next } = this;
      const formData = {
        first_name: 'jim',
        family_name: 'jones',
        date_of_birth: moment().add(-7, 'days'),
        date_of_death: moment().add(7, 'days'),
      };

      req._validationErrors = [1, 2, 3]; // fake express-validator errors
      req.body = formData;
      res.author = author1;
      authorController.processAuthorUpdateForm(req, res, next);

      const renderData = res._getRenderData();

      expect(renderData).to.have.property('author');

      const updatedAuthor = renderData.author;

      expect(updatedAuthor.first_name).to.be.equal(formData.first_name);
      expect(updatedAuthor.family_name).to.be.equal(formData.family_name);
      expect(updatedAuthor.date_of_birth.toISOString()).to.be.equal(formData.date_of_birth.toISOString());
      expect(updatedAuthor.date_of_death.toISOString()).to.be.equal(formData.date_of_death.toISOString());
      done();
    });

    it('should pass array with errors to the view when there are form errors', (done) => {
      const { author1, req, res, next } = this;

      req._validationErrors = [1, 2, 3]; // fake express-validator errors
      res.author = author1;
      authorController.processAuthorUpdateForm(req, res, next);

      const renderData = res._getRenderData();

      expect(renderData).to.have.property('errors');
      expect(renderData.errors).to.be.a('array');
      expect(renderData.errors).to.deep.equal(req._validationErrors);
      done();
    });

    it('should pass title to the view when there are form errors', (done) => {
      const { author1, req, res, next } = this;

      req._validationErrors = [1, 2, 3]; // fake express-validator errors
      res.author = author1;
      authorController.processAuthorUpdateForm(req, res, next);

      const renderData = res._getRenderData();

      expect(renderData).to.have.property('title');
      expect(renderData.title).to.be.equal('Update Author');
      done();
    });

    it('should update author when form is valid');
    it('should redirect to author detail after author update');
  });
});
