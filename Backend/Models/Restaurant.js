const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RestaurantSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        location_id: {
            type: Number,
            required: true
        },
        city_id: {
            type: Number,
            required: true
        },
        locality: {
            type: String,
            required: true
        },
        thumb: {
            type: Array,
            required: true
        },
        aggregate_rating: {
            type: Number,
            required: true
        },
        rating_text: {
            type: String,
            required: true
        },
        min_price: {
            type: Number,
            required: true
        },
        contact_number: {
            type: Number,
            required: true
        },
        cuisine: {
            type: Array,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        mealtype_id: {
            type: Number,
            required: true
        }
    }
);


module.exports = mongoose.model('Restaurant', RestaurantSchema, 'Restaurant');