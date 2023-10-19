const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, required: true },
});

MessageSchema.virtual('relative_timestamp').get(function () {
  return DateTime.fromISO(this.timestamp).toRelative();
});

module.exports = mongoose.model('Message', MessageSchema);
