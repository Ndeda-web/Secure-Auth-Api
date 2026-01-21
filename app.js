
const express = require("express");
const app = express();
const authRoutes = require("./src/routes/authRoutes");
const helmet = require("helmet");
const cors = require("cors");



app.use(helmet()); 
app.use(cors());
app.use(express.json()); 

app.use("/auth", authRoutes);

module.exports = app;
