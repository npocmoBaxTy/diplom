require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const port = process.env.PORT;
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const testResultsRouter = require("./routes/testResultRouter");
const testsRouter = require("./routes/testsRouter");
const attemptsRoutes = require("./routes/attempts");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const allowedOrigins = [process.env.LOCALHOST_PORT, process.env.ORIGIN_PROT];

app.use(cors("*"));
app.use(express.json());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVICE, // ваш хост smtp,
  port: 465,
  secure: true, // true для порта 465 // true для порта 465, false для других портов
  auth: {
    user: process.env.EMAIL_USER, // ваш email
    pass: process.env.EMAIL_PASSWORD, // ваш пароль
  },
});
const rateLimit = require("express-rate-limit");
// Настройка ограничения запросов
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // Максимум 100 запросов с одного IP
  message: "Слишком много запросов с этого IP, попробуйте позже",
});
app.use("/send-code", limiter);

let verCode = null;

app.get("/api/students", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, email, name, surname, groups FROM users WHERE role = $1",
      ["student"]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Ошибка при получении студентов:", error);
    res.status(500).send("Ошибка сервера");
  }
});

app.post("/send-code", async (req, res) => {
  const { email } = req.body;
  const confirmationCode = crypto.randomInt(1000, 9999).toString();
  verCode = confirmationCode;
  if (!email) {
    return res.status(400).send({ message: "Email обязателен" });
  }
  const mailOptions = {
    from: "zbp2303@mail.ru",
    to: email,
    subject: "Ваш код подтверждения",
    text: `Ваш код подтверждения: ${confirmationCode}`,
  };

  try {
    const query = "SELECT * FROM users WHERE email = $1";
    const result = await pool.query(query, [email]);
    if (result.rows.length > 0) {
      // Если email найден, отправляем код на email
      res.status(200).json({
        exists: true,
        message: "email отправлен",
        code: confirmationCode,
      });
      await transporter.sendMail(mailOptions);
    } else {
      // Если email не найден
      res.status(200).json({
        exists: false,
        message: "email не найден!",
      });
    }
  } catch (error) {
    console.error("Ошибка при отправке email:", error);
    res.status(500).send({ message: "Ошибка при отправке email" });
  }
});

app.post("/verify-code", (req, res) => {
  const { code } = req.body;

  if (code === verCode) {
    return res.json({ valid: true });
  }
  return res.json({ valid: false });
});

app.get("/users", async (req, res) => {
  const email = req.query.email;
  // Логика для проверки существования пользователя
  try {
    const result = await pool.query(
      "SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)",
      [email]
    );
    // result.rows[0].exists вернет true или false
    res.json({ exists: result.rows[0].exists });
  } catch (err) {
    console.error("Ошибка при выполнении запроса:", err);
    res.status(500).json({ message: "Ошибка при обращении к базе данных" });
  }
});

