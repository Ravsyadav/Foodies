const express = require('express');
const router = express.Router();

// import the controllers
const locationController = require("../Controllers/Location");
const mealTypeController = require("../Controllers/MealType");
const restaurantController = require("../Controllers/Restaurant");
const userController = require("../Controllers/User");
const menuController = require("../Controllers/Menu");
const paymentController = require("../Controllers/Payment");

// have routes

router.get('/getAllRestaurants', restaurantController.getAllRestaurants);
router.get('/getRestaurantByID/:restaurantId', restaurantController.getAllRestaurantById);
router.get('/getRestaurantByLocation/:cityName', restaurantController.getAllRestaurantByCity);
router.post('/filterRestaurants', restaurantController.filterRestaurants);

router.get('/getLocations', locationController.getLocations);

router.get('/getMealTypes', mealTypeController.getMealTypes);

router.post('/userSignUp', userController.signUp);
router.post('/userLogin', userController.login);

router.get('/getMenuByRestaurant/:restaurantId', menuController.getMenuForRestaurant);


// payment APIs
router.post('/payment', paymentController.payment);
router.post('/paymentCallback', paymentController.paymentCallback);


module.exports = router;