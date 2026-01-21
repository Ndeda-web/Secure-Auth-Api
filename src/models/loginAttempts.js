const mongoose = require("mongoose");

const loginAttemptSchema = new mongoose.Schema({
  email: { type: String, required: true },
  ip: { type: String },
  attempts: { type: Number, default: 1 },
  lastAttempt: { type: Date, default: Date.now },
  lockedUntil: { type: Date }
});

module.exports = mongoose.model("LoginAttempt", loginAttemptSchema);
