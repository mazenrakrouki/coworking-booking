const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  spaceId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Space', 
    required: true 
  },
  start: { type: Date, required: true },
  end: { type: Date, required: true }
});

// Empêche les doubles réservations
bookingSchema.index({ spaceId: 1, start: 1, end: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);