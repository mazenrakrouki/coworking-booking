const mongoose = require('mongoose');

const spaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['desk', 'meeting_room'], required: true },
  capacity: { type: Number, required: true }
});

module.exports = mongoose.model('Space', spaceSchema);