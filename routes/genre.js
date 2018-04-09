const express = require('express');

const genreController = require('../controllers/genreController');


const router = express.Router();

router
  .route('/create')
  .get(genreController.genre_create_get)
  .post(genreController.genre_create_post);

router.get('/:id', genreController.genre_detail);

router
  .route('/:id/delete')
  .get(genreController.genre_delete_get)
  .post(genreController.genre_delete_post);

router
  .route('/:id/update')
  .get(genreController.genre_update_get)
  .post(genreController.genre_update_post);

module.exports = router;
