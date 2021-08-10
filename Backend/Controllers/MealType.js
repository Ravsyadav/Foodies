
const MealType = require('../Models/MealType');

exports.getMealTypes = (req, res) => {
    MealType.find().then(result => {
        res.status(200).json({
            message: "MealTypes fetched",
            mealtypes: result
        });
    }).catch(error => {
        res.status(500).json({
            message: "Error in Database",
            error: error
        });
    });
}