import React, { useState, useEffect } from "react";
import { MdChevronRight } from "react-icons/md";
import { useSelector } from "react-redux";

const TestResults = () => {
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const user = useSelector((state) => state.login.curUser);

  // Пагинация
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/api/test-results`
        );
        if (!response.ok) {
          throw new Error(`Ошибка сервера: ${response.status}`);
        }
        const data = await response.json();
        setResults(data);
        setFilteredResults(data); // Изначально показываем все результаты
      } catch (error) {
        console.log("Ошибка при загрузке данных:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredResults(results); // Если нет поискового запроса, показываем все
    } else {
      const filtered = results.filter(
        (result) =>
          result.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          result.test_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          result.groups.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredResults(filtered); // Фильтруем результаты по поисковому запросу
    }
  }, [searchTerm, results]);

  // Логика для получения текущей страницы результатов
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = filteredResults.slice(
    indexOfFirstResult,
    indexOfLastResult
  );

  // Пагинация
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <p>Загрузка результатов...</p>;
  }

  if (error) {
    return <p className="text-red-500">Ошибка: {error}</p>;
  }

  const handleSortByName = () => {
    const sortedResults = [...filteredResults].sort((a, b) => {
      if (sortDirection === "asc") {
        return a.user_name.localeCompare(b.user_name);
      } else {
        return b.user_name.localeCompare(a.user_name);
      }
    });

    // Обновляем направление сортировки
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");

    // Обновляем отсортированные данные
    setFilteredResults(sortedResults);
  };

  const totalPages = Math.ceil(filteredResults.length / resultsPerPage);
  return (
    <div className="min-h-[100vh] text-sm">
      <h1 className="text-2xl text-gray-500 mb-3">Результаты Тестов</h1>

      {/* Поле поиска */}
      <div className="mb-4 flex items-center test__results-header w-full">
        <div className="results__header-search w-1/3">
          <input
            type="text"
            placeholder="Поиск по имени пользователя или названию теста"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md w-full"
          />
        </div>
      </div>

      {filteredResults.length === 0 ? (
        <p>Нет доступных результатов.</p>
      ) : (
        <>
          <table className="min-w-full">
            <thead className="bg-white">
              <tr>
                <th
                  scope="col"
                  className="text-sm text-gray-900 px-6 text-left"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="text-sm text-gray-900 px-6 py-4 text-left cursor-pointer duration-300 hover:bg-gray-200"
                  onClick={handleSortByName}
                >
                  Пользователь
                </th>
                <th
                  scope="col"
                  className="text-sm text-gray-900 px-6 py-4 text-left"
                >
                  Группа
                </th>
                <th
                  scope="col"
                  className="text-sm font-bold text-gray-900 px-6 py-4 text-left"
                >
                  Тест
                </th>
                <th
                  scope="col"
                  className="text-sm font-bold text-gray-900 px-6 py-4 text-left"
                >
                  Баллы
                </th>
                <th
                  scope="col"
                  className="text-sm font-bold text-gray-900 px-6 py-4 text-left"
                >
                  Вопросы
                </th>
                <th
                  scope="col"
                  className="text-sm font-bold text-gray-900 px-6 py-4 text-left"
                >
                  Результат
                </th>
                <th
                  scope="col"
                  className="text-sm font-bold text-gray-900 px-6 py-4 text-left"
                >
                  Окончание
                </th>
                <th
                  scope="col"
                  className="text-sm font-bold text-gray-900 px-6 py-4 text-left"
                >
                  Завершено
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {user.role === "student"
                ? currentResults
                    .filter((item) => item.user_id === user.id)
                    .map((results) => (
                      <>
                        <tr
                          className={`border-b duration-300 hover:bg-gray-200 bg-gray-100`}
                        >
                          <td className="px-6 whitespace-nowrap text-sm font-medium text-gray-900">
                            {results.user_id}
                          </td>
                          <td className="text-sm text-gray-900 font-semibold px-6 py-4 whitespace-nowrap">
                            {results.user_name}
                          </td>
                          <td className="text-sm text-gray-900 font-semibold px-6 py-4 whitespace-nowrap">
                            {results.groups}
                          </td>
                          <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {results.test_name}
                          </td>
                          <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {results.score}
                          </td>
                          <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {results.total_questions}
                          </td>
                          <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {results.correct_answers +
                              "/" +
                              results.total_questions}
                          </td>
                          <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {new Date(results.start_time).toLocaleString(
                              "ru-RU"
                            )}
                          </td>
                          <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {results.completed ? "Да" : "Нет"}
                          </td>
                        </tr>
                      </>
                    ))
                : currentResults?.map((results, index) => (
                    <>
                      <tr
                        className={`border-b duration-300 hover:bg-gray-200 bg-gray-100`}
                      >
                        <td className="px-6 whitespace-nowrap text-sm font-medium text-gray-900">
                          {results.user_id}
                        </td>
                        <td className="text-sm text-gray-900 font-semibold px-6 py-4 whitespace-nowrap">
                          {results.user_name}
                        </td>
                        <td className="text-sm text-gray-900 font-semibold px-6 py-4 whitespace-nowrap">
                          {results.groups}
                        </td>
                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                          {results.test_name}
                        </td>
                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                          {results.score}
                        </td>
                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                          {results.total_questions}
                        </td>
                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                          {results.correct_answers +
                            "/" +
                            results.total_questions}
                        </td>
                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                          {new Date(results.start_time).toLocaleString("ru-RU")}
                        </td>
                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                          {results.completed ? "Да" : "Нет"}
                        </td>
                      </tr>
                    </>
                  ))}
            </tbody>
          </table>

          {/* Пагинация */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 mx-1 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              <MdChevronRight className="rotate-180" />
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`px-4 py-2 mx-1 rounded-lg ${
                  currentPage === index + 1 ? "text-blue-500" : "text-gray-700"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 mx-1  cursor-pointer disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              <MdChevronRight />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TestResults;
