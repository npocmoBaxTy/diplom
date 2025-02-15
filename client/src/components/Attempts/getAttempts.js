// services/api.js
import axios from "axios";

export const getAllAttempts = async (userId, testId) => {
  const server = process.env.REACT_APP_SERVER_URL;
  try {
    let url = `${server}/api/attempts`;
    const params = {};

    if (userId) params.user_id = userId;
    if (testId) params.test_id = testId;

    const response = await axios.get(url, { params });
    return response.data; // Возвращаем данные с сервера
  } catch (error) {
    console.error("Ошибка при получении попыток:", error);
    throw error;
  }
};
