
// import the Location Model to work with
const Location = require('../Models/Location');


// functionalities for the location controller
// to talk to the database

exports.getLocations = (req, res) => {
    Location.find().then(result => {
        res.status(200).json({
            message: "Locations fetched",
            locations: result
        });
    }).catch(error => {
        res.status(500).json({
            message: "Error in Database",
            error: error
        });
    });
};

exports.addNewLocation = (req, res) => {
    const data = req.body;

    const locationObj = new Location(data);

    locationObj.save().then(result => {
        res.status(200).json({
            message: "Location added successfully"
        });
    }).catch(error => {
        res.status(500).json({
            message: "Error in Database",
            error: error
        });
    });
};