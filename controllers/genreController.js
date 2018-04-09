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
  body('name', 'Genre name required')
    .isLength({ min: 1 })
    .trim(),

  sanitizeBody('name')
    .trim()
    .escape(),

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
            .then(saved_genre => res.redirect(saved_genre.url))
            .catch(next);
        }
      })
      .catch(next);
  },
];

exports.genre_delete_get = (req, res, next) => {
  const { id } = req.params;

  Promise
    .all([
      Genre.findById(id).exec(),
      Book.find({ genre: id }).exec(),
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

exports.genre_delete_post = (req, res, next) => {
  const id = req.body.genreid;

  Promise
    .all([
      Genre.findById(id).exec(),
      Book.find({ genre: id }).exec(),
    ])
    .then((results) => {
      const [genre, genre_books] = results;

      if (genre_books.length > 0) {
        res.render('genre_delete', { title: 'Delete Genre', genre, genre_books });
      } else {
        Genre
          .findByIdAndRemove(id)
          .exec()
          .then(() => res.redirect('/catalog/genres'))
          .catch(next);
      }
    })
    .catch(next);
};

exports.genre_update_get = (req, res, next) => {
  Genre
    .findById(req.params.id)
    .exec()
    .then((genre) => {
      if (genre === null) {
        const err = new Error('Genre not found');
        err.status = 404;
        return next(err);
      }

      res.render('genre_form', { title: 'Update Genre', genre });
    })
    .catch(next);
};

exports.genre_update_post = [
  body('name', 'Genre name required')
    .isLength({ min: 1 })
    .trim(),

  sanitizeBody('name')
    .trim()
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    const { id, name } = req.params;
    const genre = new Genre({ _id: id, name });

    if (!errors.isEmpty()) {
      res.render('genre_form', { title: 'Create Genre', genre, errors: errors.array() });
    } else {
      Genre
        .findByIdAndUpdate(id, genre, {})
        .exec()
        .then(updated_genre => res.redirect(updated_genre.url))
        .catch(next);
    }
  },
];
