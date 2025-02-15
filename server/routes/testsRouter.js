const express = require('express')
const router = express.Router()
const pool = require('./../db') // Ваш пул подключений к базе данных

// Маршрут для получения всех тестов
router.get('/tests', async (req, res) => {
	try {
		const result = await pool.query('SELECT * FROM tests')
		res.json(result.rows)
	} catch (err) {
		console.error('Error fetching tests:', err)
		res.status(500).json({ error: 'Internal server error' })
	}
})

module.exports = router
