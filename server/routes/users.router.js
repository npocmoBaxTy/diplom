const express = require("express");
const { getAllStudents } = require("../controllers/user.controller");

const router = express.Router();

router.get("/students", getAllStudents);

module.exports = router;
