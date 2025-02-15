import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCurTest } from "../../Store/Slices/ChangeTestSlice";

export default function MyTests() {
  const user = useSelector((state) => state.login.curUser);
  const [quizes, setQuizes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Текущая страница
  const [quizesPerPage] = useState(10); // Количество тестов на одной странице
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const url = process.env.REACT_APP_SERVER_URL;

  const fetchDataWithRetry = async (url, retries = 5, delay = 1000) => {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        const data = await response.json();
        return data; // Возвращаем данные, если запрос успешен
      } catch (error) {
        console.error(`Attempt ${attempt + 1} failed: ${error.message}`);
        if (attempt < retries - 1) {
          await new Promise((res) => setTimeout(res, delay)); // Ожидание перед новой попыткой
        } else {
          throw new Error("All attempts failed");
        }
      }
    }
  };

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await fetchDataWithRetry(`${url}/api/tests`);
        setQuizes(response);
      } catch (error) {
        console.error("Error fetching tests:", error);
      }
    };
    // Выполняем запросы только если user.id существует
    if (user && user.id) {
      fetchTests();
    } else console.error("User not found");
  }, [user]);

  // Фильтрация тестов, принадлежащих текущему пользователю
  const filteredQuizes = quizes
    .filter((quiz) => quiz.creator_id === user.id)
    .filter((quiz) =>
      quiz.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Логика пагинации
  const indexOfLastQuiz = currentPage * quizesPerPage;
  const indexOfFirstQuiz = indexOfLastQuiz - quizesPerPage;
  const currentQuizes = filteredQuizes.slice(indexOfFirstQuiz, indexOfLastQuiz);
  const totalPages = Math.ceil(filteredQuizes.length / quizesPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const changeTestHandler = (item) => {
    dispatch(setCurTest(item));
    navigate("/main/tests/create");
  };

  return (
    <div className="added_by-tests text-sm bg-[#f7f8fe]">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Поиск по названию теста..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded-md outline-none"
        />
      </div>
      <table className="min-w-full">
        <thead className="bg-white border-b">
          <tr>
            <th
              scope="col"
              className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
            >
              #
            </th>
            <th
              scope="col"
              className="text-sm font-bold text-gray-900 px-6 py-4 text-left"
            >
              Имя
            </th>
            <th
              scope="col"
              className="text-sm font-bold text-gray-900 px-6 py-4 text-left"
            >
              Сложность
            </th>
            <th
              scope="col"
              className="text-sm font-bold text-gray-900 px-6 py-4 text-left"
            >
              Количество вопросов
            </th>
            <th
              scope="col"
              className="text-sm font-bold text-gray-900 px-6 py-4 text-left"
            >
              Время
            </th>
            <th
              scope="col"
              className="text-sm font-bold text-gray-900 px-6 py-4 text-left"
            >
              Информация
            </th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {currentQuizes.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4">
                Тесты не найдены
              </td>
            </tr>
          ) : (
            currentQuizes.map((quiz, index) => (
              <tr
                key={quiz.id}
                className={`border-b duration-300 hover:bg-gray-300 ${
                  index % 2 === 1 ? "bg-gray-100" : "bg-gray-200"
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {index + 1}
                </td>
                <td className="text-sm text-gray-900  px-6 py-4 whitespace-nowrap">
                  {quiz.name}
                </td>
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  {quiz.difficulty}
                </td>
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  {quiz.total_questions}
                </td>
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  {quiz.time_limit}мин
                </td>
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => {
                      changeTestHandler(quiz);
                    }}
                    className="px-2 py-1 rounded bg-teal-700 text-white"
                  >
                    Изменить
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Пагинация */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 mx-1 disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          &lt;
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={`px-4 mx-1 ${
              currentPage === index + 1 ? "text-blue-500" : "text-gray-700"
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 mx-1 cursor-pointer disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
