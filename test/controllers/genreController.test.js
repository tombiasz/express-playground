const chai = require('chai');
const mocha = require('mocha');
const testController = require('test-controller');

const Author = require('../../models/author');
const Book = require('../../models/book');
const Genre = require('../../models/genre');
const genreController = require('../../controllers/genreController');
const dbUtils = require('../../utils/db.js');


const { expect } = chai;
const { describe, it, before } = mocha;


describe('Genre controller', () => {
  before((done) => {
    dbUtils
      .dropAllCollections()
      .then(() => {
        const author = new Author({
          first_name: 'John',
          family_name: 'Doe',
        });
        this.genre1 = new Genre({
          name: 'Fantasy',
        });
        this.genre2 = new Genre({
          name: 'Sci-Fi',
        });
        this.genre3 = new Genre({
          name: 'Poetry',
        });

        Promise
          .all([
            author.save(),
            this.genre1.save(),
            this.genre2.save(),
            this.genre3.save(),
          ])
          .then((results) => {
            const [author, ...genres] = results;
            const book = new Book({
              title: 'The Title',
              author: author.id,
              summary: 'Summary',
              isbn: '123456789',
              genre: [this.genre1.id],
            });

            this.genres = genres;
            book.save((err) => {
              if (err) { throw new Error(err); }

              done();
            });
          });
      });
  });

  describe('genre_list', () => {
    it('should use proper template', (done) => {
      testController(genreController.genre_list)
        .get({}, (type, view) => {
          expect(view).to.equal('genre_list');
          done();
        });
    });

    it('should return title', (done) => {
      testController(genreController.genre_list)
        .get({}, (type, view, options) => {
          expect(options.title).to.equal('Genre List');
          done();
        });
    });

    it('should return array of genres', (done) => {
      testController(genreController.genre_list)
        .get({}, (type, view, options) => {
          expect(options.genre_list).to.be.a('array');
          done();
        });
    });

    it('should return all genres', (done) => {
      testController(genreController.genre_list)
        .get({}, (type, view, options) => {
          expect(options.genre_list.length).to.equal(this.genres.length);
          done();
        });
    });

    it('should sort returned genres in ascending order', (done) => {
      testController(genreController.genre_list)
        .get({}, (type, view, options) => {
          const getName = obj => obj.name;
          const actual = options.genre_list.map(getName);
          const expected = this.genres.map(getName);

          expect(actual).to.deep.equal(expected.sort());
          done();
        });
    });
  });

  describe('genre_detail', () => {
    it('should use proper template', (done) => {
      testController(genreController.genre_detail)
        .get({ id: this.genre1.id }, (type, view) => {
          expect(view).to.equal('genre_detail');
          done();
        });
    });

    it('should set template variable "title"', (done) => {
      testController(genreController.genre_detail)
        .get({ id: this.genre1.id }, (type, view, { title }) => {
          expect(title).to.equal('Genre Detail');
          done();
        });
    });

    it('should set template variable genre', (done) => {
      testController(genreController.genre_detail)
        .get({ id: this.genre1.id }, (type, view, { genre }) => {
          expect(genre).to.exist;
          done();
        });
    });

    it('genre should be an instance of Genre model', (done) => {
      testController(genreController.genre_detail)
        .get({ id: this.genre1.id }, (type, view, { genre }) => {
          expect(genre.constructor.modelName).to.equal(Genre.modelName);
          done();
        });
    });

    it('should set template variable genre_books', (done) => {
      testController(genreController.genre_detail)
        .get({ id: this.genre1.id }, (type, view, { genre_books }) => {
          expect(genre_books).to.exist;
          done();
        });
    });

    it('genre_books should be an array', (done) => {
      const genre_with_books = this.genre1;
      testController(genreController.genre_detail)
        .get({ id: genre_with_books.id }, (type, view, { genre_books }) => {
          expect(genre_books).to.be.a('array');
          done();
        });
    });

    it('genre_books should be an array of Books if there are books with this genre', (done) => {
      const genre_with_books = this.genre1;
      testController(genreController.genre_detail)
        .get({ id: genre_with_books.id }, (type, view, { genre_books }) => {
          expect(genre_books).to.be.a('array');
          expect(genre_books[0].constructor.modelName).to.equal(Book.modelName);
          done();
        });
    });

    it('genre_books should be an empty array if there are no Books with this genre', (done) => {
      const genre_without_books = this.genre2;
      testController(genreController.genre_detail)
        .get({ id: genre_without_books.id }, (type, view, { genre_books }) => {
          expect(genre_books).to.be.a('array').that.is.empty;
          done();
        });
    });

    it('should return 404 for nonexistent Genre', (done) => {
      const nonexistent_id = '507f1f77bcf86cd799439011';
      testController(genreController.genre_detail)
        .get({ id: nonexistent_id }, (type, err) => {
          expect(err.status).to.equal(404);
          expect(err.message).to.equal('Genre not found');
          done();
        });
    });
  });
});
