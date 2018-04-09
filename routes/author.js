const express = require('express');

const authorController = require('../controllers/authorController');


const router = express.Router();

router.param('id', authorController.getAuthorById);

router
  .route('/create')
  .get(authorController.author_create_get)
  .post(authorController.author_create_post);

router.get('/:id', authorController.author_detail);

router
  .route('/:id/delete')
  .get(authorController.author_delete_get)
  .post(authorController.author_delete_post);

router
  .route('/:id/update')
  .get(authorController.author_update_get)
  .post(authorController.author_update_post);

module.exports = router;