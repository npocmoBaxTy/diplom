import "./../TestCreate.css";
import { LuText } from "react-icons/lu";
import { FaRegImage } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import { Tab, TabGroup, TabList, TabPanels, TabPanel } from "@headlessui/react";
import InputField from "./InputField/InputField";

const Modal = ({
  show,
  showHandler,
  quizes,
  setQuizes,
  onQuestionsLoaded,
  setCurrent,
}) => {
  const textTypeAdd = () => {
    const uniqueId = uuidv4();
    const uniqueId1 = uuidv4();
    const uniqueId2 = uuidv4();
    const uniqueId3 = uuidv4();
    const uniqueId4 = uuidv4();
    const items = [...quizes];
    items.push({
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
    });
    setQuizes(items);
    setCurrent(quizes.length - 1);
  };

  const imgTypeAdd = () => {
    const uniqueId = uuidv4();
    const uniqueId1 = uuidv4();
    const uniqueId2 = uuidv4();
    const uniqueId3 = uuidv4();
    const uniqueId4 = uuidv4();
    const items = [...quizes];
    items.push({
      id: uniqueId,
      type: "image",
      question: Math.random(1, 100),
      img: [],
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
    });
    setQuizes(items);
    setCurrent(quizes.length - 1);
  };

  return (
    <div
      className={`modal__new fixed justify-center items-center w-full h-full bg-[rgba(0,0,0,0.4)] z-50 top-0 ${
        show ? "active" : "hidden"
      }`}
      onClick={showHandler}
    >
      <div
        className={`modal__new-content w-[30%] flex-col p-10 shadow-2xl bg-white rounded ${
          show ? "flex" : "hidden"
        }`}
      >
        <TabGroup onClick={(e) => e.stopPropagation()}>
          <TabList
            className={
              "flex items-center justify-center gap-4 mb-5 text-sm text-gray-600"
            }
          >
            <Tab
              className={
                "data-[selected]:border-b data-[selected]:pb-2 data-[selected]:border-black duration-100 "
              }
            >
              Добавить вопрос
            </Tab>
            <Tab
              className={
                "data-[selected]:border-b data-[selected]:pb-2 data-[selected]:border-black duration-100 "
              }
            >
              Считать из файла
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <div className="modal-content__title text-gray-500">
                Выберите тип вопроса!
              </div>
              <div className="modal-content__types flex items-center gap-2 mt-2 text-gray-700">
                <div
                  className="types-item flex items-center text-sm p-2 rounded bg-[#b5ddfc] cursor-pointer duration-300 hover:text-teal-700"
                  onClick={() => {
                    textTypeAdd();
                    showHandler();
                  }}
                >
                  <LuText />
                  <span className="ml-1">Текстовый</span>
                </div>
                <div
                  className="types-item flex items-center text-sm p-2 rounded bg-[#e6cef3] cursor-pointer duration-300 hover:text-teal-700"
                  onClick={() => {
                    imgTypeAdd();
                    showHandler();
                  }}
                >
                  <FaRegImage />
                  <span className="ml-1">Картинка</span>
                </div>
              </div>
            </TabPanel>
            <TabPanel>
              <div class="sm:col-span-6">
                <label
                  for="cover-photo"
                  class="block text-sm font-medium text-gray-700"
                >
                  {" "}
                  Загрузить файл{" "}
                </label>
                <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div class="space-y-1 text-center">
                    <svg
                      class="mx-auto h-12 w-12 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>

                    <div class="flex text-sm text-gray-600">
                      <label
                        for="file-upload"
                        class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
                        <span>Upload a file</span>
                        <InputField onQuestionsLoaded={onQuestionsLoaded} />
                      </label>
                      <p class="pl-1">or drag and drop</p>
                    </div>
                    <p class="text-xs text-gray-500">
                      .txt, .docx, .xlsx up to 10MB
                    </p>
                  </div>
                </div>
              </div>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
};

export default Modal;
