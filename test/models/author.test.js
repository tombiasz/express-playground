const chai = require('chai');
const mocha = require('mocha');
const moment = require('moment');

const Author = require('../../models/author');
const dbUtils = require('../../utils/db.js');

const { expect } = chai;
const { describe, it, before } = mocha;


describe('Author model', () => {
  before((done) => {
    dbUtils
      .dropAllCollections()
      .then(() => {
        const today = new Date();

        this.author = new Author({
          first_name: 'John',
          family_name: 'Doe',
          date_of_birth: today.getDate() - 7,
          date_of_death: today.getDate() + 7,
        });
        this.author.save((err) => {
          if (err) { throw new Error(err); }
          done();
        });
      });
  });

  describe('first_name', () => {
    it('should be of type String', (done) => {
      const { first_name } = this.author.schema.paths;
      expect(first_name.options.type).to.equal(String);
      done();
    });

    it('should be required', (done) => {
      const { first_name } = this.author.schema.paths;
      expect(first_name.isRequired).to.equal(true);
      done();
    });

    it('should have max length of 100 characters', (done) => {
      const { first_name } = this.author.schema.paths;
      expect(first_name.options.max).to.equal(100);
      done();
    });
  });

  describe('family_name', () => {
    it('should be of type String', (done) => {
      const { family_name } = this.author.schema.paths;
      expect(family_name.options.type).to.equal(String);
      done();
    });

    it('should be required', (done) => {
      const { family_name } = this.author.schema.paths;
      expect(family_name.isRequired).to.equal(true);
      done();
    });

    it('should have max length of 100 characters', (done) => {
      const { family_name } = this.author.schema.paths;
      expect(family_name.options.max).to.equal(100);
      done();
    });
  });

  describe('date_of_birth', () => {
    it('should be of type Date', (done) => {
      const { date_of_birth } = this.author.schema.paths;
      expect(date_of_birth.options.type).to.equal(Date);
      done();
    });
  });

  describe('date_of_death', () => {
    it('should be of type Date', (done) => {
      const { date_of_death } = this.author.schema.paths;
      expect(date_of_death.options.type).to.equal(Date);
      done();
    });
  });

  describe('Virtual properties', () => {
    it('should have property name formatted as "family_name, first_name"', (done) => {
      const { first_name, family_name } = this.author;
      expect(this.author.name).to.equal(`${family_name}, ${first_name}`);
      done();
    });

    it('should have property url formatted as /catalog/author/{objId}', (done) => {
      const { id, url } = this.author;
      expect(url).to.equal(`/catalog/author/${id}`);
      done();
    });

    it('should have property url formatted as /catalog/author/{objId}', (done) => {
      const { id, url } = this.author;
      expect(url).to.equal(`/catalog/author/${id}`);
      done();
    });

    it('should have property date_of_birth_formatted formatted as YYYY-MM-DD', (done) => {
      const { date_of_birth, date_of_birth_formatted } = this.author;
      const expected = moment(date_of_birth).format('YYYY-MM-DD');
      expect(date_of_birth_formatted).to.equal(expected);
      done();
    });

    it('should have property date_of_death formatted as YYYY-MM-DD', (done) => {
      const { date_of_death, date_of_death_formatted } = this.author;
      const expected = moment(date_of_death).format('YYYY-MM-DD');
      expect(date_of_death_formatted).to.equal(expected);
      done();
    });

    it('should have property lifespan formatted as "date_of_birth_formatted' +
       ' - date_of_death_formatted" when both dates are provided', (done) => {
      const { lifespan, date_of_birth_formatted, date_of_death_formatted } = this.author;
      expect(lifespan).to.equal(`${date_of_birth_formatted} - ${date_of_death_formatted}`);
      done();
    });

    it('should have property lifespan formatted as "date_of_birth_formatted" ' +
       'when only birth_date is provided', (done) => {
      // unset date
      this.author.date_of_death = null;
      const { lifespan, date_of_birth_formatted } = this.author;
      expect(lifespan).to.equal(date_of_birth_formatted);
      done();
    });

    it('should have property lifespan be empty string when birth_date is not provided', (done) => {
      // unset dates
      this.author.date_of_birth = null;
      this.author.date_of_death = null;
      const { lifespan } = this.author;
      expect(lifespan).to.equal('');
      done();
    });
  });
});
