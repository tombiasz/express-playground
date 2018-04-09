const async = require('async');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

const Book = require('../models/book');
const Genre = require('../models/genre');


exports.genre_list = (req, res, next) =>
  Genre
    .find()
    .sort([['name', 'ascending']])
    .exec()
    .then((genre_list) => {
      res.render('genre_list', { title: 'Genre List', genre_list });
    })
    .catch(next);

exports.genre_detail = (req, res, next) => {
  Promise
    .all([
      Genre.findById(req.params.id).exec(),
      Book.find({ genre: req.params.id }).exec(),
    ])
    .then((results) => {
      const [genre, genre_books] = results;

      if (genre === null) {
        const error = new Error('Genre not found');
        error.status = 404;
        return next(error);
      }

      res.render('genre_detail', { title: 'Genre Detail', genre, genre_books });
    }).catch(next);
};

exports.genre_create_get = (req, res) =>
  res.render('genre_form', { title: 'Create Genre' });

exports.genre_create_post = [
  body('name', 'Genre name required').isLength({ min: 1 }).trim(),
  sanitizeBody('name').trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const { name } = req.body;
    const genre = new Genre({ name });

    if (!errors.isEmpty()) {
      res.render('genre_form', { title: 'Create Genre', genre, errors: errors.array() });
    }

    Genre
      .findOne({ name })
      .exec()
      .then((found_genre) => {
        if (found_genre) {
          res.redirect(found_genre.url);
        } else {
          genre
            .save()
            .then(genre => res.redirect(genre.url))
            .catch(next);
        }
      })
      .catch(next);
  },
];

exports.genre_delete_get = (req, res, next) => {
  Promise
    .all([
      Genre.findById(req.params.id).exec(),
      Book.find({ genre: req.params.id }).exec(),
    ])
    .then((results) => {
      const [genre, genre_books] = results;

      if (genre === null) {
        res.redirect('/catalog/genres');
      } else {
        res.render('genre_delete', { title: 'Delete Genre', genre, genre_books });
      }
    })
    .catch(next);
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

exports.genre_update_get = function (req, res, next) {
  Genre.findById(req.params.id).exec(function (err, genre) {
    if (err) { return next(err); }

    if (genre === null) {
      var err = new Error('Genre not found');
      err.status = 404;
      return next(err);
    }

    res.render('genre_form', { title: 'Update Genre', genre: genre });
  });
};

exports.genre_update_post = [
  body('name', 'Genre name required').isLength({ min: 1 }).trim(),

  sanitizeBody('name').trim().escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors.array()});
    } else {
      var genre = new Genre({
        _id: req.params.id,
        name: req.body.name
      });

      Genre.findByIdAndUpdate(req.params.id, genre, {}, function (err, genre) {
        if (err) { return next(err); }

        res.redirect(genre.url);
      });
    }
  }
];
