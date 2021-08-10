
const User = require('../Models/User');

exports.signUp = (req, res) => {
    // (1) We need to capture the data sent in the API request
    const reqBody = req.body;

    const {
        email,
        password,
        firstName,
        lastName
    } = req.body;

    // (2) Call a save method
    //      a. we will create an object

    const userObj = new User(
        {
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName
        }
    );

    //  b. call the save method, insert data into MongoDB

    userObj.save().then(response => {
        res.status(200).json({
            message: "User Registered Successfully",
            user: response
        });
    }).catch(error => {
        res.status(500).json({
            message: "Error in Database",
            error: error
        });
    });

}


exports.login = (req, res) => {
    const reqBody = req.body;

    const {
        email,
        password
    } = reqBody;

    User.find({
        email: email,
        password: password
    }).then(result => {
        if (result.length > 0) {
            res.status(200).json({
                message: "User Loggedin Successfully",
                user: result,
                isLoggedIn: true
            });
        } else {
            res.status(400).json({
                message: "Username or password is wrong !!",
                isLoggedIn: false
            });
        }
    }).catch(error => {
        res.status(500).json({
            message: "Error in Database",
            error: error
        });
    });
}