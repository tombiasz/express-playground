const app = require('../../app');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mocha = require('mocha');

const Author = require('../../models/author');
const Book = require('../../models/book');
const Genre = require('../../models/genre');


const { expect } = chai;
const { describe, it, before } = mocha;
chai.use(chaiHttp);

describe('Book routes', () => {
  before((done) => {
    const author = new Author({
      first_name: 'John',
      family_name: 'Doe',
      date_of_birth: null,
      date_of_death: null,
    });
    const genre = new Genre({
      name: 'Genre',
    });

    Promise
      .all([
        author.save(),
        genre.save(),
      ])
      .then((results) => {
        const [theAuthor, theGenre] = results;

        this.book = new Book({
          title: 'The Title',
          author: theAuthor.id,
          summary: 'Summary',
          isbn: '123456789',
          genre: [theGenre.id],
        });
        this.book.save((err) => {
          if (err) { throw new Error(err); }
          done();
        });
      });
  });

  describe('Book index GET route', () => {
    it('should responds with status 200', (done) => {
      chai
        .request(app)
        .get('/catalog/')
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe('Book list GET route', () => {
    it('should responds with status 200', (done) => {
      chai
        .request(app)
        .get('/catalog/books')
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe('Book detail GET route', () => {
    it('should responds with status 200', (done) => {
      chai
        .request(app)
        .get(`/catalog/book/${this.book.id}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe('Book create GET route', () => {
    it('should responds with status 200', (done) => {
      chai
        .request(app)
        .get('/catalog/book/create')
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe('Book create POST route', () => {
    it('should responds with status 200', (done) => {
      chai
        .request(app)
        .post('/catalog/book/create')
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe('Book update GET route', () => {
    it('should responds with status 200', (done) => {
      chai
        .request(app)
        .get(`/catalog/book/${this.book.id}/update`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe('Book update POST route', () => {
    it('should responds with status 200', (done) => {
      chai
        .request(app)
        .post(`/catalog/book/${this.book.id}/update`)
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe('Book delete GET route', () => {
    it('should responds with status 200', (done) => {
      chai
        .request(app)
        .get(`/catalog/book/${this.book.id}/delete`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe('Book delete POST route', () => {
    it('should responds with status 200', (done) => {
      chai
        .request(app)
        .post(`/catalog/book/${this.book.id}/delete`)
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });
});

describe('Author routes', () => {
  before((done) => {
    this.author = new Author({
      first_name: 'John',
      family_name: 'Doe',
      date_of_birth: null,
      date_of_death: null,
    });
    this.author.save((err) => {
      if (err) { throw new Error(err); }
      done();
    });
  });

  describe('Author index GET route', () => {
    it('should responds with status 200', (done) => {
      chai
        .request(app)
        .get('/catalog/authors')
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe('Author detail GET route', () => {
    it('should responds with status 200', (done) => {
      chai
        .request(app)
        .get(`/catalog/author/${this.author.id}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe('Author create GET route', () => {
    it('should responds with status 200', (done) => {
      chai
        .request(app)
        .get('/catalog/author/create')
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe('Author create POST route', () => {
    it('should responds with status 200', (done) => {
      chai
        .request(app)
        .post('/catalog/author/create')
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe('Author update GET route', () => {
    it('should responds with status 200', (done) => {
      chai
        .request(app)
        .get(`/catalog/author/${this.author.id}/update`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe('Author update POST route', () => {
    it('should responds with status 200', (done) => {
      chai
        .request(app)
        .post(`/catalog/author/${this.author.id}/update`)
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe('Author delete GET route', () => {
    it('should responds with status 200', (done) => {
      chai
        .request(app)
        .get(`/catalog/author/${this.author.id}/delete`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe('Author delete POST route', () => {
    it('should responds with status 200', (done) => {
      chai
        .request(app)
        .post(`/catalog/author/${this.author.id}/delete`)
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });
});

describe('Genre routes', () => {
  before((done) => {
    this.genre = new Genre({
      name: 'Genre',
    });
    this.genre.save((err) => {
      if (err) { throw new Error(err); }
      done();
    });
  });

  describe('Genre list GET route', () => {
    it('should responds with status 200', (done) => {
      chai
        .request(app)
        .get('/catalog/genres')
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe('Genre detail GET route', () => {
    it('should responds with status 200', (done) => {
      chai
        .request(app)
        .get(`/catalog/genre/${this.genre.id}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe('Genre create GET route', () => {
    it('should responds with status 200', (done) => {
      chai
        .request(app)
        .get('/catalog/genre/create')
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe('Genre create POST route', () => {
    it('should responds with status 200', (done) => {
      chai
        .request(app)
        .post('/catalog/genre/create')
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe('Genre update GET route', () => {
    it('should responds with status 200', (done) => {
      chai
        .request(app)
        .get(`/catalog/genre/${this.genre.id}/update`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe('Genre update POST route', () => {
    it('should responds with status 200', (done) => {
      chai
        .request(app)
        .post(`/catalog/genre/${this.genre.id}/update`)
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe('Genre delete GET route', () => {
    it('should responds with status 200', (done) => {
      chai
        .request(app)
        .get(`/catalog/genre/${this.book.id}/delete`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe('Genre delete POST route', () => {
    it('should responds with status 200', (done) => {
      chai
        .request(app)
        .post(`/catalog/genre/${this.book.id}/delete`)
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });
});
