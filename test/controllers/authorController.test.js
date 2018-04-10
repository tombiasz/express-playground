const chai = require('chai');
const mocha = require('mocha');

const Author = require('../../models/author');
const authorController = require('../../controllers/authorController');
const dbUtils = require('../../utils/db.js');


const { expect } = chai;
const { describe, it, before } = mocha;


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

        Promise
          .all([
            this.author1.save(),
            this.author2.save(),
          ])
          .then((results) => {
            this.authors = results;
            done();
          });
      });
  });

  describe('getAuthorById', () => {
    it('should set author property on response object', (done) => {
      done(new Error('todo'));
    });
  });
});
