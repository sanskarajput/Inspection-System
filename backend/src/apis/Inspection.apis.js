const express = require('express');
const { body, param } = require('express-validator');

const { validateRequest } = require('@/middlewares/validateRequest');
const { InspectionController } = require('@/controllers/index');

const authenticated = require('@/middlewares/auth/authenticated');

const inspectionApis = express.Router({ mergeParams: true });

// Create a new inspection for a restaurant
inspectionApis.post(
  '/',
  [
    authenticated,
    param('restaurantId').isMongoId().withMessage('Invalid restaurant ID'),
    body('title').isString().withMessage('Title must be a string'),
    body('sections').isArray({ min: 1 }).withMessage('Sections must be a non-empty array'),
    body('sections.*.title').isString().withMessage('Section title must be a string'),
    body('sections.*.questions')
      .isArray({ min: 1 })
      .withMessage('Questions must be a non-empty array'),
    body('sections.*.questions.*.text').isString().withMessage('Question text must be a string'),
    body('sections.*.questions.*.type')
      .optional()
      .isIn(['yes_no', 'number', 'text', 'rating'])
      .withMessage('Invalid question type'),
    validateRequest
  ],
  InspectionController.createInspection
);

// Get all inspections of a restaurant
inspectionApis.get(
  '/',
  [
    authenticated,
    // restaurantId
    param('restaurantId').isMongoId().withMessage('Invalid restaurant ID'),
    validateRequest
  ],
  InspectionController.getAllInspectionsOfRestaurant
);

// Get inspection by id
inspectionApis.get(
  '/:inspectionId',
  [
    authenticated,
    param('inspectionId').isMongoId().withMessage('Invalid inspection ID'),
    validateRequest
  ],
  InspectionController.getInspectionById
);

module.exports = inspectionApis;
