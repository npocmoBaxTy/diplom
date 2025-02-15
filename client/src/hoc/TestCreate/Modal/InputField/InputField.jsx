import React from "react";
import { v4 as uuidv4 } from "uuid";
import mammoth from "mammoth";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

const InputField = ({ onQuestionsLoaded }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Берём первый файл из input

    if (file) {
      // Проверяем тип файла и передаем его на соответствующую обработку
      if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        // Чтение из Word (.docx)
        parseQuestionsFromWord(file, onQuestionsLoaded);
      } else if (file.type === "text/plain") {
        // Чтение из текстового файла (.txt)
        parseQuestionsFromFile(file, onQuestionsLoaded);
      } else if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        // Чтение из Excel (.xlsx)
        parseExcelFile(file, onQuestionsLoaded);
      } else {
        console.error("Неподдерживаемый формат файла:", file.type);
      }
    } else {
      console.error("Файл не выбран!");
    }
  };

  // txt File Reader
  const parseQuestionsFromFile = (file, onQuestionsParsed) => {
    const reader = new FileReader();

    reader.onload = () => {
      const fileContent = reader.result;

      if (!fileContent) {
        console.error("Файл пустой или не был прочитан");
        return;
      }

      const lines = fileContent.split("\n");

      // Теперь проверяем, что каждая строка не пуста
      const questions = [];
      let currentQuestion = null;

      lines.forEach((line, index) => {
        line = line.trim();
        if (line.startsWith("Вопрос")) {
          if (currentQuestion) {
            questions.push(currentQuestion);
          }
          currentQuestion = {
            question: line.slice(line.indexOf(":") + 1).trim(),
            answers: [],
            type: "text",
            id: uuidv4(),
          };
        } else if (line) {
          currentQuestion.answers.push({
            text: line.includes("*")
              ? line.slice(line.indexOf("*") + 1).trim()
              : line,
            id: uuidv4(),
            correct: line.includes("*") ? true : false, // Здесь можно добавить логику для правильных ответов
          });
        }
      });

      // Не забываем добавить последний вопрос в список
      if (currentQuestion) {
        questions.push(currentQuestion);
      }

      onQuestionsParsed(questions);
    };

    reader.onerror = () => {
      console.error("Ошибка чтения файла");
    };

    reader.readAsText(file);
  };

  // Функция для обработки Word файла
  const parseQuestionsFromWord = (file, onQuestionsParsed) => {
    const reader = new FileReader();

    reader.onload = () => {
      const fileContent = reader.result;
      if (!fileContent) {
        console.error("Файл пустой или не был прочитан");
        return;
      }

      mammoth
        .extractRawText({ arrayBuffer: fileContent })
        .then((result) => {
          const lines = result.value.split("\n");
          const questions = [];
          let currentQuestion = null;

          lines.forEach((line) => {
            line = line.trim();
            if (line.startsWith("Вопрос")) {
              if (currentQuestion) {
                questions.push(currentQuestion);
              }
              currentQuestion = {
                question: line.slice(line.indexOf(":") + 1).trim(),
                answers: [],
                type: "text",
                id: uuidv4(),
              };
            } else if (line) {
              currentQuestion.answers.push({
                text: line.includes("*")
                  ? line.slice(line.indexOf("*") + 1).trim()
                  : line,
                id: uuidv4(),
                correct: line.includes("*") ? true : false,
              });
            }
          });

          if (currentQuestion) {
            questions.push(currentQuestion);
          }

          onQuestionsParsed(questions);
        })
        .catch((err) => {
          console.error("Ошибка чтения Word файла", err);
          toast.error("Проверьте пожалуйста ваш файл!");
        });
    };

    reader.onerror = () => {
      console.error("Ошибка чтения файла");
    };

    reader.readAsArrayBuffer(file);
  };

  //Excel FileReader
  const parseExcelFile = (file, onQuestionsParsed) => {
    const reader = new FileReader();

    reader.onload = () => {
      const fileContent = reader.result;
      if (!fileContent) {
        console.error("Файл пустой или не был прочитан");
        return;
      }

      const workbook = XLSX.read(fileContent, { type: "array" });
      const sheetName = workbook.SheetNames[0]; // Берём первый лист
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Преобразуем в массив

      const questions = [];

      // Перебираем данные, начиная с 2 строки (первая строка - заголовки)
      for (let i = 1; i < data.length; i++) {
        const uniqueId = uuidv4();
        const [question, answer1, answer2, answer3, answer4, correctAnswer] =
          data[i];
        const answers = [
          {
            text: answer1,
            correct: answer1 === correctAnswer,
            id: `${uniqueId}-${answer1}`,
          },
          {
            text: answer2,
            correct: answer2 === correctAnswer,
            id: `${uniqueId}-${answer2}`,
          },
          {
            text: answer3,
            correct: answer3 === correctAnswer,
            id: `${uniqueId}-${answer3}`,
          },
          {
            text: answer4,
            correct: answer4 === correctAnswer,
            id: `${uniqueId}-${answer4}`,
          },
        ];

        const questionData = {
          id: uniqueId,
          type: "text",
          question: question,
          answers: answers,
        };

        questions.push(questionData);
      }

      onQuestionsParsed(questions); // Передаем обработанные данные
    };

    reader.onerror = () => {
      console.error("Ошибка чтения файла");
    };

    reader.readAsArrayBuffer(file); // Чтение файла
  };
  return (
    <input
      id="file-upload"
      name="file-upload"
      type="file"
      class="sr-only"
      accept="text/plain,.docx,.xlsx"
      onChange={handleFileChange}
    />
  );
};
export default InputField;
