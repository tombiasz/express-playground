const express = require('express');

const {
  getBookById,
  getBookBookInstances,

  renderBookCreateForm,
  renderBookDeleteForm,
  renderBookDetail,
  renderBookUpdateForm,
  renderBookIndex,

  processBookCreateForm,
  processBookDeleteForm,
  processBookUpdateForm,

  validateBookForm,
} = require('../controllers/bookController');


const router = express.Router();

router.get('/', renderBookIndex);

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
