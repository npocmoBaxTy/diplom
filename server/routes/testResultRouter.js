const express = require('express')
const router = express.Router()
const pool = require('./../db') // Ваш пул подключений к базе данных

// Маршрут для получения результатов тестов по user_id
router.get('/test-results/:userId', async (req, res) => {
	const userId = req.params.userId

	try {
		const result = await pool.query(
			'SELECT * FROM test_results WHERE user_id = $1',
			[userId]
		)
		res.json(result.rows)
	} catch (err) {
		console.error('Error fetching test results:', err)
		res.status(500).json({ error: 'Internal server error' })
	}
})

module.exports = router
