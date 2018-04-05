var async = require('async');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var Book = require('../models/book');
var Genre = require('../models/genre');


exports.genre_list = function (req, res, next) {
  Genre.find()
    .sort([['name', 'ascending']])
    .exec(function (err, genre_list) {
      if (err) { return next(err); }

      res.render('genre_list', { title: 'Genre List', genre_list: genre_list });
    });
};

exports.genre_detail = function (req, res, next) {
  async.parallel({
    genre: function (callback) {
      Genre.findById(req.params.id)
        .exec(callback);
    },
    genre_books: function (callback) {
      Book.find({ 'genre': req.params.id })
      .exec(callback);
    },
  },
  function (err, results) {
    if (err) { return next(err); }

    if (results.genre == null) {
      var err = new Error('Genre not found');
      err.status = 404;
      return next(err);
    }

    res.render('genre_detail', { title: 'Genre Detail', genre: results.genre, genre_books: results.genre_books });
  });
};

exports.genre_create_get = function (req, res, next) {
  res.render('genre_form', { title: 'Create Genre' });
};

exports.genre_create_post = [
    body('name', 'Genre name required').isLength({ min: 1 }).trim(),
    sanitizeBody('name').trim().escape(),
    (req, res, next) => {
      const errors = validationResult(req);

      var genre = new Genre(
        { name: req.body.name }
      );

      if (!errors.isEmpty()) {
        res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors.array()});
      } else {
        Genre.findOne({ 'name': req.body.name })
          .exec(function (err, found_genre) {
                if (err) { return next(err); }

                if (found_genre) {
                  res.redirect(found_genre.url);
                } else {
                  genre.save(function (err) {
                    if (err) { return next(err); }
                    res.redirect(genre.url);
                  });
                }
            });
      }
    }
];

exports.genre_delete_get = function (req, res, next) {
  async.parallel({
    genre: function (callback) {
      Genre.findById(req.params.id).exec(callback)
    },
    genre_books: function (callback) {
      Book.find({ 'genre': req.params.id }).exec(callback)
    },
  }, function (err, results) {
    if (err) { return next(err); }

    if (results.genre === null) {
      res.redirect('/catalog/genres');
    }

    res.render('genre_delete', { title: 'Delete Genre', genre: results.genre, genre_books: results.genre_books });
  });
};

exports.genre_delete_post = function (req, res) {
  async.parallel({
    genre: function (callback) {
      Genre.findById(req.body.genreid).exec(callback)
    },
    genre_books: function (callback) {
      Book.find({ 'genre': req.body.genreid }).exec(callback)
    },
  },
  function (err, results) {
    if (err) { return next(err); }

    if (results.genre_books.length > 0) {
      res.render('genre_delete', { title: 'Delete Genre', genre: results.genre, genre_books: results.genre_books });
      return;
    } else {
      Genre.findByIdAndRemove(req.body.genreid, function deleteGenre(err) {
        if (err) { return next(err); }

        res.redirect('/catalog/genres')
      });
    }
  });
};

// Display Genre update form on GET.
exports.genre_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Genre update GET');
};

// Handle Genre update on POST.
exports.genre_update_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Genre update POST');
};
