const chai = require('chai');
const mocha = require('mocha');
const moment = require('moment');
const mongoose = require('mongoose');

const Author = require('../../models/author');
const Book = require('../../models/book');
const BookInstance = require('../../models/bookinstance');
const dbUtils = require('../../utils/db.js');


const { expect } = chai;
const { describe, it, before } = mocha;
const { Schema } = mongoose;

describe('BookInstance model', () => {
  before((done) => {
    dbUtils
      .dropAllCollections()
      .then(() => {
        const author = new Author({
          first_name: 'John',
          family_name: 'Doe',
        });

        return author.save();
      })
      .then((savedAuthor) => {
        const book = new Book({
          title: 'The Title',
          author: savedAuthor.id,
          summary: 'Summary',
          isbn: '123456789',
          genre: [],
        });

        return book.save();
      })
      .then((savedBook) => {
        const bookinstance = new BookInstance({
          book: savedBook.id,
          imprint: 'Imprint',
        });

        return bookinstance.save();
      })
      .then((savedBookInstance) => {
        this.bookinstance = savedBookInstance;
        done();
      });
  });

  describe('book', () => {
    it('should be a ref to Book model', (done) => {
      const { book } = this.bookinstance.schema.paths;
      expect(book.options.type).to.equal(Schema.ObjectId);
      expect(book.options.ref).to.equal('Book');
      done();
    });

    it('should be required', (done) => {
      const { book } = this.bookinstance.schema.paths;
      expect(book.isRequired).to.equal(true);
      done();
    });
  });

  describe('imprint', () => {
    it('should be of type String', (done) => {
      const { imprint } = this.bookinstance.schema.paths;
      expect(imprint.options.type).to.equal(String);
      done();
    });

    it('should be required', (done) => {
      const { imprint } = this.bookinstance.schema.paths;
      expect(imprint.isRequired).to.equal(true);
      done();
    });
  });

  describe('staus', () => {
    it('should be of type String', (done) => {
      const { status } = this.bookinstance.schema.paths;
      expect(status.options.type).to.equal(String);
      done();
    });

    it('should be enum', (done) => {
      const { status } = this.bookinstance.schema.paths;
      expect(status.options.enum).not.to.be.empty;
      done();
    });

    it('should be required', (done) => {
      const { status } = this.bookinstance.schema.paths;
      expect(status.isRequired).to.equal(true);
      done();
    });

    it('should have default value set to Maintenance', (done) => {
      const { status } = this.bookinstance.schema.paths;
      expect(status.options.default).to.equal('Maintenance');
      done();
    });
  });

  describe('due_back', () => {
    it('should be of type Date', (done) => {
      const { due_back } = this.bookinstance.schema.paths;
      expect(due_back.options.type).to.equal(Date);
      done();
    });

    it('should have default value set to Date.now()', (done) => {
      const { due_back } = this.bookinstance.schema.paths;
      expect(due_back.options.default).to.equal(Date.now);
      done();
    });
  });

  describe('Virtual properties', () => {
    it('should have property url formatted as /catalog/bookinstance/{objId}', (done) => {
      const { id, url } = this.bookinstance;
      expect(url).to.equal(`/catalog/bookinstance/${id}`);
      done();
    });

    it('should have property due_back_formatted formatted as MMMM Do, YYYY', (done) => {
      const { due_back, due_back_formatted } = this.bookinstance;
      const expected = moment(due_back).format('MMMM Do, YYYY');
      expect(due_back_formatted).to.equal(expected);
      done();
    });
  });
});
