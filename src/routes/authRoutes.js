
const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authcontroller");
const validateRegister = require("../middlewares/validateRegister");
const validateLogin = require("../middlewares/validateLogin");
const { refreshToken } = require("../controllers/authcontroller");
const { logout, logoutAll } = require("../controllers/authcontroller");



router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);
router.post("/logout-all", logoutAll);


module.exports = router;
