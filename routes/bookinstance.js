const express = require('express');

const {
  getBookInstanceById,

  renderBookInstanceDeleteForm,
  renderBookInstanceDetail,
  renderBookInstanceCreateForm,
  renderBookInstanceUpdateForm,

  processBookInstanceCreateForm,
  processBookInstanceDeleteForm,
  processBookInstanceUpdateForm,
} = require('../controllers/bookinstanceController');


const router = express.Router();

router.param('id', getBookInstanceById);

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
  .get(renderBookInstanceUpdateForm)
  .post(processBookInstanceUpdateForm);

module.exports = router;
