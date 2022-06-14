const fs = require('fs');
const Media = require('../models/media');
const Actor = require('../models/actor');

// variables
const dataPath = './server/data/ServiceData.json';

// helper methods
const readFile = (callback, returnJson = false, filePath = dataPath, encoding = 'utf8') => {
    fs.readFile(filePath, encoding, (err, data) => {
            if (err) {
                console.log(err);
            }
            if (!data) data="{}";
            callback(returnJson ? JSON.parse(data) : data);
       });
};

const writeFile = (fileData, callback, filePath = dataPath, encoding = 'utf8') => {

        fs.writeFile(filePath, fileData, encoding, (err) => {
            if (err) {
                console.log(err);
            }

            callback();
        });
    }; 
      
module.exports = {
    //READ
    getMovies: function (req, res) {

        Media.find().populate('actors').then(medias => {
             res.send(medias)}
        ).catch (e=> res.status(500).send());

        /*fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;                 
        }
        else
        {
            const jsonData = (data == '') ? JSON.parse("{}") : JSON.parse(data);
            
            const clientData = Object.keys(jsonData).map(function (key) {
                return jsonData[key];
            }).sort(function (a, b) {
                return a.date < b.date;
            });

            res.send(clientData);
        }
            
    });*/
    },

    getMovie: function (req, res) {

        const movieId = req.params["movie_id"]; 
        Media.find({movieId : movieId}).populate('actors').then(media => {
            if (media == null) {
                return res.status(400).send(`movie id:${movieId}  not found`);
            }
            else {
                //console.log(media)
                res.send(media)
                return;
            }
        }).catch (e=> res.status(500).send());


        /*fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                console.log(err);
                res.sendStatus(500);  
                return;               
            }
            else
            {
                const jsonData = (data == '') ? JSON.parse("{}") : JSON.parse(data);

                // get the movie
                const movieId = req.params["movie_id"]; 
                if (jsonData[movieId])
                {
                    res.status(200).send(jsonData[movieId]);
                    return;
                }
                else  
                {
                    res.status(400).send(`movie id:${movieId}  not found`);
                    return;
                }
            }
                
        });*/
    },

    getActors: function (req, res) {

        Actor.find().then(actors => {
            res.send(actors)}
       ).catch (e=> res.status(500).send());
    },
  
    // CREATE
    CreateMovie: function (req, res) {
        const movieId = req.body.movieId;
        if (!movieId) return res.status(400).send('there is no id');
        //if(!data[movieId]){} // if the id is not allready exisxt 
        //else { return res.status(400).send('format not match'); }


        const movie = new Media(req.body);
        movie.save().then(mv => {
            //console.log("in then - save");
            res.status(200).send(mv)
        }).catch(e => {
            res.status(400).send(e)
        });


        /*readFile(data => {

            //const jsonData = (data == '') ? JSON.parse("{}") : JSON.parse(data);

            // add the new movie if not exist 
            const movieId = req.body.movieId;
            if (!movieId) return res.status(400).send('there is no id');
            if(!data[movieId])
            {
                const movie_details = {
                    "id?": req.body.movieId,
                    "name": req.body.name,
                    "picture" : req.body.picture,
                    "director": req.body.director,
                    "date": req.body.date,
                    "rating": req.body.rating,
                    "isSeries": req.body.isSeries,
                    "series_details":req.body.series_details, 
                    "actors": {}
                  };
                data[movieId] = movie_details;
            } 
            else
            {
                return res.status(400).send('format not match');
            }

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send('new movie added');
            });
        },
            true);*/
    },

    // CREATE
    CreateActor: function (req, res) {

        const actor = new Actor(req.body.actorDetails);
        actor.save().then(mv => {
            //console.log("in then - save");
            res.status(200).send(mv)
        }).catch(e => {
            res.status(400).send(e)
        });

    },

    // UPDATE
    updateMovie: function (req, res) {

        const updates = Object.keys(req.body.movieDetails)
        const allowedUpdates = ['name', 'picture', 'director', 'date', 'rating', 'isSeries', 'series_details']
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invalid updates!' })
        }

        Media.findByIdAndUpdate(req.body.movie_id, req.body.movieDetails, { new: true, runValidators: true }).then(movie => {
            if (!movie) {
                return res.status(404).send()
            }
            else {
                //console.log(movie)
                res.send(movie)
                return;
            }
        }).catch(e => res.status(400).send(e))

        /*
        readFile(data => {

            //const jsonData = (data == '') ? JSON.parse("{}") : JSON.parse(data);

            // get the movie
            const movieId = req.params.movie_id; 
            if (!data[movieId])
                return res.status(400).send(`movie id:${movieId}  not found`);

            const details = req.body.movieDetails;
            const db = data[movieId];
            const movie_details = {
                "id?": movieId,
                "name": (details.name) ? details.name : db.name,
                "picture" : (details.picture) ? details.picture : db.picture,
                "director": (details.director) ? details.director : db.director,
                "date": (details.date) ? details.date : db.date,
                "rating": (details.rating) ? details.rating : db.rating,
                "isSeries": (details.isSeries) ? details.isSeries : db.isSeries,
                "series_details":(details.series_details) ? details.series_details : db.series_details,
                "actors": data[movieId].actors
                };
            data[movieId] = movie_details;
                
            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`moives id:${movieId} updated`);
            });

        }, true);*/
    },

    // UPDATE
    AddActorToMovie: function (req, res) {

        // get the movie
        var mongoose = require('mongoose');
        const movieId = mongoose.Types.ObjectId(req.body.movie_id); 
        var actorId = mongoose.Types.ObjectId(req.body.actor_id);

        Actor.findOne({ _id: actorId }).select("_id").lean().then(result => {
            if (result) {
                var conditions = {_id: movieId}
                , update = {$addToSet: { actors: actorId }}
                , options = { multi: true };

                Media.updateOne(conditions, update, options, callback);

                function callback (err, numAffected) {
                    if(!err)
                    {
                        res.status(200).send(`actor:${actorId} in movies id:${movieId} updated`)
                        return;
                    }
                    else
                    {
                        res.sendStatus(400)
                        return;
                    }
                }
            }
            else
            {
                return res.status(400).send(`actor id:${actorId}  not found`);
            }
        });

        


        /*

        readFile(data => {

            //const jsonData = (data == '') ? JSON.parse("{}") : JSON.parse(data);

            // get the movie
            const movieId = req.params.movie_id; 
            if (!data[movieId])
                return res.status(400).send(`movie id:${movieId}  not found`);

            const details = req.body.actorDetails;
            const db = data[movieId];

            const found = false;
            let actor = db.actors[details.name];
            if (!actor)
            {
                db.actors[details.name] = {"name?": details.name,
                "picture": details.picture,
                "site": details.site};
            }
            else
            {
                return res.status(400).send(`movie id:${movieId}  not found`);
            }
            
            const movie_details = {
                "id?": movieId,
                "name": db.name,
                "picture" : db.picture,
                "director": db.director,
                "date": db.date,
                "rating": db.rating,
                "isSeries": db.isSeries,
                "series_details": db.series_details,
                "actors": data[movieId].actors
                };
            data[movieId] = movie_details;
                
            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`actor:${details.name} in moives id:${movieId} updated`);
            });

        }, true);*/
    },

    // DELETE
    deleteMovie: function (req, res) {

        //const movieId = req.params.movie_id; 
        Media.remove({ _id: req.params.movie_id }, function(err) {
            if (!err) {
                res.status(200).send(`movie id:${req.params.movie_id} removed`);
                return;
            }
            else {
                res.sendStatus(400);
                return;
            }
        });

        /*
        readFile(data => {

            // delete movie by movieId
            const movieId = req.params.movie_id; 
            if(data[movieId])
                delete data[movieId];
            else
            {
                res.sendStatus(400);
                return;

            }
                
            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`movie id:${movieId} removed`);
            });
        },
            true);*/
    },

    // DELETE
    deleteActorFromMovie: function (req, res) {

        Media.updateOne({ _id: req.body.movie_id }, { $pull: { actors: req.body.actor_id } }, function(err, campground){
            if(err){
                return res.sendStatus(400);
            }
            res.status(200).send(`actor: ${req.body.actor_id} in movie id: ${req.body.movie_id} removed`);
            return;
        });


        /*
        readFile(data => {

            const movieId = req.params.movie_id; 
            if (!data[movieId])
            {
                res.status(400).send(`movie id:${movieId}  not found`);
                return;
            }
                

            const actorName = req.body.actorName;
            const db = data[movieId];

            let actor = db.actors[actorName];
            if (!actor){
                res.status(400).send(`actor: ${actorName}  not found`);
                return;
            }
            else
                delete data[movieId].actors[actorName];        
            
            const movie_details = {
                "id?": movieId,
                "name": db.name,
                "picture" : db.picture,
                "director": db.director,
                "date": db.date,
                "rating": db.rating,
                "isSeries": db.isSeries,
                "series_details": db.series_details,
                "actors": data[movieId].actors
                };
            data[movieId] = movie_details;

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`actor: ${actorName} in movie id: ${movieId} removed`);
            });
        },
            true);*/
    }



};