import React, { useState, useEffect } from "react";
import Content from "../../components/Content/Content";
import Filters from "../../components/Filters/Filters";
import { useSelector } from "react-redux";
import { getAllAttempts } from "../../components/Attempts/getAttempts";
import "./Main.css";

export default function Main() {
  const [quizes, setQuizes] = useState([]);
  const [sortedQuizes, setSortedQuizes] = useState([]);
  const [attempt, setAttempts] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [order, setOrder] = useState("asc");
  const user = useSelector((state) => state.login.curUser);
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
        setSortedQuizes(response);
      } catch (error) {
        console.error("Error fetching tests:", error);
      }
    };

    const fetchTestResults = async () => {
      if (!user || !user.id) {
        console.error("User ID is undefined");
        return; // Не отправляем запрос, если user.id не определён
      }

      try {
        const response = await fetchDataWithRetry(
          `${url}/api/test-results/${user.id}`
        );
        setTestResults(response);
      } catch (error) {
        console.error("Error fetching test results:", error);
      }
    };
    const fetchAttempts = async () => {
      try {
        const data = await getAllAttempts(user.id);
        setAttempts(data);
      } catch (error) {
        alert("Error, pls refresh");
      }
    };
    // Выполняем запросы только если user.id существует
    if (user && user.id) {
      fetchTests();
      fetchTestResults();
      fetchAttempts();
    }
  }, [user]);
  const sortQuizes = () => {
    const newOrder = order === "asc" ? "desc" : "asc";
    setOrder(newOrder);

    const sorted = [...quizes].sort(
      (a, b) =>
        newOrder === "asc"
          ? a.name.localeCompare(b.name) // По возрастанию
          : b.name.localeCompare(a.name) // По убыванию
    );

    setSortedQuizes(sorted);
  };
  window.scrollTo(0, 0);
  return (
    <div className="main__content flex relative items-stretch overflow-hidden">
      <div className="main__content-inner py-5 px-8 w-full min-h-screen">
        <div className="title text-2xl text-gray-700 font-semibold">Тесты</div>
        <Filters sortby={sortQuizes} />
        <Content arr={sortedQuizes} attempts={attempt} results={testResults} />
      </div>
    </div>
  );
}
