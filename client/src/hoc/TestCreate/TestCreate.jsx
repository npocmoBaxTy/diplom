import React, { useState, useEffect } from "react";
import "./TestCreate.css";
import Sidebar from "./Sidebar/Sidebar";
import NewHeader from "./newHeader/NewHeader";
import { TabGroup } from "@headlessui/react";
import Question from "./Question/Question";
import Modal from "./Modal/Modal";
import Settings from "./Settings/Settings";
import { useSelector } from "react-redux";
import GlobalSettings from "./GlobalSettings/GlobalSettings";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setCurTest } from "./../../Store/Slices/ChangeTestSlice";
import { v4 as uuidv4 } from "uuid";

const TestCreate = () => {
  const user = useSelector((state) => state.login.curUser);
  const test = useSelector((state) => state.changeTest.item);
  const [current, setCurrent] = useState(0); // Начальный индекс первого вопроса
  const [open, setOpen] = useState(false);
  const [quizes, setQuizes] = useState(test ? test : []);
  const [name, setName] = useState(test ? test.name : "My new Form 1");
  const [time, setTime] = useState(test ? test.time_limit : 10);
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (test) {
      setQuizes(test.questions || []);
      setName(test.name || "My new Form 1");
      setTime(test.time_limit || 10);
    }
  }, [test]);

  const updateQuizes = (questions) => {
    setQuizes((prevQuizes) => [...prevQuizes, ...questions]); // Добавляем новые вопросы
  };

  //Question: Изменение вопроса конкретного
  const updateQuizHandler = (index, updatedQuiz) => {
    const updatedQuizes = [...quizes];
    updatedQuizes[index] = updatedQuiz;
    setQuizes(updatedQuizes); // обновляем состояние
  };

  const setCurrentQuestionHandler = (index) => {
    setCurrent(index); // Обновляем индекс текущего вопроса
  };

  const openHandler = () => {
    setOpen(!open);
  };

  // Функция для обновления типа текущего вопроса
  const updateQuestionType = (newType) => {
    const updatedQuizes = [...quizes];
    if (updatedQuizes[current]) {
      updatedQuizes[current] = {
        ...updatedQuizes[current], // Создаем копию текущего вопроса
        type: newType, // Обновляем тип
        img: newType === "image" ? [] : undefined, // Добавляем или удаляем свойство img
      };

      setQuizes(updatedQuizes);
    }
  };

  const clearQuizesHandler = () => {
    setQuizes([]);
    localStorage.removeItem("quizes");
  };

  const postToDataBase = async () => {
    if (quizes.length === 0) {
      toast.error("Нет вопросов! Добавьте хотя бы один вопрос.");
      return;
    }
    quizes.forEach((element, index) => {
      if (element.type === "image" && element.img.length === 0) {
        toast.error(`Вопрос под номером ${index} не имеет картинок`);
        return false;
      }
    });

    try {
      const response = await fetch("http://localhost:8080/api/quiz-add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: test ? test.uid : uuidv4(),
          created_by: user.name + " " + user.surname,
          creator_id: user.id,
          questions: JSON.stringify(quizes),
          name: name,
          time_limit: time,
          total_questions: quizes.length,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Тест успешно опубликован!", data);
        setQuizes([]);
        setName("My new Form 1");
      } else {
        toast.error("Используйте другое название теста.");
      }
    } catch (error) {
      console.error("Ошибка:", error);
      toast.error("Ошибка при добавлении теста. ", error);
    }

    dispatch(setCurTest(null));
    setName("My new Form 1");
  };

  const nameChangeHandler = (text) => {
    setName(text);
  };

  const timeChangeHandler = (time) => {
    if (time > 0) {
      setTime(time);
    } else {
      return false;
    }
  };

  return (
    <div className="new__test-wrapper relative overflow-hidden">
      <GlobalSettings
        name={name}
        setName={nameChangeHandler}
        time={time}
        setTime={timeChangeHandler}
        isOpen={show}
        setOpen={setShow}
      />
      <TabGroup>
        <NewHeader
          name={name}
          setShow={() => setShow(true)}
          postToDataBase={postToDataBase}
        />
        <Modal
          show={open}
          showHandler={openHandler}
          quizes={quizes}
          setQuizes={setQuizes}
          setCurrent={setCurrent}
          onQuestionsLoaded={updateQuizes}
        />
        <div className="main flex items-stretch">
          <Sidebar
            quizes={quizes}
            setQuizes={setQuizes}
            currentHandler={setCurrentQuestionHandler} // Передаем обработчик
            setCurrent={setCurrent}
            current={current}
            clearQuizesHandler={clearQuizesHandler}
          />
          <Question
            addQuestionHandler={openHandler}
            ind={current}
            quizes={quizes}
            updateQuizHandler={updateQuizHandler}
            setShow={() => setShow(true)}
            time={time}
            setQuizes={setQuizes}
            name={name}
          />
          <div className="navbar w-[20%]">
            <Settings
              currentQuestion={quizes[current]}
              updateQuestionType={updateQuestionType}
            />
          </div>
        </div>
      </TabGroup>
    </div>
  );
};
export default TestCreate;
