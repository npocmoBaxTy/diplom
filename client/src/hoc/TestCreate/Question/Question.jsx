import { IoSettingsOutline } from "react-icons/io5";
import { VscArrowSmallRight } from "react-icons/vsc";
import "./Question.css";
import { AiOutlinePlusCircle } from "react-icons/ai";
import React from "react";
import axios from "axios";

const Question = ({
  addQuestionHandler,
  quizes,
  setQuizes,
  ind,
  updateQuizHandler,
  setShow,
  time,
}) => {
  const question = quizes[ind];
  console.log("question", question);

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("questionId", question.id); // Передаем questionId

      try {
        const response = await fetch("http://localhost:8080/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          // Если ответ не успешный, пытаемся распарсить его как JSON
          const errorData = await response.json();
          console.error("Ошибка загрузки изображения:", errorData.error);
          alert(`Ошибка: ${errorData.error}`);
          return;
        }

        // Если ответ успешный
        const data = await response.json();
        console.log("Файл загружен:", data.filePath);

        // Обновление состояния
        setQuizes((prev) =>
          prev.map((q) =>
            q.id === question.id ? { ...q, img: [...q.img, data.filePath] } : q
          )
        );
      } catch (error) {
        console.error("Ошибка:", error);
        alert("Произошла ошибка при загрузке изображения.");
      }
    }
  };

  if (!question) {
    return (
      <div className="add__content w-[60%] px-4 py-1 rounded-md inline-block text-sm text-gray-500">
        <div className="question__header bg-gray-100 p-2 rounded-md flex items-center">
          <div className="px-2 border-r border-r-gray-300 inline-block">
            <button
              onClick={addQuestionHandler}
              className="add__content px-4 py-1 border border-gray-300 rounded-md inline-block text-sm text-gray-700 cursor-pointer hover:bg-gray-300 duration-300"
            >
              + Добавить вопрос
            </button>
          </div>
          <div
            className="settings ml-3 cursor-pointer text-gray-600 text-xl"
            onClick={setShow}
          >
            <IoSettingsOutline />
          </div>
          <div className="time block ml-auto mr-3">Время: {time}</div>
        </div>
        Добавьте вопрос...
      </div>
    );
  }
  const handleUpdate = (field, value) => {
    const updatedQuiz = { ...question, [field]: value };
    updateQuizHandler(ind, updatedQuiz);
  };

  const handleAnswerChange = (i) => {
    const updatedAnswers = question.answers.map((item) => {
      if (item.id === i) {
        return { ...item, correct: true }; // Для выбранного ответа устанавливаем correct: true
      }
      return { ...item, correct: false }; // Для остальных ответов устанавливаем correct: false
    });
    handleUpdate("answers", updatedAnswers); // Обновляем массив ответов в родительском компоненте
  };

  const handleTextAnswerChange = (i, value) => {
    const updatedAnswers = question.answers.map((item, index) => {
      if (index === i) {
        return { ...item, text: value }; // Для текстового ответа устанавливаем text: value
      }
      return item;
    });
    handleUpdate("answers", updatedAnswers); // Обновляем массив ответов в родительском компоненте
  };

  const removeImage = async (questionId, imageIndex) => {
    const imagePath = question.img[imageIndex];

    try {
      await axios.delete("http://localhost:8080/api/delete", {
        data: { filePath: imagePath },
      });

      setQuizes((prevQuizes) =>
        prevQuizes.map((quiz) =>
          quiz.id === questionId
            ? {
                ...quiz,
                img: quiz.img.filter((_, index) => index !== imageIndex),
              }
            : quiz
        )
      );
    } catch (error) {
      console.error("Ошибка удаления изображения:", error);
    }
  };
  return (
    <div className="question w-[60%] py-3 px-2 relative overflow-hidden text-gray-700">
      <div className="question__header bg-gray-100 p-2 rounded-md flex items-center">
        <div className="px-2 border-r border-r-gray-300 inline-block">
          <button
            onClick={addQuestionHandler}
            className="add__content px-4 py-1 border border-gray-300 rounded-md inline-block text-sm text-gray-700 cursor-pointer hover:bg-gray-300 duration-300"
          >
            + Добавить вопрос
          </button>
        </div>
        <div
          className="settings ml-3 cursor-pointer text-gray-600 text-xl"
          onClick={setShow}
        >
          <IoSettingsOutline />
        </div>
        <div className="time block ml-auto mr-3">Время: {time}</div>
      </div>
      <div className="question__content mt-10 p-4 border rounded-md flex flex-col items-center justify-center">
        <div className="question__content-inner w-[60%] mx-auto">
          <div className="question__text flex items-center max-w-md -ml-4">
            <span className="flex items-center">
              {ind + 1}. <VscArrowSmallRight />{" "}
            </span>
            <textarea
              value={question.question}
              onChange={(e) => handleUpdate("question", e.target.value)}
              className="w-full p-2 rounded focus:outline-none resize-none"
              rows={question.question.length > 40 ? 3 : 1}
              style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}
            />
          </div>
          <div className="question__img-wrapper relative flex items-center overflow-hidden gap-2 flex-wrap">
            {question.img ? (
              <>
                {question.img.map((img, index) => (
                  <div className="question__img flex flex-col text-center">
                    <div className="img-options flex justify-center">
                      <span
                        onClick={() => removeImage(question.id, index)}
                        className="text-sm block relative duration-300 hover:text-gray-800 text-gray-600 cursor-pointer"
                      >
                        Удалить
                      </span>
                    </div>
                    <img
                      src={
                        img.preview
                          ? img.preview
                          : `http://localhost:8080${img}`
                      }
                      alt="груженное изображение"
                      className="w-40 h-40 border rounded"
                    />
                  </div>
                ))}
              </>
            ) : null}
            {question.img ? (
              <form
                onClick={(e) => {}}
                encType="multipart/form-data" // Добавляем этот атрибут
                className="question__img-add flex items-center relative justify-center text-4xl text-blue-400 border border-blue-300 rounded h-32 w-32 cursor-pointer duration-300 hover:bg-blue-200"
              >
                <AiOutlinePlusCircle />
                <input
                  type="file"
                  className="absolute w-full h-full left-0 opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />
              </form>
            ) : null}
          </div>
          <div className="question__answers flex flex-col gap-2 mt-4">
            {question.answers.map((answer, index) => (
              <div
                className="answer flex items-center border border-gray-200 p-2 rounded"
                key={index}
              >
                <input
                  type="radio"
                  name={`answer-${ind}`}
                  id={answer.id}
                  checked={answer.correct}
                  onChange={() =>
                    handleAnswerChange(answer.id, "correct", true)
                  }
                />
                <input
                  type="text"
                  value={answer.text}
                  placeholder="Введите ваш ответ"
                  className="ml-1 w-full outline-none text-gray-700"
                  onChange={(e) =>
                    handleTextAnswerChange(index, e.target.value)
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Question;
