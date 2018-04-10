const express = require('express');

const {
  getAuthorBooks,
  getAuthorById,

  processAuthorCreateForm,
  processAuthorUpdateForm,
  processAuthorDeleteForm,

  renderAuthorCreateForm,
  renderAuthorDeleteForm,
  renderAuthorDetail,
  renderAuthorUpdateForm,

  validateAuthorForm,
} = require('../controllers/authorController');


const router = express.Router();

router.param('id', getAuthorById);

router
  .route('/create')
  .get(renderAuthorCreateForm)
  .post(validateAuthorForm, processAuthorCreateForm);

router.get('/:id', getAuthorBooks, renderAuthorDetail);

router
  .route('/:id/delete')
  .all(getAuthorBooks)
  .get(renderAuthorDeleteForm)
  .post(processAuthorDeleteForm);

router
  .route('/:id/update')
  .get(renderAuthorUpdateForm)
  .post(validateAuthorForm, processAuthorUpdateForm);

module.exports = router;
