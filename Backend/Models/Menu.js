
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MenuSchema = new Schema(
    {
        restaurantId: {
            type: String,
            required: true,
        },
        itemPrice: {
            type: Number,
            required: true,
        },
        itemName: {
            type: String,
            required: true,
        },
        itemDescription: {
            type: String,
            required: true,
        },
        isVeg: {
            type: Boolean,
            required: true,
        }
    }
);

module.exports = mongoose.model('Menu', MenuSchema, 'menu');

