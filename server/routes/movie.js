const fs = require('fs');

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

    function comp(a, b) {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      
      
module.exports = {
    //READ
    getMovies: function (req, res) {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                console.log(err);
                res.sendStatus(500);                 
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
                // need to check if the sort word-> date + desc 
            }
                
        });
    },

    getMovie: function (req, res) {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                console.log(err);
                res.sendStatus(500);                 
            }
            else
            {
                const jsonData = (data == '') ? JSON.parse("{}") : JSON.parse(data);

                // get the movie
                const movieId = req.params["movie_id"]; 
                if (jsonData[movieId])
                {
                    res.status(200).send(jsonData[movieId]);
                }
                else  res.status(400).send(`movie id:${movieId}  not found`);
            }
                
        });
    },
  
    // CREATE
    CreateMovie: function (req, res) {

        readFile(data => {

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
            true);
    },

    // UPDATE
    updateMovie: function (req, res) {

        readFile(data => {

            //const jsonData = (data == '') ? JSON.parse("{}") : JSON.parse(data);

            // get the movie
            const movieId = req.params.movie_id; 
            if (!data[movieId])
                res.status(400).send(`movie id:${movieId}  not found`);

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

        }, true);
    },

    // UPDATE
    AddActorToMovie: function (req, res) {

        readFile(data => {

            //const jsonData = (data == '') ? JSON.parse("{}") : JSON.parse(data);

            // get the movie
            const movieId = req.params.movie_id; 
            if (!data[movieId])
                res.status(400).send(`movie id:${movieId}  not found`);

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
                res.status(400).send(`movie id:${movieId}  not found`);
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

        }, true);
    },

    // DELETE
    deleteMovie: function (req, res) {

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
            true);
    },

    // DELETE
    deleteActorFromMovie: function (req, res) {

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
            true);
    }



};