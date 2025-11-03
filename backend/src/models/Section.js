const mongoose = require('mongoose');
const questionSchema = require('./Question').schema;

const sectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    questions: [questionSchema]
  },
  {
    timestamps: true
  }
);

const Section = mongoose.model('Section', sectionSchema);
module.exports = Section;
