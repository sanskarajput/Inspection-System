const asyncHandler = require('express-async-handler');

const { Restaurant } = require('@/models/index');

class RestaurantController {
  static createRestaurant = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const userId = req.currentUser.id;

    // check if restaurant with same name exists for the user

    const existingRestaurant = await Restaurant.findOne({
      owner: userId,
      name: { $regex: new RegExp(`^${name}$`, 'i') } // case-insensitive
    });

    if (existingRestaurant) {
      return res.status(400).json({
        message: 'Restaurant with this name already exists'
      });
    }

    const newRestaurant = await Restaurant.create({
      name,
      owner: userId
    });

    const populatedRestaurant = await newRestaurant.populate('owner', 'id username name');

    res.status(201).json({
      message: 'Restaurant created successfully',
      restaurant: populatedRestaurant
    });
  });

  static getAllRestaurantsOfUser = asyncHandler(async (req, res) => {
    const userId = req.currentUser.id;

    const restaurants = await Restaurant.find({ owner: userId }).populate(
      'owner',
      'id username name'
    );

    res.status(200).json({
      message: 'Restaurants fetched successfully',
      restaurants
    });
  });

  static getRestaurantById = asyncHandler(async (req, res) => {
    const { restaurantId } = req.params;
    const userId = req.currentUser.id;
    const restaurant = await Restaurant.findOne({ _id: restaurantId, owner: userId }).populate(
      'owner',
      'id username name'
    );

    if (!restaurant) {
      return res.status(404).json({
        message: 'Restaurant not found'
      });
    }

    res.status(200).json({
      message: 'Restaurant fetched successfully',
      restaurant
    });
  });
}

module.exports = RestaurantController;
