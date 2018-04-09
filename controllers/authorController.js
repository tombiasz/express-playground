const async = require('async');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

const Author = require('../models/author');
const Book = require('../models/book');


exports.author_list = (req, res, next) => {
  Author
    .find()
    .sort([['family_name', 'ascending']])
    .exec()
    .then((author_list) => {
      res.render('author_list', { title: 'Author List', author_list});
    })
    .catch(next);
};

exports.author_detail = (req, res, next) => {
  const { id } = req.params;

  Promise
    .all([
      Author.findById(id).exec(),
      Book.find({ author: id }, 'title summary').exec(),
    ])
    .then((results) => {
      const [author, author_books] = results;

      if (author === null) {
        const err = new Error('Author not found');
        err.status = 404;
        return next(err);
      }

      res.render('author_detail', { title: 'Author Detail', author, author_books });
    })
    .catch(next);
};

exports.author_create_get = (req, res) => {
  res.render('author_form', { title: 'Create Author' });
};

exports.author_create_post = [
  body('first_name')
    .isLength({ min: 1 })
    .trim()
    .withMessage('First name must be specified.')
    .isAlphanumeric()
    .withMessage('First name has non-alphanumeric characters.'),

  body('family_name')
    .isLength({ min: 1 })
    .trim().withMessage('Family name must be specified.')
    .isAlphanumeric()
    .withMessage('Family name has non-alphanumeric characters.'),

  body('date_of_birth', 'Invalid date of birth')
    .optional({ checkFalsy: true })
    .isISO8601(),

  body('date_of_death', 'Invalid date of death')
    .optional({ checkFalsy: true })
    .isISO8601(),

  sanitizeBody('first_name')
    .trim()
    .escape(),

  sanitizeBody('family_name')
    .trim()
    .escape(),

  sanitizeBody('date_of_birth')
    .toDate(),

  sanitizeBody('date_of_death')
    .toDate(),

  (req, res, next) => {
    const errors = validationResult(req);
    const {
      first_name,
      family_name,
      date_of_birth,
      date_of_death
    } = req.body;
    const author = new Author({
      first_name,
      family_name,
      date_of_birth,
      date_of_death,
    });

    if (!errors.isEmpty()) {
      res.render('author_form', { title: 'Create Author', author, errors: errors.array() });
    } else {
      author
        .save()
        .then(() => res.redirect(author.url))
        .catch(next);
    }
  },
];

exports.author_delete_get = (req, res, next) => {
  const { id } = req.params;

  Promise
    .all([
      Author.findById(id).exec(),
      Book.find({ author: id }).exec(),
    ])
    .then((results) => {
      const [author, author_books] = results;

      if (author === null) {
        res.redirect('/catalog/authors');
      }

      res.render('author_delete', { title: 'Delete Author', author, author_books });
    })
    .catch(next);
};

exports.author_delete_post = (req, res, next) => {
  const { id } = req.params;

  Promise
    .all([
      Author.findById(id).exec(),
      Book.find({ author: id }).exec(),
    ])
    .then((results) => {
      const [author, author_books] = results;

      if (author_books.length > 0) {
        res.render('author_delete', { title: 'Delete Author', author, author_books });
      } else {
        Author
          .findByIdAndRemove(id)
          .exec()
          .then(() => {
            res.redirect('/catalog/authors')
          })
          .catch(next);
      }
    })
    .catch(next);
};

exports.author_update_get = (req, res, next) => {
  const { id } = req.params;

  Author
    .findById(id)
    .exec()
    .then((author) => {
      if (author === null) {
        const err = new Error('Author not found');
        err.status = 404;
        return next(err);
      }

      res.render('author_form', { title: 'Update Author', author });
    })
    .catch(next);
};

exports.author_update_post = [
  body('first_name')
    .isLength({ min: 1 })
    .trim()
    .withMessage('First name must be specified.')
    .isAlphanumeric()
    .withMessage('First name has non-alphanumeric characters.'),

  body('family_name')
    .isLength({ min: 1 })
    .trim()
    .withMessage('Family name must be specified.')
    .isAlphanumeric()
    .withMessage('Family name has non-alphanumeric characters.'),

  body('date_of_birth', 'Invalid date of birth')
    .optional({ checkFalsy: true })
    .isISO8601(),

  body('date_of_death', 'Invalid date of death')
    .optional({ checkFalsy: true })
    .isISO8601(),

  sanitizeBody('first_name')
    .trim()
    .escape(),

  sanitizeBody('family_name')
    .trim()
    .escape(),

  sanitizeBody('date_of_birth')
    .toDate(),

  sanitizeBody('date_of_death')
    .toDate(),

  (req, res, next) => {
    const errors = validationResult(req);
    const { id } = req.params;
    const {
      first_name,
      family_name,
      date_of_birth,
      date_of_death
    } = req.body;
    const author = new Author({
      _id: id,
      first_name,
      family_name,
      date_of_birth,
      date_of_death,
    });

    if (!errors.isEmpty()) {
      res.render('author_form', { title: 'Update Author', author, errors: errors.array() });
    } else {
      Author
        .findByIdAndUpdate(id, author, {})
        .exec()
        .then(() => res.redirect(author.url))
        .catch(next);
    }
  },
];
