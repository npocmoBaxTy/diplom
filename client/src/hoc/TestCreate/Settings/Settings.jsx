// SelectQuestionType.js
import React from "react";
import { Listbox } from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";
import { LuText } from "react-icons/lu";
import { FaRegImage } from "react-icons/fa";

// Массив типов вопросов
const questionTypes = [
  { id: "text", name: "Short Text" },
  { id: "image", name: "Image" },
];

const SelectQuestionType = ({ currentQuestion, updateQuestionType }) => {
  // Если текущий вопрос отсутствует, показываем дефолтное состояние
  if (!currentQuestion) {
    return (
      <div className="w-full bg-gray-100 h-full">
        <div className="text-gray-500">Вопрос не найден</div>
      </div>
    );
  }

  const handleChange = (newType) => {
    updateQuestionType(newType); // Обновляем тип вопроса в родительском компоненте

    if (newType === "img") {
      currentQuestion.img = ["картинка"]; // Добавляем свойство img
    } else {
      delete currentQuestion.img; // Удаляем свойство img
    }
  };

  return (
    <div className="w-full bg-gray-100 h-full pt-3 px-3">
      <div className="question-settings__title mb-3 text-gray-600">
        Настройки вопроса
      </div>
      <Listbox value={currentQuestion.type} onChange={handleChange}>
        <div className="relative text-sm">
          <Listbox.Button className="w-full text-gray-700 py-2 pl-3 pr-10 text-left bg-gray-100 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <span className="truncate flex items-center gap-1">
              {currentQuestion.type === "text" ? (
                <LuText className="p-0.5 pr-3 bg-[#b5ddfc] text-xl rounded w-[20%]" />
              ) : (
                <FaRegImage className="p-0.5 pr-3 bg-[#e6cef3] text-xl rounded w-[20%]" />
              )}
              {currentQuestion.type === "text" ? "Short Text" : "Image"}
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2">
              <FaChevronDown className="w-3 h-3 text-gray-500" />
            </span>
          </Listbox.Button>

          <Listbox.Options className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg overflow-auto focus:outline-none">
            {questionTypes.map((type) => (
              <Listbox.Option
                key={type.id}
                value={type.id}
                className={({ active }) =>
                  `relative cursor-pointer text-gray-700 select-none py-2 pl-4 pr-4  ${
                    active ? "bg-blue-500 " : "text-gray-700"
                  }`
                }
              >
                {({ selected }) => (
                  <div className="flex items-center gap-1 w-full">
                    {type.name === "Short Text" ? (
                      <LuText className="p-0.5 pr-3 bg-[#b5ddfc] text-xl rounded w-[20%]" />
                    ) : (
                      <FaRegImage className="p-0.5 pr-3 bg-[#e6cef3] text-xl rounded w-[20%]" />
                    )}
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {type.name}
                    </span>
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
};

export default SelectQuestionType;
