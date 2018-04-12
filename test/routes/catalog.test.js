const app = require('../../app');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mocha = require('mocha');

const Author = require('../../models/author');
const Book = require('../../models/book');
const BookInstance = require('../../models/bookinstance');
const Genre = require('../../models/genre');
const dbUtils = require('../../utils/db.js');


const { expect } = chai;
const { describe, it, before } = mocha;
chai.use(chaiHttp);

describe('Book routes', () => {
  before((done) => {
    dbUtils
      .dropAllCollections()
      .then(() => {
        const author = new Author({
          first_name: 'John',
          family_name: 'Doe',
          date_of_birth: null,
          date_of_death: null,
        });
        const genre = new Genre({
          name: 'Genre',
        });

        return Promise
          .all([
            author.save(),
            genre.save(),
          ]);
      })
      .then((results) => {
        const [savedAuthor, savedGenre] = results;
        const book = new Book({
          title: 'The Title',
          author: savedAuthor.id,
          summary: 'Summary',
          isbn: '123456789',
          genre: [savedGenre.id],
        });

        return book.save();
      })
      .then((savedBook) => {
        this.book = savedBook;
        done();
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
    dbUtils
      .dropAllCollections()
      .then(() => {
        const author = new Author({
          first_name: 'John',
          family_name: 'Doe',
          date_of_birth: null,
          date_of_death: null,
        });

        return author.save();
      })
      .then((savedAuthor) => {
        this.author = savedAuthor;
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
    dbUtils
      .dropAllCollections()
      .then(() => {
        const genre = new Genre({
          name: 'Genre',
        });

        return genre.save();
      })
      .then((savedGenre) => {
        this.genre = savedGenre;
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

describe('BookInstance routes', () => {
  before((done) => {
    dbUtils
      .dropAllCollections()
      .then(() => {
        const author = new Author({
          first_name: 'John',
          family_name: 'Doe',
          date_of_birth: null,
          date_of_death: null,
        });
        const genre = new Genre({
          name: 'Genre',
        });

        return Promise
          .all([
            author.save(),
            genre.save(),
          ]);
      })
      .then((results) => {
        const [savedAuthor, savedGenre] = results;
        const book = new Book({
          title: 'The Title',
          author: savedAuthor.id,
          summary: 'Summary',
          isbn: '123456789',
          genre: [savedGenre.id],
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

  describe('BookInstance list GET route', () => {
    it('should responds with status 200', (done) => {
      chai
        .request(app)
        .get('/catalog/bookinstances')
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe('BookInstance detail GET route', () => {
    it('should responds with status 200', (done) => {
      chai
        .request(app)
        .get(`/catalog/bookinstance/${this.bookinstance.id}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe('BookInstance create GET route', () => {
    it('should responds with status 200', (done) => {
      chai
        .request(app)
        .get('/catalog/bookinstance/create')
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe('BookInstance create POST route', () => {
    it('should responds with status 200', (done) => {
      chai
        .request(app)
        .post('/catalog/bookinstance/create')
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe('BookInstance update GET route', () => {
    it('should responds with status 200', (done) => {
      chai
        .request(app)
        .get(`/catalog/bookinstance/${this.bookinstance.id}/update`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe('BookInstance update POST route', () => {
    it('should responds with status 200', (done) => {
      chai
        .request(app)
        .post(`/catalog/bookinstance/${this.bookinstance.id}/update`)
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe('BookInstance delete GET route', () => {
    it('should responds with status 200', (done) => {
      chai
        .request(app)
        .get(`/catalog/bookinstance/${this.bookinstance.id}/delete`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe('BookInstance delete POST route', () => {
    it('should responds with status 200', (done) => {
      chai
        .request(app)
        .post(`/catalog/bookinstance/${this.bookinstance.id}/delete`)
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });
});