const validateEmail = (email) => {
  return validator.isEmail(email);
};
app.post("/users", async (req, res) => {
  const { email, password, name, surname, thirdName, groups, role } = req.body;
  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }
  try {
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // SQL запрос для вставки данных
    const result = await pool.query(
      `INSERT INTO users (email, password, name, surname, thirdName, groups, role)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [email, hashedPassword, name, surname, thirdName, groups, role]
    );
    const userId = result.rows[0].id; // Получаем id нового пользователя

    // Добавление записи в таблицу attempts
    await pool.query(
      "INSERT INTO attempts (user_id, test_id, attempts) SELECT $1, t.id, 1 FROM tests t",
      [userId]
    );
    res.status(201).json({ user: result.rows[0] });
  } catch (error) {
    console.error("Error saving user to the database:", error);
    res.status(500).json({ message: "Error saving user to the database" });
  }
});

const jwtSecret = process.env.JWT_SECRET;

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  try {
    // Проверяем, существует ли пользователь
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    // Проверяем пароль
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Генерируем JWT токен
    const token = jwt.sign(
      {
        userId: user.rows[0].id,
        email: user.rows[0].email,
        role: user.rows[0].role,
      },
      jwtSecret,
      { expiresIn: "1h" } // Токен будет действовать 1 час
    );

    // Возвращаем токен клиенту
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Error during login" });
  }
});

app.post("/change-pass", async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    // Генерация хеша для нового пароля
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Запрос на обновление пароля пользователя в БД (PostgreSQL)
    const query = "UPDATE users SET password = $1 WHERE email = $2";
    const values = [hashedPassword, email];

    await pool.query(query, values);

    res.json({ success: true });
  } catch (err) {
    console.error("Ошибка при смене пароля:", err);
    res.status(500).json({ success: false });
  }
});
app.post("/get-user", async (req, res) => {
  const { email } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
app.post("/api/saveResult", async (req, res) => {
  const {
    userId,
    testId,
    score,
    totalQuestions,
    correctAnswers,
    completed,
    test_name,
  } = req.body;

  // Проверяем, существует ли уже запись для данного пользователя и теста
  const checkQuery = `
			SELECT * FROM test_results 
			WHERE user_id = $1 AND test_id = $2
	`;
  const checkValues = [userId, testId];

  try {
    const checkResult = await pool.query(checkQuery, checkValues);
    if (checkResult.rowCount > 0) {
      // Если запись существует, обновляем ее
      const updateQuery = `
							UPDATE test_results
							SET score = $1, total_questions = $2, correct_answers = $3, completed = $4
							WHERE user_id = $5 AND test_id = $6
					`;
      const updateValues = [
        score,
        totalQuestions,
        correctAnswers,
        completed,
        userId,
        testId,
      ];

      await pool.query(updateQuery, updateValues);
      return res.status(200).send("Результат успешно обновлён.");
    } else {
      // Если записи нет, создаем новую
      const insertQuery = `
							INSERT INTO test_results (user_id, test_id, score, total_questions, correct_answers, completed, test_name)
							VALUES ($1, $2, $3, $4, $5, $6,$7)
					`;
      const insertValues = [
        userId,
        testId,
        score,
        totalQuestions,
        correctAnswers,
        completed,
        test_name,
      ];
      await pool.query(insertQuery, insertValues);
      return res.status(201).send("Результат успешно сохранён.");
    }
  } catch (error) {
    console.error("Ошибка при сохранении или обновлении результата:", error);
    res.status(500).send("Ошибка сервера.");
  }
});
app.use("/api", testResultsRouter);
app.get("/api/test-results", async (req, res) => {
  try {
    const results = await pool.query(`
      SELECT 
        tr.id, 
        tr.user_id, 
        u.name || ' ' || u.surname AS user_name, 
        tr.test_id,
        tr.groups, 
        t.name AS test_name, 
        tr.score, 
        tr.total_questions, 
        tr.correct_answers, 
        tr.start_time, 
        tr.end_time, 
        tr.completed 
      FROM test_results tr
      JOIN users u ON tr.user_id = u.id
      JOIN tests t ON tr.test_id = t.id
      ORDER BY tr.start_time DESC
    `);

    res.json(results.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

app.use("/api", testsRouter);

//Добавление нового теста
app.post("/api/quiz-add", async (req, res) => {
  const {
    uid,
    created_by,
    creator_id,
    questions,
    name,
    time_limit,
    total_questions,
  } = req.body;

  try {
    // Вставка нового теста
    const result = await pool.query(
      `INSERT INTO tests (uid, created_by, creator_id, questions, name, time_limit, total_questions)
       VALUES ($1, $2, $3, $4::jsonb, $5, $6, $7)
       ON CONFLICT (uid) 
       DO UPDATE SET 
         created_by = EXCLUDED.created_by,
         creator_id = EXCLUDED.creator_id,
         questions = EXCLUDED.questions,
         name = EXCLUDED.name,
         time_limit = EXCLUDED.time_limit,
         total_questions = EXCLUDED.total_questions
       RETURNING id`,
      [
        uid,
        created_by,
        creator_id,
        questions,
        name,
        time_limit,
        total_questions,
      ]
    );

    if (result.rowCount === 1) {
      const testId = result.rows[0].id;

      // После добавления нового теста вставляем записи в таблицу attempts с 0 попытками для всех пользователей
      if (result.command === "INSERT") {
        // Проверка, что это был INSERT, а не UPDATE
        const usersResult = await pool.query("SELECT id FROM users");
        const userIds = usersResult.rows.map((user) => user.id);

        const attemptsInsertQuery = userIds
          .map((userId) => `(${userId}, ${testId}, 0)`)
          .join(",");

        await pool.query(`
          INSERT INTO attempts (user_id, test_id, attempts)
          VALUES ${attemptsInsertQuery}
        `);
      }

      res.status(200).send({ message: "Test added or updated successfully" });
    } else {
      res.status(404).send({ error: "Something went wrong!" });
    }
  } catch (error) {
    console.error("Error adding or updating test:", error);
    res.status(500).send({ error: error.message });
  }
});

app.put("/api/update-questions", async (req, res) => {
  const { id, creator_id, questions, name, time_limit, total_questions } =
    req.body;

  try {
    const result = await pool.query(
      `UPDATE tests 
             SET questions = $1::jsonb, 
                 name = $2, 
                 time_limit = $3,
                 total_questions = $4
             WHERE id = $5 AND creator_id = $6`,
      [questions, name, time_limit, total_questions, id, creator_id]
    );

    if (result.rowCount === 1) {
      res.status(200).send({ message: "Test updated successfully" });
    } else {
      res.status(404).send({ error: "Test not found or unauthorized" });
    }
  } catch (error) {
    console.error("Error updating test:", error);
    res.status(500).send({ error: "Failed to update test" });
    if (error.code === "23505") {
      // Код ошибки для нарушения уникальности в PostgreSQL
      res.status(400).send({
        error: "Test name already exists. Please choose a different name.",
      });
    } else {
      res.status(500).send({ error: error.message });
    }
  }
});

app.use("/api/attempts", attemptsRoutes);
app.put("/api/reduceAttempt", async (req, res) => {
  const { userId, testId } = req.body; // Получаем userId и testId из запроса

  try {
    // Выполняем SQL-запрос для обновления количества попыток
    const result = await pool.query(
      "UPDATE attempts SET attempts = attempts - 1 WHERE user_id = $1 AND test_id = $2 RETURNING *",
      [userId, testId]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Attempt not found");
    }

    res.send("Attempt reduced successfully");
  } catch (error) {
    console.error("Error updating attempt:", error);
    res.status(500).send("Server error");
  }
});
app.post("/api/addAttempts", async (req, res) => {
  const { userId, testId, attempts } = req.body;
  try {
    const result = await pool.query(
      "UPDATE attempts SET attempts = GREATEST($1,0) WHERE user_id = $2 AND test_id = $3 RETURNING *",
      [attempts, userId, testId]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update attempts" });
  }
});

// Настройка body parser для обработки данных формы (для поля questionId)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Настройка хранилища для Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads");
    cb(null, uploadPath); // Указываем папку для сохранения
  },
  filename: (req, file, cb) => {
    // Генерируем уникальное имя файла
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname); // Извлекаем расширение файла
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

// Настройка Multer
const upload = multer({ storage });

// Эндпоинт для загрузки файлов
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Файл не загружен." });
    }

    const filePath = `/uploads/${req.file.filename}`; // Путь к файлу

    // Возвращаем путь к загруженному файлу
    res.status(200).json({ filePath });
  } catch (error) {
    console.error("Ошибка при загрузке файла:", error);
    res.status(500).json({ error: "Ошибка при загрузке файла." });
  }
});
//Удаление файла
app.delete("/api/delete", (req, res) => {
  const { filePath } = req.body;

  if (!filePath) {
    return res.status(400).send("Путь к файлу не предоставлен");
  }

  const absolutePath = path.join(__dirname, filePath);
  fs.unlink(absolutePath, (err) => {
    if (err) {
      console.error("Ошибка при удалении файла:", err);
      return res.status(500).send("Ошибка удаления файла");
    }

    res.status(200).send("Файл успешно удалён");
  });
});
// Сделать папку uploads доступной для клиентов
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
