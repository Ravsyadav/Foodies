
// import the mongoose package
const mongoose = require('mongoose');

// create a Schema
const Schema = mongoose.Schema;

const LocationSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        city_id: {
            type: Number,
            required: true,
        },
        location_id: {
            type: Number,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        country_name: {
            type: String,
            required: true,
        }
    }
);

// export the model
module.exports = mongoose.model('Location', LocationSchema, 'location');

