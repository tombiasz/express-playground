const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

const Book = require('../models/book');
const BookInstance = require('../models/bookinstance');


exports.renderBookInstanceList = (req, res, next) => {
  BookInstance.find()
    .populate('book')
    .exec()
    .then((bookinstanceList) => {
      res.render('bookinstance_list', {
        title: 'Book Instance List',
        bookinstance_list: bookinstanceList,
      });
    })
    .catch(next);
};

exports.renderBookInstanceDetail = (req, res, next) => {
  const { id } = req.params;
  BookInstance
    .findById(id)
    .populate('book')
    .exec()
    .then((bookinstance) => {
      if (bookinstance === null) {
        const err = new Error('Book copy not found');
        err.status = 404;
        return next(err);
      }

      res.render('bookinstance_detail', { title: 'Book:', bookinstance });
    })
    .catch(next);
};

exports.renderBookInstanceCreateForm = (req, res, next) => {
  Book
    .find({}, 'title')
    .exec()
    .then((book_list) => {
      res.render('bookinstance_form', {
        title: 'Create BookInstance',
        book_list,
      });
    })
    .catch(next);
};

exports.processBookInstanceCreateForm = [
  body('book', 'Book must be specified')
    .isLength({ min: 1 })
    .trim(),

  body('imprint', 'Imprint must be specified')
    .isLength({ min: 1 })
    .trim(),

  body('due_back', 'Invalid date')
    .optional({ checkFalsy: true })
    .isISO8601(),

  sanitizeBody('book')
    .trim()
    .escape(),

  sanitizeBody('imprint')
    .trim()
    .escape(),

  sanitizeBody('status')
    .trim()
    .escape(),

  sanitizeBody('due_back')
    .toDate(),

  (req, res, next) => {
    const errors = validationResult(req);
    const {
      book,
      imprint,
      status,
      due_back,
    } = req.body;
    const bookinstance = new BookInstance({
      book,
      imprint,
      status,
      due_back,
    });

    if (!errors.isEmpty()) {
      Book
        .find({}, 'title')
        .exec()
        .then((book_list) => {
          res.render('bookinstance_form', {
            title: 'Create BookInstance',
            book_list,
            bookinstance,
            errors: errors.array(),
          });
        })
        .catch(next);
    } else {
      bookinstance
        .save()
        .then(() => res.redirect(bookinstance.url))
        .catch(next);
    }
  },
];

exports.bookinstance_delete_get = (req, res, next) => {
  const { id } = req.params;

  BookInstance
    .findById(id)
    .exec()
    .then((bookinstance) => {
      res.render('bookinstance_delete', {
        title: 'Delete BookInstance',
        bookinstance,
      });
    })
    .catch(next);
};

exports.bookinstance_delete_post = (req, res, next) => {
  const { id } = req.params;

  BookInstance
    .findByIdAndRemove(id)
    .exec()
    .then(() => res.redirect('/catalog/bookinstances'))
    .catch(next);
};

exports.bookinstance_update_get = (req, res, next) => {
  const { id } = req.params;

  Promise
    .all([
      BookInstance.findById(id).exec(),
      Book.find().exec(),
    ])
    .then((results) => {
      const [bookinstance, book_list] = results;

      if (bookinstance === null) {
        const err = new Error('BookInstance not found');
        err.status = 404;
        return next(err);
      }

      res.render('bookinstance_form', {
        title: 'Update BookInstance',
        bookinstance,
        book_list,
      });
    })
    .catch(next);
};

exports.bookinstance_update_post = [
  body('book', 'Book must be specified')
    .isLength({ min: 1 })
    .trim(),

  body('imprint', 'Imprint must be specified')
    .isLength({ min: 1 })
    .trim(),

  body('due_back', 'Invalid date')
    .optional({ checkFalsy: true })
    .isISO8601(),

  sanitizeBody('book')
    .trim()
    .escape(),

  sanitizeBody('imprint')
    .trim()
    .escape(),

  sanitizeBody('status')
    .trim()
    .escape(),

  sanitizeBody('due_back')
    .toDate(),

  (req, res, next) => {
    const errors = validationResult(req);
    const { id } = req.params;
    const {
      book,
      imprint,
      status,
      due_back,
    } = req.body;
    const bookinstance = new BookInstance({
      _id: id,
      book,
      imprint,
      status,
      due_back,
    });

    if (!errors.isEmpty()) {
      Book
        .find({}, 'title')
        .exec()
        .then((book_list) => {
          res.render('bookinstance_form', {
            title: 'Update BookInstance',
            book_list,
            bookinstance,
            errors: errors.array(),
          });
        })
        .catch(next);
    } else {
      BookInstance
        .findByIdAndUpdate(id, bookinstance)
        .exec()
        .then(() => res.redirect(bookinstance.url))
        .catch(next);
    }
  },
];
