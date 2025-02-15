import { useEffect } from "react";
import React, { useState } from "react";
import { LuAlarmClock } from "react-icons/lu";
import { NavLink } from "react-router-dom";
import Skeleton from "../Skeleton/Skeleton";
import "./Content.css";

export default function Content({ arr, attempts, results }) {
  const [quizes, setQuizes] = useState([]);
  const [perPage] = useState(9);
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    setQuizes([...arr]);
  }, [arr]);

  // Логика пагинации
  const indexOfLastQuiz = currentPage * perPage;
  const indexOfFirstQuiz = indexOfLastQuiz - perPage;
  const currentQuizes = quizes.slice(indexOfFirstQuiz, indexOfLastQuiz);
  const totalPages = Math.ceil(quizes.length / perPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  return (
    <div
      to="/main/test"
      className="main__content-quizes flex flex-col gap-5 flex-wrap items-stretch "
    >
      {quizes.length === 0 ? (
        <div className="flex gap-5">
          <Skeleton className="items-start" />
          <Skeleton className="items-start" />
          <Skeleton className="items-start" />
        </div>
      ) : (
        <div className="content__cards  flex items-center justify-center gap-5 flex-wrap">
          {currentQuizes.slice(0, perPage).map((test) => {
            const status = results?.find((item) => item?.test_id === test?.id);
            const atts = attempts.filter((att) => att.test_id === test.id);
            return (
              <div className="main__content-card w-[30%] flex flex-col justify-between h-40 mb-24 bg-[#254E58] rounded-lg shadow-xl  hover:scale-105 duration-300">
                <div className="card__title text-center pt-5 text-3xl text-white">
                  {test.name.toUpperCase()}
                </div>
                <div className="card__info bg-[#FBFAF8] border-[1px] w-3/4 mx-auto p-3 rounded-lg translate-y-[10%]">
                  <div className="card__info-header flex items-center justify-between mb-2">
                    <div className="card__info-creater bg-gray-300 p-1 rounded-lg px-2">
                      {test.created_by}
                    </div>
                    <div className="card__info-time flex items-center">
                      <LuAlarmClock className="mt-0.5" />:
                      <span className="mt-1 ml-0.5">{test.time_limit}мин</span>
                    </div>
                    <div className="card__info-quantity">
                      <span>Вопросов: </span>
                      {test.total_questions}
                    </div>
                  </div>
                  <div className="card__info-body">
                    Проверьте свои знания по данной теме, ответив на ряд
                    вопросов.
                    <br />
                    <span>
                      Количество попыток:{" "}
                      <span className="font-semibold">
                        {atts.length ? atts[0]?.attempts : 0}
                      </span>
                    </span>
                  </div>
                  <div className="card__info-footer flex items-center justify-between mt-2">
                    <NavLink
                      to={`/main/test/${test.id}`}
                      className={"p-1 px-2 rounded bg-teal-900 text-white"}
                    >
                      Пройти Тест
                    </NavLink>
                    <span className="card__footer-status">
                      {status?.completed ? (
                        <span className="text-green-500">Завершен</span>
                      ) : (
                        <span className="text-red-500">Не завершен</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Пагинация */}
      <div className="mt-8 mx-auto flex justify-center">
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
