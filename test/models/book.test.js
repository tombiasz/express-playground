const chai = require('chai');
const mocha = require('mocha');
const mongoose = require('mongoose');

const Author = require('../../models/author');
const Book = require('../../models/book');
const dbUtils = require('../../utils/db.js');


const { expect } = chai;
const { describe, it, before } = mocha;
const { Schema } = mongoose;


describe('Book model', () => {
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
        this.book = savedBook;
        done();
      });
  });

  describe('title', () => {
    it('should be of type String', (done) => {
      const { title } = this.book.schema.paths;
      expect(title.options.type).to.equal(String);
      done();
    });

    it('should be required', (done) => {
      const { title } = this.book.schema.paths;
      expect(title.isRequired).to.equal(true);
      done();
    });
  });

  describe('author', () => {
    it('should be a ref to Author model', (done) => {
      const { author } = this.book.schema.paths;
      expect(author.options.type).to.equal(Schema.ObjectId);
      expect(author.options.ref).to.equal('Author');
      done();
    });

    it('should be required', (done) => {
      const { author } = this.book.schema.paths;
      expect(author.isRequired).to.equal(true);
      done();
    });
  });

  describe('summary', () => {
    it('should be of type String', (done) => {
      const { summary } = this.book.schema.paths;
      expect(summary.options.type).to.equal(String);
      done();
    });

    it('should be required', (done) => {
      const { summary } = this.book.schema.paths;
      expect(summary.isRequired).to.equal(true);
      done();
    });
  });

  describe('isbn', () => {
    it('should be of type String', (done) => {
      const { isbn } = this.book.schema.paths;
      expect(isbn.options.type).to.equal(String);
      done();
    });

    it('should be required', (done) => {
      const { isbn } = this.book.schema.paths;
      expect(isbn.isRequired).to.equal(true);
      done();
    });
  });

  describe('genre', () => {
    it('should be of type Array', (done) => {
      const { genre } = this.book.schema.paths;
      expect(genre.options.type).to.be.a('array');
      done();
    });

    it('should have elements which are ref to Genre model', (done) => {
      const { genre } = this.book.schema.paths;
      expect(genre.options.type[0].type).to.equal(Schema.ObjectId);
      expect(genre.options.type[0].ref).to.equal('Genre');
      done();
    });
  });


  describe('Virtual properties', () => {
    it('should have property url formatted as /catalog/book/{objId}', (done) => {
      const { id, url } = this.book;
      expect(url).to.equal(`/catalog/book/${id}`);
      done();
    });
  });
});
