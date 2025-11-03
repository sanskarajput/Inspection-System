const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['yes_no', 'number', 'text', 'rating'],
      default: 'yes_no'
    },
    order: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
