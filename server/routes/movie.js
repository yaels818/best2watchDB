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
            if (!movieId) return res.sendStatus(400);  
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
                return res.sendStatus(400);  
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

            // update the movie
            const movieId = req.params["id"]; // id? 
            if (data[movieId])
                data[movieId] = req.body;
                // what to do with the actors? 

            else res.sendStatus(400);

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`moives id:${movieId} updated`);
            });
        },
            true);
    },

    // UPDATE
    AddActorToMovie: function (req, res) {

        readFile(data => {

            // add the new movie
            const movieId = req.params["id"]; // id? 
            if (data[movieId])
            {
                const actorsArray = data[movieId].actors; 
                const actorName = req.params["name"]; // name? 
                if (!actorsArray[actorName])
                    res.sendStatus(400);
                else
                    actorsArray[actorName].push(req.body);
                
            }
            else res.sendStatus(400);

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`moives id:${movieId} updated with actor: ${actorName}`);
            });
        },
            true);
    },

    // DELETE
    deleteMovie: function (req, res) {

        readFile(data => {

            // delete movie by movieId
            const movieId = req.params["id"];
            if(data[movieId])
                delete data[movieId];
            else
                res.sendStatus(400);

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`movie id:${movieId} removed`);
            });
        },
            true);
    },

    // DELETE
    deleteActorFromMovie: function (req, res) {

        readFile(data => {
            //TODO 

            // delete movie by movieId
            const movieId = req.params["id"];
            if(data[movieId])
                delete data[movieId];
            else
                res.sendStatus(400);

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`movie id:${movieId} removed`);
            });
        },
            true);
    }



};