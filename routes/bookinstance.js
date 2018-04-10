const express = require('express');

const bookinstanceController = require('../controllers/bookinstanceController');
const {
  renderBookInstanceDeleteForm,
  renderBookInstanceDetail,
  renderBookInstanceCreateForm,

  processBookInstanceCreateForm,
  processBookInstanceDeleteForm,
} = require('../controllers/bookinstanceController');


const router = express.Router();

router
  .route('/create')
  .get(renderBookInstanceCreateForm)
  .post(processBookInstanceCreateForm);

router.get('/:id', renderBookInstanceDetail);

router
  .route('/:id/delete')
  .get(renderBookInstanceDeleteForm)
  .post(processBookInstanceDeleteForm);

router
  .route('/:id/update')
  .get(bookinstanceController.bookinstance_update_get)
  .post(bookinstanceController.bookinstance_update_post);

module.exports = router;
