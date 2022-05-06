const express = require('express'),
    movieRoutes = require('./movie');

var router = express.Router();


router.get('/list', movieRoutes.getMovies);
router.get('/list/:movie_id', movieRoutes.getMovie);
router.post('/movie', movieRoutes.CreateMovie);
router.put('/movie/:id', movieRoutes.updateMovie);
router.put('/actor/:id', movieRoutes.AddActorToMovie);
router.delete('/movie/:id', movieRoutes.deleteMovie);
router.delete('/actor/:id', movieRoutes.deleteActorFromMovie);

module.exports = router;


/**
 * const express = require('express'),
    userRoutes = require('./users');

var router = express.Router();


router.get('/users', userRoutes.read_users);
router.post('/users', userRoutes.create_user);
router.put('/users/:id', userRoutes.update_user);
router.delete('/users/:id', userRoutes.delete_user);

module.exports = router;
 * 
 * 
 * 
 * 
 * 
 */