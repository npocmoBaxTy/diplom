import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ChangePass from "../../components/ChangePass/ChangePass";
import VerificationCodeInput from "../../components/VerCodeInput/VerCodeInput";
import {
  changePassEmailHandler,
  changeVerifyCodeHandler,
} from "../../Store/Slices/LoginSlice";
import "./Forgot.css";

export default function Forgot() {
  const url = process.env.REACT_APP_SERVER_URL;
  const dispatch = useDispatch();
  const change = useSelector((state) => state.login.changePass);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(null);
  const status = useSelector((state) => state.login.changePassEmailStatus);
  const verifyCode = useSelector((state) => state.login.verifyCodeStatus);
  const [setVerificationCode] = useState("");

  const handleCodeChange = (code) => {
    setVerificationCode(code);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = Math.floor(1000 + Math.random() * 9000);
    try {
      const token = localStorage.getItem("jwtToken"); // Пример получения токена
      const response = await fetch(`${url}/send-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        Authorization: token ? `Bearer ${token}` : "",
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();
      if (data.exists) {
        setCode(data.code);
        toast.success(" Код успешно отправлен! ");
        dispatch(changePassEmailHandler(!status));
        dispatch(changeVerifyCodeHandler(!verifyCode));
      } else {
        toast.error("Email не найден!");
      }
    } catch (error) {
      console.error("Ошибка при проверке email:", error);
    }
  };
  useEffect(() => {
    if (code) {
    }
  }, [code]);

  return (
    <div className="forgot__pass flex w-full relative justify-center">
      {change ? <ChangePass email={email} /> : null}
      {status ? (
        <form
          onSubmit={handleSubmit}
          className="forgot__pass-form flex flex-col w-1/3 p-10"
        >
          <h3 className="flex flex-col mb-10 text-center text-4xl font-extrabold text-dark-grey-900 w-full">
            Забыли пароль?
            <span className="text-[16px] text-gray-400">Введите эл.почту</span>
          </h3>
          <>
            <label
              for="email"
              className="mb-2 text-sm text-start text-grey-900"
            >
              Эл.почта<span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="mail@loopple.com"
              className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
            />
            <button className="w-full px-6 py-5 text-sm font-bold leading-none text-white transition duration-300 rounded-2xl hover:bg-blue-600 focus:ring-4 focus:ring-purple-blue-100 bg-purple-blue-500">
              Отправить
            </button>
          </>
        </form>
      ) : null}
      {verifyCode ? (
        <VerificationCodeInput onChange={handleCodeChange} />
      ) : null}
    </div>
  );
}
