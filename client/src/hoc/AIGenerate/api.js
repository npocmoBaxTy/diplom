import axios from "axios";

const generateQuiz = async () => {
  try {
    const response = await axios.post(
      "https://api.deepai.org/api/text-generator",
      {
        text: 'Create a quiz about Music with five multiple-choice questions. Example question: What is the name of the note between "do" and "mi"? Options: a) Re, b) Fa, c) Si, d) La, e) Mi. Correct answer: a) Re',
      },
      {
        headers: {
          "Api-Key": "d3a3e91e-097a-4f07-a1bd-0a6bff00f95f", // Указываем свой ключ API
        },
      }
    );
    console.log(response.data);
  } catch (error) {
    console.error("Error generating text:", error);
  }
};

generateQuiz();
