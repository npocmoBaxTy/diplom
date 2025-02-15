import React, { useEffect, useState } from "react";
import { FaPen, FaTrash } from "react-icons/fa";
import "./Modal.css"; // Подключаем стили
import { v4 as uuidv4 } from "uuid";

const Modal = ({ isOpen, onClose, item }) => {
  const [isVisible, setIsVisible] = useState(isOpen);
  const [newName, setNewName] = useState(item?.name);
  const [newTime, setNewTime] = useState(item ? item.time_limit : "12");
  const [selectedAnswers, setSelectedAnswers] = useState([]); // Для отслеживания выбранных ответов
  const [questionsData, setQuestionsData] = useState([]); // Состояние для хранения данных вопросов

  const updateQuestionsData = async () => {
    if (!isOpen || !item) return null;
    try {
      const response = await fetch(
        "http://localhost:8080/api/update-questions",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: item.id,
            creator_id: item.creator_id,
            questions: JSON.stringify(questionsData),
            name: newName,
            time_limit: newTime,
            total_questions: questionsData.length,
          }),
        }
      );

      if (response.ok) {
        console.log("Questions updated successfully!");
      } else {
        console.error("Failed to update questions");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (item) {
      const data = item.questions.map((question) => ({
        text: question.question,
        answers: question.answers?.map((response) => ({
          id: response.id,
          text: response.text,
          ...(response.correct && { correct: true }),
        })),
      }));

      setQuestionsData(data);
      setSelectedAnswers(
        data.map((q) => q.answers.findIndex((answer) => answer.correct) || -1)
      );
      setNewTime(item.time_limit);
      setNewName(item.name);
    } else {
      setQuestionsData([]);
      setSelectedAnswers([]);
    }
  }, [item]);

  const updateQuestion = (index, updatedQuestionText) => {
    setQuestionsData((prevQuestionsData) => {
      const updatedQuestionsData = [...prevQuestionsData];
      updatedQuestionsData[index].text = updatedQuestionText;
      return updatedQuestionsData;
    });
  };

  const updateAnswer = (questionIndex, answerIndex) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[questionIndex] = answerIndex;
    setSelectedAnswers(newSelectedAnswers);

    setQuestionsData((prevQuestionsData) => {
      const updatedQuestionsData = [...prevQuestionsData];
      updatedQuestionsData[questionIndex].answers = updatedQuestionsData[
        questionIndex
      ].answers.map((response, idx) => ({
        text: response.text,
        ...(idx === answerIndex ? { correct: true } : {}),
      }));
      return updatedQuestionsData;
    });
  };

  const showInputHandler = (id) => {
    const input = document.getElementById(`input-${id}`);
    input.classList.toggle("hidden");
  };

  const showAnswerHandler = (id, id2) => {
    const input = document.getElementById(`input-answer-${id}`);
    input.classList.toggle("hidden");
  };

  const clearAllInputHandler = () => {
    if (item) {
      setQuestionsData(item.questions);
    }
  };

  const showNameInputHandler = () => {
    const input = document.getElementById("input-name");
    input.classList.toggle("hidden");
  };

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setTimeout(() => {
        setIsVisible(false);
      }, 200);
    }
  }, [isOpen]);

  const deleteQuestion = (index) => {
    setQuestionsData((prev) => {
      const updatedQuestions = [...prev];
      updatedQuestions.splice(index, 1);
      return updatedQuestions;
    });
  };

  const addNewQuestion = () => {
    setQuestionsData((prev) => [
      ...prev,
      {
        question: "New Test",
        id: uuidv4(),
        responses: [
          { text: "New Answer1", correct: false },
          { text: "New Answer2", correct: true },
          { text: "New Answer3", correct: false },
          { text: "New Answer4", correct: false },
        ],
      },
    ]);
  };
  console.log(item);
  if (!isVisible) return null;
  return (
    <div className={`modal-background ${isOpen ? "active" : ""}`}>
      <div
        className={`modal ${
          isOpen ? "active" : ""
        } bg-white rounded-lg shadow-lg p-5 max-h-[90vh] w-2/3 overflow-y-scroll`}
      >
        <div className="flex justify-start mb-5">
          <button
            onClick={() => {
              onClose();
              updateQuestionsData();
            }}
            className="bg-teal-800 mr-5 text-white p-2 rounded-md mt-3"
          >
            Сохранить и выйти
          </button>
          <button
            onClick={() => {
              onClose();
              clearAllInputHandler();
            }}
            className="bg-gray-500 text-white p-2 rounded-md mt-3"
          >
            Закрыть
          </button>
        </div>
        <div className="modal__title flex items-center justify-between">
          <div className="text-3xl font-semibold flex items-center">
            {newName}
            <input
              type="text"
              id="input-name"
              className="border-b-2 border-black w-96 hidden outline-none ml-2 text-lg"
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Введите новое название теста!"
            />
            <span className="text-sm cursor-pointer ml-2">
              <FaPen onClick={showNameInputHandler} />
            </span>
            <span className="text-sm text-gray-400 ml-2">
              ({item?.created_at.slice(0, 10)})
            </span>
          </div>
          <span className="px-2">
            Время:
            <input
              type="number"
              className="w-12 border-b-2 mx-2 border-black outline-none"
              value={newTime}
              onChange={(event) => setNewTime(event.target.value)}
            />
            мин
          </span>
        </div>
        {item.questions.map((question, questionIndex) => (
          <div
            className="modal__question duration-300 p-2 border-2 rounded-lg my-3 w-full"
            key={questionIndex}
          >
            <div className="question__title text-lg inline-flex items-center  justify-between w-full">
              <div className="flex items-center gap-1">
                <span>
                  {questionIndex + 1}. {question.question}
                </span>
                <input
                  type="text"
                  id={`input-${question.id}`}
                  className="border-b-2 border-black w-96 hidden outline-none"
                  placeholder="Введите новый вопрос!"
                  onChange={(e) =>
                    updateQuestion(questionIndex, e.target.value)
                  }
                />
                <span className="text-sm cursor-pointer ">
                  <FaPen onClick={() => showInputHandler(questionIndex)} />
                </span>
              </div>
              <span>
                <FaTrash
                  onClick={() => deleteQuestion(questionIndex)}
                  className="text-red-600  cursor-pointer ml-auto trash-icon opacity-0 duration-200"
                />
              </span>
            </div>
            <div className="answers">
              {question.answers.map((answer, index) => (
                <div
                  key={index}
                  className="answer p-2 my-1 rounded bg-gray-200 duration-300 hover:bg-gray-400 flex items-center"
                >
                  <input
                    type="radio"
                    className="mr-1"
                    name={`answer-${answer.id}`}
                    checked={selectedAnswers[questionIndex] === index}
                    onChange={() => updateAnswer(questionIndex, index)}
                  />
                  {answer.text}
                  <input
                    type="text"
                    id={`input-answer-${answer.id}`}
                    className="border-b-2 border-black w-96 hidden outline-none ml-1"
                    placeholder="Введите новый Ответ!"
                    onChange={(e) => {
                      const updatedQuestions = [...questionsData];
                      updatedQuestions[questionIndex].answers[index] = {
                        text: e.target.value,
                      };
                      setQuestionsData(updatedQuestions);
                    }}
                  />
                  <span className="text-sm cursor-pointer ml-1.5 answer-pen duration-300 text-gray-700">
                    <FaPen onClick={() => showAnswerHandler(answer.id)} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="flex w-full">
          <button
            className="bg-blue-500 text-white p-1.5 text-sm rounded-md mt-2"
            onClick={addNewQuestion}
          >
            Добавить вопрос
          </button>
        </div>
        <div className="flex justify-end mb-5">
          <button
            onClick={() => {
              onClose();
              updateQuestionsData();
            }}
            className="bg-teal-800 mr-5 text-white p-2 rounded-md mt-3"
          >
            Сохранить и выйти
          </button>
          <button
            onClick={() => {
              onClose();
              clearAllInputHandler();
            }}
            className="bg-gray-500 text-white p-2 rounded-md mt-3"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
