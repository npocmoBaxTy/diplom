// components/AttemptsList.js
import React, { useEffect, useState } from 'react'
import { getAllAttempts } from './getAttempts'

const AttemptsList = ({ userId, testId }) => {
	const [attempts, setAttempts] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		const fetchAttempts = async () => {
			try {
				const data = await getAllAttempts(userId, testId)
				setAttempts(data)
			} catch (err) {
				setError('Не удалось загрузить попытки')
				console.error(err)
			} finally {
				setLoading(false)
			}
		}

		fetchAttempts()
	}, [userId, testId])

	if (loading) return <p>Загрузка...</p>
	if (error) return <p>{error}</p>

	return (
		<div>
			<h2>Список попыток</h2>
			{attempts.length > 0 ? (
				<ul>
					{attempts.map(attempt => (
						<li key={attempt.id}>
							Пользователь: {attempt.user_id}, Тест: {attempt.test_id}, Попытки:{' '}
							{attempt.attempts}
						</li>
					))}
				</ul>
			) : (
				<p>Попытки отсутствуют.</p>
			)}
		</div>
	)
}

export default AttemptsList
