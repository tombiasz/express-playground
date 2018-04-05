var async = require('async');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var Book = require('../models/book');
var Author = require('../models/author');
var Genre = require('../models/genre');
var BookInstance = require('../models/bookinstance');


exports.index = function (req, res) {
  async.parallel({
    book_count: function (callback) {
      Book.count({}, callback);
    },
    book_instance_count: function (callback) {
      BookInstance.count({}, callback);
    },
    book_instance_available_count: function (callback) {
      BookInstance.count({ status: 'Available' }, callback);
    },
    author_count: function (callback) {
      Author.count({}, callback);
    },
    genre_count: function (callback) {
      Genre.count({}, callback);
    },
  }, function (err, results) {
    res.render('index', { title: 'Local Library Home', error: err, data: results });
  });
};

exports.book_list = function (req, res, next) {
  Book.find({}, 'title author')
    .populate('author')
    .exec(function (err, book_list) {
      if (err) { return next(err); }

      res.render('book_list', { title: 'Book List', book_list: book_list });
    });
};

exports.book_detail = function (req, res, next) {
  async.parallel({
    book: function (callback) {
      Book.findById(req.params.id)
        .populate('author')
        .populate('genre')
        .exec(callback);
    },
    book_instance: function (callback) {
      BookInstance.find({ 'book': req.params.id })
      .exec(callback);
    },
  },
  function (err, results) {
    if (err) { return next(err); }

    if (results.book==null) {
      var err = new Error('Book not found');
      err.status = 404;
      return next(err);
    }

    res.render('book_detail', { title: 'Title', book:  results.book, book_instances: results.book_instance });
  });
};

exports.book_create_get = function (req, res, next) {
  async.parallel({
    authors: function (callback) {
        Author.find(callback);
    },
    genres: function (callback) {
        Genre.find(callback);
    },
  }, function(err, results) {
    if (err) { return next(err); }
    res.render('book_form', { title: 'Create Book', authors: results.authors, genres: results.genres });
  });
};

exports.book_create_post = [
  // Convert the genre to an array.
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === 'undefined')
        req.body.genre = [];
      else
        req.body.genre = new Array(req.body.genre);
    }
    next();
  },

  body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
  body('author', 'Author must not be empty.').isLength({ min: 1 }).trim(),
  body('summary', 'Summary must not be empty.').isLength({ min: 1 }).trim(),
  body('isbn', 'ISBN must not be empty').isLength({ min: 1 }).trim(),

  sanitizeBody('*').trim().escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    var book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre
    });

    if (!errors.isEmpty()) {
      async.parallel({
        authors: function(callback) {
            Author.find(callback);
        },
        genres: function(callback) {
            Genre.find(callback);
        },
      }, function (err, results) {
        if (err) { return next(err); }

        // mark our selected genres as checked.
        for (let i = 0; i < results.genres.length; i++) {
          if (book.genre.indexOf(results.genres[i]._id) > -1) {
              results.genres[i].checked='true';
          }
        }
        res.render('book_form', { title: 'Create Book',authors:results.authors, genres:results.genres, book: book, errors: errors.array() });
      });
      return;
    } else {
      book.save(function (err) {
        if (err) { return next(err); }
        res.redirect(book.url);
      });
    }
  }
];

// Display book delete form on GET.
exports.book_delete_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle book delete on POST.
exports.book_delete_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display book update form on GET.
exports.book_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle book update on POST.
exports.book_update_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Book update POST');
};
