const mongoose = require('mongoose')
const validator = require('validator')

var ActorSchema = new mongoose.Schema({
   
    name: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: true
    },
    site: {
        type: String,
        required: true
    }
}, { timestamps: true }
);

const Actor = mongoose.model('Actor', ActorSchema);

module.exports = Actor