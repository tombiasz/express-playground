
const express = require('express');

const {
  createAuthorOrRedirect,
  getAuthorBooks,
  getAuthorById,
  renderAuthorCreateGet,
  renderAuthorDeleteGet,
  renderAuthorDeletePost,
  renderAuthorDetail,
  renderAuthorUpdateGet,
  updateAuthorOrRedirect,
  validateAuthorForm,
} = require('../controllers/authorController');


const router = express.Router();

router.param('id', getAuthorById);

router
  .route('/create')
  .get(renderAuthorCreateGet)
  .post(validateAuthorForm, createAuthorOrRedirect);

router.get('/:id', getAuthorBooks, renderAuthorDetail);

router
  .route('/:id/delete')
  .all(getAuthorBooks)
  .get(renderAuthorDeleteGet)
  .post(renderAuthorDeletePost);

router
  .route('/:id/update')
  .get(renderAuthorUpdateGet)
  .post(validateAuthorForm, updateAuthorOrRedirect);

module.exports = router;
