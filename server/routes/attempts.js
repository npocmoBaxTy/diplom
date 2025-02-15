// routes/attempts.js
const express = require("express");
const router = express.Router();
const { getAllAttempts } = require("./../controllers/attemptsController");

router.get("/", getAllAttempts);

module.exports = router;
