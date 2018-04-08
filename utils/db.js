const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
const BookInstance = require('../models/bookinstance');


exports.dropAllCollections = () => {
  const tasks = [
    Author.remove().exec(),
    Book.remove().exec(),
    BookInstance.remove().exec(),
    Genre.remove().exec(),
  ];
  return Promise.all(tasks);
};
