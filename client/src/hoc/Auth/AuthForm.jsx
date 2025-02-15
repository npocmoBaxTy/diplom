import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import InputField from "./InputField";
import ComboboxCustom from "./../../components/Combobox/Combobox";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { NavLink } from "react-router-dom";

export default function AuthForm() {
  const url = process.env.REACT_APP_SERVER_URL;
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    surname: "",
    thirdName: "",
    groups: "",
    role: "student",
  });

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateEmail(formData.email)) {
      toast.error("Неверный формат электронной почты!");
      return;
    }
    if (!formData.groups) {
      toast.error("Вы не выбрали группу!");
      return;
    }

    try {
      const { data } = await axios.get(`${url}/users?email=${formData.email}`);
      if (data.exists) {
        toast.error("Пользователь с таким email уже существует!");
        document.querySelector("#email").focus();
        return;
      }

      await axios.post(`${url}/users`, formData);
      toast.success("Пользователь успешно создан!");
    } catch (error) {
      console.error("Ошибка при регистрации:", error);
      toast.error("Произошла ошибка!");
    }
  };

  return (
    <form
      className="flex flex-col w-full h-full pb-6 text-center bg-white rounded-3xl"
      onSubmit={handleSubmit}
    >
      <h3 className="mb-3 text-4xl font-extrabold text-dark-grey-900">
        Регистрация
      </h3>
      <p className="mb-4 text-grey-700">Заполните все поля</p>

      <div className="flex items-center mb-3">
        <hr className="h-0 border-b border-solid border-grey-500 grow" />
        <hr className="h-0 border-b border-solid border-grey-500 grow" />
      </div>
      <div className="full__name flex w-full">
        <div className="w-full flex flex-col items-start">
          <label
            for="surname"
            className="mb-2 font-bold text-sm text-start text-grey-900"
          >
            Ваша Фамилия*
          </label>
          <div className="surname-wrapper flex items-center relative w-full">
            <input
              id="surname"
              type="text"
              required
              placeholder="Иванов"
              onChange={(e) =>
                setFormData({ ...formData, surname: e.target.value })
              }
              className="flex items-center w-full px-5 py-4 mb-5 mr-2 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
            />
          </div>
        </div>
        <div className="w-full flex flex-col items-start">
          <label
            for="name"
            className="mb-2 font-bold text-sm text-start text-grey-900"
          >
            Ваше Имя*
          </label>
          <div className="name-wrapper flex items-center relative w-full">
            <input
              id="name"
              type="text"
              required
              placeholder="Иван"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="flex items-center w-full px-5 py-4 mb-5 mr-2 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
            />
          </div>
        </div>
      </div>
      <label
        for="thirdName"
        className="mb-2 font-bold text-sm text-start text-grey-900"
      >
        Ваше Отчество*
      </label>
      <input
        id="thirdName"
        type="text"
        onChange={(e) =>
          setFormData({ ...formData, thirdName: e.target.value })
        }
        placeholder="Иванович"
        required
        className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-5 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
      />
      <label
        for="email"
        className="mb-2 font-bold text-sm text-start text-grey-900"
      >
        Эл.почта*
      </label>
      <input
        id="email"
        type="email"
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="mail@loopple.com"
        required
        className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-5 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
      />
      <label
        for="password"
        className="mb-2 font-bold text-sm text-start text-grey-900"
      >
        Пароль*
      </label>
      <div className="password-wrapper flex items-center relative">
        <input
          id="password"
          required
          type={show ? "text" : "password"}
          placeholder="Enter a password"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className="flex items-center w-full px-5 py-4 mb-5 mr-2 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
        />

        <span
          className="absolute mb-5 right-5 cursor-pointer"
          onClick={() => setShow(!show)}
        >
          {show ? <FaEye /> : <FaEyeSlash />}
        </span>
      </div>
      <label
        for="password"
        className="mb-2 font-bold text-sm text-start text-grey-900"
      >
        Выберите группу*
      </label>
      <div className="password-wrapper flex-wrap  flex items-center relative">
        <ComboboxCustom
          selectedValue={(value) => setFormData({ ...formData, groups: value })}
          selected={formData.groups}
        />
      </div>
      <div className="button-wrapper relative">
        <button className="w-full px-6 py-5 mb-5 text-sm font-bold leading-none text-white transition duration-300 md:w-96 rounded-2xl hover:bg-purple-blue-600 focus:ring-4 focus:ring-purple-blue-100 bg-blue-500">
          Регистрация
        </button>
      </div>
      <p className="text-sm leading-relaxed text-grey-900">
        Уже есть аккаунт?{" "}
        <NavLink
          className={"font-bold duration-300 hover:text-blue-500"}
          to={"/signin"}
        >
          Войти
        </NavLink>
      </p>
    </form>
  );
}
