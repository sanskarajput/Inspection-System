const express = require('express');
const apis = express.Router();

const authApis = require('@/apis/Auth.apis');
const restaurantApis = require('@/apis/Restaurant.apis');
const inspectionApis = require('@/apis/Inspection.apis');

apis.use('/auth', authApis);
apis.use('/restaurant', restaurantApis);
apis.use('/restaurant/:restaurantId/inspection', inspectionApis);

module.exports = apis;
