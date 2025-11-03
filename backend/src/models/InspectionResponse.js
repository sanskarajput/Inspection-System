const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true
    },
    questionText: {
      type: String,
      required: true
    },
    answer: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    }
  },
  { _id: false }
);

const inspectionResponseSchema = new mongoose.Schema(
  {
    inspectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Inspection',
      required: true
    },
    respondentPhone: {
      type: String,
      required: true,
      trim: true
    },
    respondentName: {
      type: String,
      trim: true
    },
    answers: [answerSchema],
    submittedAt: {
      type: Date,
      default: Date.now
    },
    whatsappMessageId: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const InspectionResponse = mongoose.model('InspectionResponse', inspectionResponseSchema);
module.exports = InspectionResponse;
