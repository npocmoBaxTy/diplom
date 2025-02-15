import React, { useState } from "react";
import { LuText } from "react-icons/lu";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FaTrashCan } from "react-icons/fa6";
import { v4 as uuidv4 } from "uuid";

import { FaRegImage } from "react-icons/fa";

const Sidebar = ({
  quizes,
  setQuizes,
  currentHandler,
  current,
  setCurrent,
  clearQuizesHandler,
}) => {
  const [activeMenu, setActiveMenu] = useState(null); // Храним активное меню

  // Обработчик окончания перетаскивания
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const updatedQuizes = [...quizes];
    const [reorderedItem] = updatedQuizes.splice(result.source.index, 1);
    updatedQuizes.splice(result.destination.index, 0, reorderedItem);
    setQuizes(updatedQuizes); // Обновляем массив
    localStorage.setItem("quizes", JSON.stringify(updatedQuizes));
  };

  // Обработчик удаления
  const deleteHandler = (index) => {
    const updatedQuizes = quizes.filter((_, i) => i !== index);

    // Если вопросы закончились, добавляем "новый вопрос"
    if (updatedQuizes.length === 0) {
      const uniqueId = uuidv4();
      const uniqueId1 = uuidv4();
      const uniqueId2 = uuidv4();
      const uniqueId3 = uuidv4();
      const uniqueId4 = uuidv4();
      setQuizes([
        {
          id: uniqueId,
          type: "text",
          question: Math.random(1, 100),
          answers: [
            {
              text: uniqueId1,
              correct: false,
              id: `${Math.random()}-${uniqueId1}`,
            },
            {
              text: uniqueId2,
              correct: true,
              id: `${Math.random()}-${uniqueId2}`,
            },
            {
              text: uniqueId3,
              correct: false,
              id: `${Math.random()}-${uniqueId3}`,
            },
            {
              text: uniqueId4,
              correct: false,
              id: `${Math.random()}-${uniqueId4}`,
            },
          ],
        },
      ]);
      setCurrent(0);
    } else {
      setQuizes(updatedQuizes);
      if (current >= updatedQuizes.length) {
        setCurrent(updatedQuizes.length - 1);
      }
    }

    // Закрываем активное меню
    setActiveMenu(null);
  };

  return (
    <div className="new__test-sidebar w-[20%] bg-gray-100 min-h-[89vh]">
      <div className="sidebar__inner">
        <div className="sidebar__inner-title px-3 mt-1 text-gray-700">
          Вопросы
        </div>
        {quizes.length > 0 ? (
          <div className="sidebar__list">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="questions">
                {(provided) => (
                  <div
                    className="sidebar__inner-list p-3"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {quizes.map((quiz, index) => (
                      <Draggable
                        key={quiz.id}
                        draggableId={`${quiz.id}`}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`sidebar-list__question mb-2 relative text-xs p-4
                        bg-gray-200 flex items-center cursor-pointer rounded duration-300 hover:bg-gray-300 ${
                          index === current
                            ? "shadow-xl translate-x-2 bg-gray-300"
                            : ""
                        }`}
                            onClick={() => currentHandler(index)}
                          >
                            <div
                              className={`sidebar-question__index flex items-center p-0.5 px-3 rounded text-black ${
                                quiz.type === "text"
                                  ? "bg-[#b5ddfc]"
                                  : "bg-[#e6cef3]"
                              }`}
                            >
                              {quiz.type === "text" ? (
                                <LuText />
                              ) : (
                                <FaRegImage />
                              )}
                              <span className="ml-2">{index + 1}</span>
                            </div>
                            <div className="question__text mr-auto ml-2 text-xs whitespace-nowrap overflow-hidden max-w-[90%] text-gray-600">
                              {quiz.question}
                            </div>
                            <div
                              className="question__setting ml-1 text-xl cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation(); // Предотвращаем всплытие
                                setActiveMenu((prev) =>
                                  prev === index ? null : index
                                );
                              }}
                            >
                              <HiOutlineDotsVertical />
                            </div>
                            {activeMenu === index && (
                              <div
                                className="dropdown__list-settings duration-300 hover:text-red-700 cursor-pointer text-sm absolute p-3 bg-white text-red-500 rounded right-3 -bottom-6 z-30"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteHandler(index);
                                }}
                              >
                                <FaTrashCan />
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            <div
              onClick={clearQuizesHandler}
              className="clear__btn px-3 py-1 mb-5 text-sm duration-300 inline-block text-white bg-red-500 mx-3 rounded cursor-pointer"
            >
              Очистить
            </div>
          </div>
        ) : (
          <span className="pl-3 text-gray-500 mt-3 flex">
            Вопросов пока нет...
          </span>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
