const express = require('express');

const {
  getAllAuthors,
  renderAuthorList,
} = require('../controllers/authorController');
const authorRouter = require('./author');
const bookController = require('../controllers/bookController');
const bookRouter = require('./book');
const bookinstanceController = require('../controllers/bookinstanceController');
const bookinstanceRouter = require('./bookinstance');
const genreController = require('../controllers/genreController');
const genreRouter = require('./genre');


const router = express.Router();

router.get('/', bookController.renderBookIndex);
router.use('/book', bookRouter);
router.get('/books', bookController.renderBookList);

router.use('/author', authorRouter);
router.get('/authors', getAllAuthors, renderAuthorList);
router.use('/genre', genreRouter);
router.get('/genres', genreController.genre_list);

router.use('/bookinstance', bookinstanceRouter);
router.get('/bookinstances', bookinstanceController.renderBookInstanceList);

module.exports = router;
