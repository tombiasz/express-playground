const express = require('express');

const bookController = require('../controllers/bookController');
const {
  getBookById,
  getBookBookInstances,

  renderBookCreateForm,
  renderBookDeleteForm,
  renderBookDetail,
  renderBookUpdateForm,

  processBookCreateForm,
  processBookDeleteForm,
  processBookUpdateForm,

  validateBookForm,
} = require('../controllers/bookController');


const router = express.Router();

router.get('/', bookController.renderIndex);

router.param('id', getBookById);

router
  .route('/create')
  .get(renderBookCreateForm)
  .post(validateBookForm, processBookCreateForm);

router.get('/:id', getBookBookInstances, renderBookDetail);

router
  .route('/:id/delete')
  .get(getBookBookInstances, renderBookDeleteForm)
  .post(getBookBookInstances, processBookDeleteForm);

router
  .route('/:id/update')
  .get(renderBookUpdateForm)
  .post(validateBookForm, processBookUpdateForm);

module.exports = router;
