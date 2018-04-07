const chai = require('chai');
const mocha = require('mocha');

const Genre = require('../../models/genre');


const { expect } = chai;
const { describe, it, before } = mocha;

describe('Genre model', () => {
  before((done) => {
    this.genre = new Genre({
      name: 'Genre',
    });
    this.genre.save((err) => {
      if (err) { throw new Error(err); }
      done();
    });
  });

  describe('name', () => {
    it('should be of type String', (done) => {
      const { name } = this.genre.schema.paths;
      expect(name.options.type).to.equal(String);
      done();
    });

    it('should be required', (done) => {
      const { name } = this.genre.schema.paths;
      expect(name.isRequired).to.equal(true);
      done();
    });

    it('should have min length of 3 characters', (done) => {
      const { name } = this.genre.schema.paths;
      expect(name.options.min).to.equal(3);
      done();
    });

    it('should have max length of 100 characters', (done) => {
      const { name } = this.genre.schema.paths;
      expect(name.options.max).to.equal(100);
      done();
    });
  });

  describe('Virtual properties', () => {
    it('should have property url formatted as /catalog/genre/{objId}', (done) => {
      const { id, url } = this.genre;
      expect(url).to.equal(`/catalog/genre/${id}`);
      done();
    });
  });
});
