const asyncHandler = require('express-async-handler');

const { Inspection, Restaurant } = require('@/models/index');

class InspectionController {
  static createInspection = asyncHandler(async (req, res) => {
    const { restaurantId } = req.params;
    const { title, sections } = req.body;

    // Check if restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const inspection = await Inspection.create({
      restaurant: restaurantId,
      title,
      sections
    });

    res.status(201).json({
      message: 'Inspection created successfully',
      inspection
    });
  });

  static getAllInspectionsOfRestaurant = asyncHandler(async (req, res) => {
    const { restaurantId } = req.params;

    // check if restaurant exists
    const restaurant = await Restaurant.findOne({
      _id: restaurantId
    });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const inspections = await Inspection.find({ restaurant: restaurantId });

    res.status(200).json({
      message: 'Inspections fetched successfully',
      inspections
    });
  });

  static getInspectionById = asyncHandler(async (req, res) => {
    const { inspectionId } = req.params;

    // check if inspection exists
    const inspection = await Inspection.findOne({
      _id: inspectionId
    });

    if (!inspection) {
      return res.status(404).json({ message: 'Inspection not found' });
    }

    res.status(200).json({
      message: 'Inspection fetched successfully',
      inspection
    });
  });
}

module.exports = InspectionController;
