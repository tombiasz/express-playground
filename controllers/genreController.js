var async = require('async');

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

// Display Genre create form on GET.
exports.genre_create_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Genre create GET');
};

// Handle Genre create on POST.
exports.genre_create_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Genre create POST');
};

// Display Genre delete form on GET.
exports.genre_delete_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Genre delete GET');
};

// Handle Genre delete on POST.
exports.genre_delete_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Genre delete POST');
};

// Display Genre update form on GET.
exports.genre_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Genre update GET');
};

// Handle Genre update on POST.
exports.genre_update_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Genre update POST');
};