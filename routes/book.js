const express = require('express');

const bookController = require('../controllers/bookController');
const {
  getBookById,

  renderBookCreateForm,
  renderBookDeleteForm,
  renderBookDetail,

  processBookCreateForm,

  validateBookForm,
} = require('../controllers/bookController');


const router = express.Router();

router.get('/', bookController.renderIndex);

router.param('id', getBookById);

router
  .route('/create')
  .get(renderBookCreateForm)
  .post(validateBookForm, processBookCreateForm);

router.get('/:id', renderBookDetail);

router
  .route('/:id/delete')
  .get(renderBookDeleteForm)
  .post(bookController.book_delete_post);

router
  .route('/:id/update')
  .get(bookController.book_update_get)
  .post(bookController.book_update_post);

module.exports = router;
