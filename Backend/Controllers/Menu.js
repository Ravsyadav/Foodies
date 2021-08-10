const Menu = require('../Models/Menu');

exports.getMenuForRestaurant = (req, res) => {
    const restaurantId = req.params.restaurantId;
    Menu.find({ restaurantId: restaurantId }).then(result => {
        res.status(200).json({
            message: `Menu for restaurant id: ${restaurantId}`,
            menu: result
        });
    }).catch(error => {
        res.status(500).json({
            message: "Error in Database",
            error: error
        });
    });
}