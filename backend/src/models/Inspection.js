const mongoose = require('mongoose');
const sectionSchema = require('./Section').schema;

const inspectionSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    sentTo: [
      {
        type: String,
        required: true
      }
    ],
    whatsappFlowId: {
      type: String,
      trim: true
    },
    sentAt: {
      type: Date,
      default: null
    },
    status: {
      type: String,
      enum: ['pending', 'sent', 'completed'],
      default: 'pending'
    },
    sections: [sectionSchema]
  },
  {
    timestamps: true
  }
);

const Inspection = mongoose.model('Inspection', inspectionSchema);
module.exports = Inspection;
