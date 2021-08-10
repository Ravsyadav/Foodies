
const Restaurant = require('../Models/Restaurant');


exports.getAllRestaurants = (req, res) => {
    Restaurant.find().then(result => {
        res.status(200).json({
            message: "restaurants",
            restaurants: result
        });
    }).catch(error => {
        res.status(500).json({
            message: "Error in Database",
            error: error
        });
    });
}

exports.getAllRestaurantById = (req, res) => {
    const restaurantId = req.params.restaurantId;
    Restaurant.find({ _id: restaurantId }).then(result => {
        res.status(200).json({
            message: `Restaurant for id: ${restaurantId}`,
            restaurant: result
        });
    }).catch(error => {
        res.status(500).json({
            message: "Error in Database",
            error: error
        });
    });
}

exports.getAllRestaurantByCity = (req, res) => {
    const cityName = req.params.cityName;
    Restaurant.find({ city: cityName }).then(result => {
        res.status(200).json({
            message: `Restaurants for city: ${cityName}`,
            restaurants: result
        });
    }).catch(error => {
        res.status(500).json({
            message: "Error in Database",
            error: error
        });
    });
}

exports.filterRestaurants = (req, res) => {
    const {
        mealtype,
        location,
        cuisine,
        hcost,
        lcost,
        sort,
        page = 1
    } = req.body;

    let filters = {};

    // add logic to apply filters

    if (mealtype) {
        filters.mealtype_id = mealtype;
    }

    if (location) {
        filters.location_id = location;
    }

    if (cuisine && cuisine.length > 0) {
        filters['cuisine.name'] = {
            $in: cuisine
        };
    }

    if (hcost != undefined && lcost != undefined) {
        if (lcost == 0) {
            filters.min_price = {
                $lt: hcost
            };
        } else {
            filters.min_price = {
                $gt: lcost,
                $lt: hcost
            }
        }
    }


    Restaurant.find(filters).sort({ min_price: sort }).then(result => {
        const page_size = 2;
        let temp;
        function paginate(array, page_size, page_number) {
            return array.slice((page_number - 1) * page_size, page_number * page_size);
        }
        temp = paginate(result, page_size, page);

        res.status(200).json({
            message: "Filtered restaurants",
            restaurants: temp,
            totalResultsCount: result.length,
            pageNo: page,
            pageSize: page_size
        });
    }).catch(error => {
        res.status(500).json({
            message: "Error in Database",
            error: error
        });
    }); 
}