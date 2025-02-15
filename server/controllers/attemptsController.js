const db = require("./../db.js");

async function getAllAttempts(req, res) {
  const { user_id, test_id } = req.query;
  let query = "SELECT * FROM attempts";
  const values = [];

  if (user_id) {
    values.push(user_id);
    query += ` WHERE user_id = $${values.length}`;
  }
  if (test_id) {
    values.push(test_id);
    query += values.length === 1 ? ` WHERE` : ` AND`;
    query += ` test_id = $${values.length}`;
  }

  try {
    const result = await db.query(query, values);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Ошибка при выполнении запроса:", err.stack);
    res.status(500).json({ error: "Ошибка сервера" });
  }
}

module.exports = { getAllAttempts };
