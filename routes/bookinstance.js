const express = require('express');

const { getAllBooks } = require('../controllers/bookController');
const {
  getBookInstanceById,

  renderBookInstanceDeleteForm,
  renderBookInstanceDetail,
  renderBookInstanceCreateForm,
  renderBookInstanceUpdateForm,

  processBookInstanceCreateForm,
  processBookInstanceDeleteForm,
  processBookInstanceUpdateForm,

  validateBookInstanceForm,
} = require('../controllers/bookinstanceController');


const router = express.Router();

router.param('id', getBookInstanceById);

router
  .route('/create')
  .all(getAllBooks)
  .get(renderBookInstanceCreateForm)
  .post(validateBookInstanceForm, processBookInstanceCreateForm);

router.get('/:id', renderBookInstanceDetail);

router
  .route('/:id/delete')
  .get(renderBookInstanceDeleteForm)
  .post(processBookInstanceDeleteForm);

router
  .route('/:id/update')
  .all(getAllBooks)
  .get(renderBookInstanceUpdateForm)
  .post(validateBookInstanceForm, processBookInstanceUpdateForm);

module.exports = router;
