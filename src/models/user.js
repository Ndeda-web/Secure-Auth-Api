const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    unique: true, 
    required: [true, "Email is required"] 
  },
  password: { 
    type: String, 
    required: [true, "Password is required"] 
  },
  role: { 
    type: String, 
    enum: ["USER", "ADMIN"], 
    default: "USER" 
  },
  isLocked: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model("User", userSchema);









