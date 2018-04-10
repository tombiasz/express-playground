const { body, validationResult } = require('express-validator/check');
const createError = require('http-errors');
const { sanitizeBody } = require('express-validator/filter');

const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
const BookInstance = require('../models/bookinstance');


exports.getBookById = (req, res, next) => {
  const { id } = req.params;
  Book
    .findById(id)
    .populate('author')
    .populate('genre')
    .exec()
    .then((book) => {
      if (!book) {
        next(createError(404, 'Book not found'));
      } else {
        res.book = book;
        next();
      }
    })
    .catch(next);
};

exports.getBookBookInstances = (req, res, next) => {
  const { book } = res;

  BookInstance
    .find({ book: book.id })
    .exec()
    .then((bookInstances) => {
      res.bookInstances = Array.isArray(bookInstances) ? bookInstances : [];
      next();
    })
    .catch(next);
};

exports.renderBookIndex = (req, res, next) => {
  Promise
    .all([
      Book.count({}).exec(),
      BookInstance.count({}).exec(),
      BookInstance.count({ status: 'Available' }).exec(),
      Author.count({}).exec(),
      Genre.count({}).exec(),
    ])
    .then((results) => {
      const [
        book_count,
        book_instance_count,
        book_instance_available_count,
        author_count,
        genre_count,
      ] = results;
      const data = {
        book_count,
        book_instance_count,
        book_instance_available_count,
        author_count,
        genre_count,
      };
      res.render('index', { title: 'Local Library Home', data });
    })
    .catch(next);
};

exports.renderBookList = (req, res, next) => {
  Book
    .find({}, 'title author')
    .populate('author')
    .exec()
    .then((bookList) => {
      res.render('book_list', {
        title: 'Book List',
        book_list: bookList,
      });
    })
    .catch(next);
};

exports.renderBookDetail = (req, res) => {
  const { book, bookInstances } = res;

  res.render('book_detail', {
    title: 'Title',
    book,
    book_instances: bookInstances,
  });
};

exports.renderBookCreateForm = (req, res, next) => {
  Promise
    .all([
      Author.find().exec(),
      Genre.find().exec(),
    ])
    .then((results) => {
      const [authors, genres] = results;
      res.render('book_form', { title: 'Create Book', authors, genres });
    })
    .catch(next);
};

exports.validateBookForm = [
  // Convert the genre to an array.
  (req, res, next) => {
    const { genre } = req.body;
    if (!(genre instanceof Array)) {
      if (typeof genre === 'undefined') {
        req.body.genre = [];
      } else {
        req.body.genre = new Array(genre);
      }
    }
    next();
  },

  body('title', 'Title must not be empty.')
    .isLength({ min: 1 })
    .trim(),

  body('author', 'Author must not be empty.')
    .isLength({ min: 1 })
    .trim(),

  body('summary', 'Summary must not be empty.')
    .isLength({ min: 1 })
    .trim(),

  body('isbn', 'ISBN must not be empty')
    .isLength({ min: 1 })
    .trim(),

  sanitizeBody('*')
    .trim()
    .escape(),
];

exports.processBookCreateForm = (req, res, next) => {
  const errors = validationResult(req);
  const {
    title,
    author,
    summary,
    isbn,
    genre,
  } = req.body;
  const newBook = new Book({
    title,
    author,
    summary,
    isbn,
    genre,
  });

  if (!errors.isEmpty()) {
    Promise
      .all([
        Author.find().exec(),
        Genre.find().exec(),
      ])
      .then((results) => {
        const [authors, genres] = results;

        // mark our selected genres as checked.
        for (let i = 0; i < genres.length; i += 1) {
          if (newBook.genre.indexOf(genres[i].id) > -1) {
            genres[i].checked = 'true';
          }
        }

        res.render('book_form', {
          title: 'Create Book',
          authors,
          genres,
          book: newBook,
          errors: errors.array(),
        });
      })
      .catch(next);
  } else {
    newBook
      .save()
      .then(() => res.redirect(newBook.url))
      .catch(next);
  }
};

exports.renderBookDeleteForm = (req, res) => {
  const { book, bookInstances } = res;

  res.render('book_delete', {
    title: 'Delete Book',
    book,
    book_instances: bookInstances,
  });
};

exports.processBookDeleteForm = (req, res, next) => {
  const { book, bookInstances } = res;

  if (bookInstances.length > 0) {
    res.render('book_delete', {
      title: 'Delete Book',
      book,
      book_instances: bookInstances,
    });
  } else {
    Book
      .findByIdAndRemove(book.id)
      .exec()
      .then(() => res.redirect('/catalog/books'))
      .catch(next);
  }
};

exports.renderBookUpdateForm = (req, res, next) => {
  const { book } = res;

  Promise
    .all([
      Author.find().exec(),
      Genre.find().exec(),
    ])
    .then((results) => {
      const [authors, genres] = results;

      // mark our selected genres as checked.
      for (let all_g_iter = 0; all_g_iter < genres.length; all_g_iter += 1) {
        for (let book_g_iter = 0; book_g_iter < book.genre.length; book_g_iter += 1) {
          if (genres[all_g_iter].id.toString() === book.genre[book_g_iter].id.toString()) {
            genres[all_g_iter].checked = 'true';
          }
        }
      }
      res.render('book_form', {
        title: 'Update Book',
        authors,
        genres,
        book,
      });
    })
    .catch(next);
};

exports.processBookUpdateForm = (req, res, next) => {
  const { book } = res;
  const errors = validationResult(req);
  const {
    title,
    author,
    summary,
    isbn,
    genre,
  } = req.body;
  const updatedBook = new Book({
    _id: book.id,
    title,
    author,
    summary,
    isbn,
    genre,
  });

  if (!errors.isEmpty()) {
    Promise
      .all([
        Author.find().exec(),
        Genre.find().exec(),
      ])
      .then((results) => {
        const [authors, genres] = results;

        // mark our selected genres as checked.
        for (let i = 0; i < genres.length; i += 1) {
          if (updatedBook.genre.indexOf(genres[i].id) > -1) {
            genres[i].checked = 'true';
          }
        }

        res.render('book_form', {
          title: 'Update Book',
          authors,
          genres,
          book: updatedBook,
          errors: errors.array(),
        });
      })
      .catch(next);
  } else {
    Book
      .findByIdAndUpdate(book.id, updatedBook)
      .exec()
      .then(() => res.redirect(updatedBook.url))
      .catch(next);
  }
};
