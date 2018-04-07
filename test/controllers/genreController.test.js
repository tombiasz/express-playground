const chai = require('chai');
const mocha = require('mocha');
const testController = require('test-controller');

const Genre = require('../../models/genre');
const genreController = require('../../controllers/genreController');


const { expect } = chai;
const { describe, it, before } = mocha;


describe('Genre controller', () => {
  before((done) => {
    Genre.collection.drop();

    const genre1 = new Genre({
      name: 'Fantasy',
    });
    const genre2 = new Genre({
      name: 'Sci-Fi',
    });
    const genre3 = new Genre({
      name: 'Poetry',
    });

    Promise.all([
      genre1.save(),
      genre2.save(),
      genre3.save(),
    ]).then((results) => {
      this.genres = results;
      done();
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
});
