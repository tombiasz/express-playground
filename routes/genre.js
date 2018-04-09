const express = require('express');

const genreController = require('../controllers/genreController');


const router = express.Router();

router.get('/create', genreController.genre_create_get);
router.post('/create', genreController.genre_create_post);
router.get('/:id/delete', genreController.genre_delete_get);
router.post('/:id/delete', genreController.genre_delete_post);
router.get('/:id/update', genreController.genre_update_get);
router.post('/:id/update', genreController.genre_update_post);
router.get('/:id', genreController.genre_detail);

module.exports = router;
