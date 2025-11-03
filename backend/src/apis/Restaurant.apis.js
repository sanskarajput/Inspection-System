const express = require('express');
const { body } = require('express-validator');

const { validateRequest } = require('@/middlewares/validateRequest');
const { RestaurantController } = require('@/controllers/index');

const authenticated = require('@/middlewares/auth/authenticated');

const restaurantApis = express.Router();

// Create a new restaurant
restaurantApis.post(
  '/',
  [
    authenticated,
    // name
    body('name').isString().withMessage('Name must be a string'),
    validateRequest
  ],
  RestaurantController.createRestaurant
);

// get all restaurants of a user
restaurantApis.get('/', authenticated, RestaurantController.getAllRestaurantsOfUser);

// get restaurant by id
restaurantApis.get('/:restaurantId', authenticated, RestaurantController.getRestaurantById);

// Update restaurant details

// Delete a restaurant

module.exports = restaurantApis;
