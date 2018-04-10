const express = require('express');

const {
  getAuthorBooks,
  getAuthorById,
  renderAuthorCreateGet,
  renderAuthorCreatePost,
  renderAuthorDeleteGet,
  renderAuthorDeletePost,
  renderAuthorDetail,
  renderAuthorUpdateGet,
  renderAuthorUpdatePost,
} = require('../controllers/authorController');


const router = express.Router();

router.param('id', getAuthorById);

router
  .route('/create')
  .get(renderAuthorCreateGet)
  .post(renderAuthorCreatePost);

router.get('/:id', getAuthorBooks, renderAuthorDetail);

router
  .route('/:id/delete')
  .get(getAuthorBooks, renderAuthorDeleteGet)
  .post(getAuthorBooks, renderAuthorDeletePost);

router
  .route('/:id/update')
  .get(renderAuthorUpdateGet)
  .post(renderAuthorUpdatePost);

module.exports = router;
