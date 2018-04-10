const express = require('express');

const bookController = require('../controllers/bookController');
const {
  getBookById,
} = require('../controllers/bookController');


const router = express.Router();

router.get('/', bookController.renderIndex);

router.param('id', getBookById);

router
  .route('/create')
  .get(bookController.book_create_get)
  .post(bookController.book_create_post);

router.get('/:id', bookController.book_detail);

router
  .route('/:id/delete')
  .get(bookController.book_delete_get)
  .post(bookController.book_delete_post);

router
  .route('/:id/update')
  .get(bookController.book_update_get)
  .post(bookController.book_update_post);

module.exports = router;
