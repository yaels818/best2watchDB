const mongoose = require('mongoose');
const id_validator = require ('mongoose-id-validator');

var MediaSchema = new mongoose.Schema({
 
    movieId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: true
    },
    director: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: [1, 'Rating must be between 1 and 5'],
        max: [5, 'Rating must be between 1 and 5']
    },
    isSeries: {
        type: Boolean,
        required: true,
        default: false
    },
    series_details: {
        type: Array,
        default: []
    },
    actors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Actor'}],
}, { timestamps: true });
MediaSchema.plugin(id_validator);


const Media = mongoose.model('Media', MediaSchema);

module.exports = Media