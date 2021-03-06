const { body, validationResult } = require('express-validator/check');
const createError = require('http-errors');
const { sanitizeBody } = require('express-validator/filter');

const BookInstance = require('../models/bookinstance');


exports.getBookInstanceById = (req, res, next) => {
  const { id } = req.params;

  BookInstance
    .findById(id)
    .populate('book')
    .exec()
    .then((bookinstance) => {
      if (!bookinstance) {
        next(createError(404, 'BookInstance not found'));
      } else {
        res.bookinstance = bookinstance;
        next();
      }
    })
    .catch(next);
};

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

exports.renderBookInstanceDetail = (req, res) => {
  const { bookinstance } = res;

  res.render('bookinstance_detail', {
    title: 'Book:',
    bookinstance,
  });
};

exports.renderBookInstanceCreateForm = (req, res) => {
  const { bookList } = res;

  res.render('bookinstance_form', {
    title: 'Create BookInstance',
    book_list: bookList,
  });
};

exports.validateBookInstanceForm = [
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
];

exports.processBookInstanceCreateForm = (req, res, next) => {
  const { bookList } = res;
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
    res.render('bookinstance_form', {
      title: 'Create BookInstance',
      book_list: bookList,
      bookinstance,
      errors: errors.array(),
    });
  } else {
    bookinstance
      .save()
      .then(() => res.redirect(bookinstance.url))
      .catch(next);
  }
};

exports.renderBookInstanceDeleteForm = (req, res) => {
  const { bookinstance } = res;

  res.render('bookinstance_delete', {
    title: 'Delete BookInstance',
    bookinstance,
  });
};

exports.processBookInstanceDeleteForm = (req, res, next) => {
  const { bookinstance } = res;

  BookInstance
    .findByIdAndRemove(bookinstance.id)
    .exec()
    .then(() => res.redirect('/catalog/bookinstances'))
    .catch(next);
};

exports.renderBookInstanceUpdateForm = (req, res) => {
  const { bookinstance, bookList } = res;

  res.render('bookinstance_form', {
    title: 'Update BookInstance',
    bookinstance,
    book_list: bookList,
  });
};

exports.processBookInstanceUpdateForm = (req, res, next) => {
  const errors = validationResult(req);
  const { bookinstance, bookList } = res;
  const {
    book,
    imprint,
    status,
    due_back,
  } = req.body;
  const updatedBookinstance = new BookInstance({
    _id: bookinstance.id,
    book,
    imprint,
    status,
    due_back,
  });

  if (!errors.isEmpty()) {
    res.render('bookinstance_form', {
      title: 'Update BookInstance',
      book_list: bookList,
      bookinstance: updatedBookinstance,
      errors: errors.array(),
    });
  } else {
    BookInstance
      .findByIdAndUpdate(bookinstance.id, updatedBookinstance)
      .exec()
      .then(() => res.redirect(updatedBookinstance.url))
      .catch(next);
  }
};
