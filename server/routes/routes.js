const express = require('express'),
movieRoutes = require('./movie')


var router = express.Router();


router.get('/GetList', movieRoutes.getMovies);
router.get('/getActors', movieRoutes.getActors);
router.get('/list/:movie_id', movieRoutes.getMovie);
router.post('/movie', movieRoutes.CreateMovie);
router.post('/actor', movieRoutes.CreateActor);
router.put('/movie/:movie_id', movieRoutes.updateMovie);
router.put('/actor/:movie_id', movieRoutes.AddActorToMovie);
router.delete('/movie/:movie_id', movieRoutes.deleteMovie);
router.delete('/actor/:movie_id', movieRoutes.deleteActorFromMovie);

module.exports = router;