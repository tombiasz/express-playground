const { body, validationResult } = require('express-validator/check');
const createError = require('http-errors');
const { sanitizeBody } = require('express-validator/filter');

const Author = require('../models/author');
const Book = require('../models/book');


exports.getAuthorById = (req, res, next) => {
  const { id } = req.params;
  console.log('wello,', id );
  Author
    .findById(id)
    .exec()
    .then((author) => {
      if (!author) {
        next(createError(404, 'Author not found'));
      } else {
        res.author = author;
        next();
      }
    })
    .catch(next);
};

exports.getAllAuthors = (req, res, next) => {
  Author
    .find()
    .sort([['family_name', 'ascending']])
    .exec()
    .then((authorList) => {
      res.authorList = authorList;
      next();
    })
    .catch(next);
};

exports.getAuthorBooks = (req, res, next) => {
  const { author } = res;
  Book
    .find({ author: author.id }, 'title summary')
    .exec()
    .then((authorBooks) => {
      res.authorBooks = authorBooks;
      next();
    })
    .catch(next);
};

exports.renderAuthorList = (req, res) => {
  const { authorList } = res;
  res.render('author_list', {
    title: 'Author List',
    author_list: authorList,
  });
};

exports.renderAuthorDetail = (req, res) => {
  const { author, authorBooks } = res;
  res.render('author_detail', {
    title: 'Author Detail',
    author,
    author_books: authorBooks,
  });
};

exports.renderAuthorCreateGet = (req, res) => {
  res.render('author_form', { title: 'Create Author' });
};

exports.validateAuthorForm = [
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
];

exports.updateAuthorOrRedirect = (req, res, next) => {
  const { author } = res;
  const errors = validationResult(req);

  const {
    first_name,
    family_name,
    date_of_birth,
    date_of_death,
  } = req.body;
  const updatedAuthor = new Author({
    _id: author.id,
    first_name,
    family_name,
    date_of_birth,
    date_of_death,
  });

  if (!errors.isEmpty()) {
    res.render('author_form', {
      title: 'Create Author',
      author: updatedAuthor,
      errors: errors.array(),
    });
  } else {
    Author
      .findByIdAndUpdate(updatedAuthor.id, updatedAuthor, {})
      .exec()
      .then(() => res.redirect(updatedAuthor.url))
      .catch(next);
  }
};

exports.createAuthorOrRedirect = (req, res, next) => {
  const errors = validationResult(req);
  const {
    first_name,
    family_name,
    date_of_birth,
    date_of_death,
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
};

exports.renderAuthorDeleteGet = (req, res) => {
  const { author, authorBooks } = res;
  res.render('author_delete', {
    title: 'Delete Author',
    author,
    author_books: authorBooks,
  });
};

exports.renderAuthorDeletePost = (req, res, next) => {
  const { author, authorBooks } = res;

  if (authorBooks.length > 0) {
    res.render('author_delete', {
      title: 'Delete Author',
      author,
      author_books: authorBooks,
    });
  } else {
    Author
      .findByIdAndRemove(author.id)
      .exec()
      .then(() => {
        res.redirect('/catalog/authors');
      })
      .catch(next);
  }
};

exports.renderAuthorUpdateGet = (req, res) => {
  const { author } = res;
  res.render('author_form', { title: 'Update Author', author });
};
