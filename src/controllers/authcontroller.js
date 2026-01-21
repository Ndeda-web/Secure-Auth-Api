
const User = require("../models/user");
const { hashPassword } = require("../utils/password");

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

   
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already in use" });

    
    const hashedPassword = await hashPassword(password);

    
    const newUser = await User.create({ email, password: hashedPassword });

        res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt
      }
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



const { comparePassword } = require("../utils/password");
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require("../utils/jwt");
const crypto = require("crypto");
const Session = require("../models/session");


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    if (user.isLocked) {
      return res.status(403).json({ message: "Account is temporarily locked. Try again later." });
    }

    
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
    }

     const accessToken = generateAccessToken(user);
     const refreshToken = generateRefreshToken(user);

      const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

      await Session.create({
      userId: user._id,
      refreshTokenHash,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}; 

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    
    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    
    const session = await Session.findOne({ refreshTokenHash });
    if (!session) {
      return res.status(403).json({ message: "Session not found or token reused" });
    }

   
    await Session.deleteOne({ _id: session._id });

   
    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    
    const newRefreshTokenHash = crypto
      .createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");

    await Session.create({
      userId: user._id,
      refreshTokenHash: newRefreshTokenHash,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    
    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token required" });
    }

    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    await Session.deleteOne({ refreshTokenHash });

    res.status(200).json({ message: "Logged out successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const jwt = require("jsonwebtoken");

exports.logoutAll = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.sendStatus(401);

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    await Session.deleteMany({ userId: payload.id });

    res.status(200).json({ message: "Logged out from all devices" });

  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid token" });
  }
};
