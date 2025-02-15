const pool = require("../db");
const bcrypt = require("bcrypt");

exports.getAllStudents = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, email, name, surname, groups FROM users WHERE role = $1",
      ["student"]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).send("Server error");
  }
};
