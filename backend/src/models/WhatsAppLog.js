const mongoose = require('mongoose');

const whatsAppLogSchema = new mongoose.Schema(
  {
    inspectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Inspection'
    },
    messageId: {
      type: String,
      trim: true
    },
    recipient: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'read', 'failed'],
      default: 'sent'
    },
    errorMessage: {
      type: String
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed
    }
  },
  {
    timestamps: true
  }
);

const WhatsAppLog = mongoose.model('WhatsAppLog', whatsAppLogSchema);
module.exports = WhatsAppLog;
