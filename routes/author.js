const express = require('express');

const authorController = require('../controllers/authorController');


const router = express.Router();

router.param('id', authorController.getAuthorById);

router
  .route('/create')
  .get(authorController.renderAuthorCreateGet)
  .post(authorController.renderAuthorCreatePost);

router.get('/:id', authorController.getAuthorBooks, authorController.renderAuthorDetail);

router
  .route('/:id/delete')
  .get(authorController.getAuthorBooks, authorController.renderAuthorDeleteGet)
  .post(authorController.getAuthorBooks, authorController.renderAuthorDeletePost);

router
  .route('/:id/update')
  .get(authorController.renderAuthorUpdateGet)
  .post(authorController.renderAuthorUpdatePost);

module.exports = router;
