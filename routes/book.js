const express = require('express');

const bookController = require('../controllers/bookController');


const router = express.Router();

router.get('/', bookController.index);
router.get('/create', bookController.book_create_get);
router.post('/create', bookController.book_create_post);
router.get('/:id/delete', bookController.book_delete_get);
router.post('/:id/delete', bookController.book_delete_post);
router.get('/:id/update', bookController.book_update_get);
router.post('/:id/update', bookController.book_update_post);
router.get('/:id', bookController.book_detail);

module.exports = router;
