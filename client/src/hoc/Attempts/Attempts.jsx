import React, { useState, useEffect } from "react";
import { addAttempts } from "./api"; // функции для работы с API
import { getAllAttempts } from "../../components/Attempts/getAttempts";
import { Field, Select } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

export default function Attempts({ student_id }) {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [currentAttempts, setCurrentAttempts] = useState(null);
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
    // Загрузка студентов и тестов при первом рендере
    const fetchTests = async () => {
      try {
        const response = await fetchDataWithRetry(
          "http://localhost:8080/api/tests"
        );
        setTests(response);
      } catch (error) {
        console.error("Error fetching tests:", error);
      }
    };
    fetchTests();
  }, []);
  useEffect(() => {
    // Проверка наличия выбранных студента и теста
    if (selectedTest) {
      // Внутренняя функция с другим названием
      const loadAttempts = async () => {
        try {
          const attempts = await getAllAttempts(student_id, selectedTest);
          setCurrentAttempts(attempts[0].attempts);
        } catch (error) {
          setCurrentAttempts(null);
          console.error("Error fetching attempts:", error);
        }
      };
      loadAttempts();
    }
  }, [selectedTest]); // Депенденси массив: чтобы избежать лишних вызовов

  const handleAddAttempts = async () => {
    const added = currentAttempts + 1;
    await addAttempts(student_id, selectedTest, added);

    setCurrentAttempts(added); // обновление текущих попыток
  };
  const reduceAttempts = async () => {
    if (currentAttempts > 0) {
      const reduced = currentAttempts - 1;
      await addAttempts(student_id, selectedTest, reduced);
      setCurrentAttempts(reduced);
    } else return false;
  };
  return (
    <div className="change__attempts-wrapper">
      <div>
        <Field>
          <div className="relative">
            <Select
              onChange={(e) => setSelectedTest(e.target.value)}
              className={clsx(
                "my-1 block w-full appearance-none rounded-lg border-none bg-gray-300 py-1.5 px-3 text-sm/6 text-black",
                "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                // Make the text of each option black on Windows
                "*:text-black"
              )}
            >
              <option value="undef">Выберите тест</option>
              {tests.map((test) => (
                <option
                  key={test.id}
                  value={test.id}
                  className="hover:bg-black"
                >
                  {test.name}
                </option>
              ))}
            </Select>
            <ChevronDownIcon
              className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-black"
              aria-hidden="true"
            />
          </div>
        </Field>
      </div>
      <div>
        <label className="flex items-center gap-2">
          Текущие попытки:{" "}
          {currentAttempts !== null ? (
            <span>{currentAttempts}</span>
          ) : (
            <svg
              class="animate-spin h-6 w-6 text-gray-800"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
          )}
        </label>
      </div>
      <button
        onClick={handleAddAttempts}
        className="mr-2 bg-teal-700 text-sm duration-300 hover:bg-teal-600 p-1 rounded-md px-2 mt-2 text-white disabled:bg-gray-200 disabled:text-black disabled:cursor-not-allowed"
        disabled={
          currentAttempts !== null && currentAttempts >= 0 ? false : true
        }
      >
        Добавить попытки +1
      </button>
      <button
        onClick={reduceAttempts}
        className="bg-teal-700 text-sm duration-300 hover:bg-teal-600 p-1 rounded-md px-2 text-white disabled:bg-gray-200 disabled:text-black disabled:cursor-not-allowed"
        disabled={currentAttempts ? false : true}
      >
        Убавить попытки на 1
      </button>
    </div>
  );
}
