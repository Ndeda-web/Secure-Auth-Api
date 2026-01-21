// src/models/Session.js
const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  refreshTokenHash: { 
    type: String, 
    required: true 
  },
  ip: { 
    type: String 
  },
  userAgent: { 
    type: String 
  },
  expiresAt: { 
    type: Date, 
    required: true 
  }
});

module.exports = mongoose.model("Session", sessionSchema);
