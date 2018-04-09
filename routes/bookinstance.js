const express = require('express');

const bookinstanceController = require('../controllers/bookinstanceController');


const router = express.Router();

router
  .route('/create')
  .get(bookinstanceController.bookinstance_create_get)
  .post(bookinstanceController.bookinstance_create_post);

router.get('/:id', bookinstanceController.bookinstance_detail);

router
  .route('/:id/delete')
  .get(bookinstanceController.bookinstance_delete_get)
  .post(bookinstanceController.bookinstance_delete_post);

router
  .route('/:id/update')
  .get(bookinstanceController.bookinstance_update_get)
  .post(bookinstanceController.bookinstance_update_post);

module.exports = router;
