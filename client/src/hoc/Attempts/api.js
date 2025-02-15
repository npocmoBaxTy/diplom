// api.js

// URL сервера для API-запросов
const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Получает список студентов
 * @returns {Promise<Array>} Массив объектов студентов
 */
export async function fetchStudents() {
    try {
        const response = await fetch(`${API_BASE_URL}/students`);
        if (!response.ok) {
            throw new Error('Не удалось получить список студентов');
        }
        return await response.json();
    } catch (error) {
        console.error('Ошибка при получении студентов:', error);
        return [];
    }
}

/**
 * Получает список тестов
 * @returns {Promise<Array>} Массив объектов тестов
 */
export async function fetchTests() {
    try {
        const response = await fetch(`${API_BASE_URL}/tests`);
        if (!response.ok) {
            throw new Error('Не удалось получить список тестов');
        }
        return await response.json();
    } catch (error) {
        console.error('Ошибка при получении тестов:', error);
        return [];
    }
}

/**
 * Получает текущее количество попыток студента по конкретному тесту
 * @param {number} studentId - ID студента
 * @param {number} testId - ID теста
 * @returns {Promise<number>} Текущее количество попыток
 */
export async function fetchAttempts(studentId, testId) {
    try {
        const response = await fetch(`${API_BASE_URL}/attempts?userId=${studentId}&testId=${testId}`);
        if (!response.ok) {
            throw new Error('Не удалось получить количество попыток');
        }
        const data = await response.json();
        return data.attempts || 0; // Предполагаем, что API возвращает объект с полем attempts
    } catch (error) {
        console.error('Ошибка при получении количества попыток:', error);
        return 0;
    }
}

/**
 * Добавляет количество попыток студенту для конкретного теста
 * @param {number} studentId - ID студента
 * @param {number} testId - ID теста
 * @param {number} attempts - Количество добавляемых попыток
 * @returns {Promise<void>}
 */
export async function addAttempts(studentId, testId, attempts) {
    try {
        const response = await fetch(`${API_BASE_URL}/addAttempts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: studentId,
                testId: testId,
                attempts: attempts,
            }),
        });
        console.log(studentId, testId, attempts)
        if (!response.ok) {
            throw new Error('Не удалось добавить попытки');
        }
        console.log('Попытки успешно добавлены');
    } catch (error) {
        console.error('Ошибка при добавлении попыток:', error);
    }
}
