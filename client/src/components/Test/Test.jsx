import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getAllAttempts } from "../Attempts/getAttempts";
import Skeleton from "./../Skeleton/Skeleton";
import Timer2 from "./../Timer/Timer";
import MyModal from "./Modal/Modal";
import "./Test.css";

const Test = () => {
  const user = useSelector((state) => state.login.curUser);
  const status = useSelector((state) => state.login.loggedIn);
  const [tests, setTests] = useState([]);
  const { id } = useParams();
  const quiz = tests?.find((test) => test.id === parseInt(id));
  const [show, setShow] = useState(true);
  const [start, setStart] = useState(false);
  const [attempts, setAttempts] = useState(null);
  const url = process.env.REACT_APP_SERVER_URL;
  const setShowHandler = async () => {
    if (attempts[0].attempts > 0) {
      setShow(!show);
      setStart(!start);
      try {
        const response = await fetch(`${url}/api/reduceAttempt`, {
          // Замените на свой API
          method: "PUT", // Или POST, в зависимости от вашего API
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user.id, testId: quiz.id }), // Передайте необходимую информацию
        });

        if (!response.ok) {
          throw new Error("Failed to reduce attempt");
        }

        // Здесь вы можете обновить состояние попыток, если это нужно
        setAttempts((prevAttempts) =>
          prevAttempts.map((attempt) => ({
            ...attempt,
            attempts: attempt.attempts - 1,
          }))
        );
      } catch (error) {
        console.error("Error reducing attempt:", error);
      }
    } else {
      setStart(false);
    }
  };

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await fetch(`${url}/api/tests`);
        if (!response.ok) {
          throw new Error("Failed to fetch tests");
        }
        const data = await response.json();
        setTests(data);
      } catch (error) {
        console.error("Error fetching tests:", error);
      }
    };
    const getAttempts = async () => {
      const data = await getAllAttempts(user?.id, quiz?.id);
      setAttempts(data || []);
    };

    fetchTests();
    getAttempts();
  }, [user?.id, quiz?.id]);

  const [questionIndex, setQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState(
    Array(quiz?.questions.length).fill(null)
  );
  const selectOption = (index) => {
    const newResponses = [...userResponses];
    newResponses[questionIndex] = index;
    setUserResponses(newResponses);
  };

  const next = () => {
    if (questionIndex < quiz?.questions.length) {
      setQuestionIndex(questionIndex + 1);
    }
  };

  const prev = () => {
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
    }
  };

  const score = () => {
    return userResponses.reduce((total, response, idx) => {
      // Проверяем, если пользователь ответил на вопрос и ответ был правильным
      if (response !== null && quiz?.questions[idx].answers[response].correct) {
        return total + 1;
      }
      return total;
    }, 0);
  };

  const saveResult = async (userId, testId) => {
    const scoreValue = score();
    const totalQuestions = quiz?.questions.length;
    const correctAnswers = scoreValue;
    const completed = true;
    const startTime = new Date().toISOString(); // Или используйте другое время начала
    const endTime = new Date().toISOString(); // Или укажите другое время окончания

    const response = await fetch(`${url}/api/saveResult`, {
      // Ваш API для сохранения результата
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        testId,
        score: scoreValue,
        totalQuestions,
        correctAnswers,
        startTime,
        endTime,
        completed,
        test_name: quiz.name,
      }),
    });

    if (response.ok) {
      console.log("Результат успешно сохранён");
    } else {
      console.error("Ошибка при сохранении результата:", response.statusText);
    }
  };
  const navigate = useNavigate();
  const handleComplete = async () => {
    await saveResult(user?.id, quiz?.id); // Передайте userId и testId
    navigate("/main");
    // После сохранения результата вы можете перезагрузить или перенаправить пользователя
  };
  return (
    <section className="quiz__sectioncontainer overflow-hidden w-full min-h-screen flex justify-center items-center">
      {!tests ? <Skeleton /> : null}
      {!start ? (
        <MyModal
          isOpen={show}
          onClose={setShowHandler}
          test={quiz}
          atts={attempts}
        />
      ) : null}
      {start ? (
        <div className="questionBox relative flex items-stretch w-[75%]">
          <Timer2 min={quiz?.time_limit} onComplete={handleComplete} />
          {questionIndex < quiz?.questions.length ? (
            <div className="flex items-stretch relative w-full">
              <div
                className="questionContainer h-full w-80"
                key={questionIndex}
              >
                <header>
                  <h1 className="title is-6">{quiz.name}</h1>
                  <div className="progressContainer">
                    <progress
                      className="progress is-info is-small"
                      value={(questionIndex / quiz?.questions.length) * 100}
                      max="100"
                    >
                      {(questionIndex / quiz?.questions.length) * 100}%
                    </progress>
                    <p>
                      {((questionIndex / quiz?.questions.length) * 100).toFixed(
                        0
                      )}
                      % complete
                    </p>
                  </div>
                </header>
                <h2 className="titleContainer title">
                  {quiz?.questions[questionIndex].question}
                </h2>
                <div className="optionContainer">
                  {quiz.questions[questionIndex].img ? (
                    <div className="question-img pl-3 mt-3 mb-2 mx-auto flex items-center gap-2">
                      {quiz?.questions[questionIndex].img.map((img, index) => (
                        <img
                          key={img}
                          className="w-40 h-40"
                          src={`${url}/${img.path}`}
                          alt={`Question Image ${index + 1}`}
                        />
                      ))}
                    </div>
                  ) : null}
                  {quiz?.questions[questionIndex].answers.map(
                    (response, index) => (
                      <div
                        key={index}
                        className={`option ${
                          userResponses[questionIndex] === index
                            ? "is-selected"
                            : ""
                        }`}
                        onClick={() => selectOption(index)}
                      >
                        {String.fromCharCode(65 + index)}. {response.text}
                      </div>
                    )
                  )}
                </div>
                <footer className="questionFooter">
                  <nav
                    className="pagination"
                    role="navigation"
                    aria-label="pagination"
                  >
                    <button
                      className="button"
                      onClick={prev}
                      disabled={questionIndex < 1}
                    >
                      Back
                    </button>
                    <button
                      className={`button ${
                        userResponses[questionIndex] !== null ? "is-active" : ""
                      }`}
                      onClick={next}
                      disabled={questionIndex >= quiz?.questions.length}
                    >
                      {userResponses[questionIndex] === null ? "Skip" : "Next"}
                    </button>
                  </nav>
                </footer>
              </div>
            </div>
          ) : (
            <div
              key={questionIndex}
              className="quizCompleted has-text-centered"
            >
              <span className="icon">
                <i
                  className={`fa ${
                    score() > 3
                      ? "fa-check-circle-o is-active"
                      : "fa-times-circle"
                  }`}
                ></i>
              </span>
              <h2 className="title">
                You did{" "}
                {score() > 7 ? "an amazing" : score() < 4 ? "a poor" : "a good"}{" "}
                job!
              </h2>
              <p className="subtitle">
                Total score: {score()} / {quiz?.questions.length}
              </p>
              <br />
              <button className="button" onClick={handleComplete}>
                Закончить тест <i className="fa fa-refresh"></i>
              </button>
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
};

export default Test;
