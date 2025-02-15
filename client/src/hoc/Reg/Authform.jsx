import React from "react";
import { NavLink } from "react-router-dom";

export default function AuthForm({
  formData,
  isLoading,
  handleChange,
  handleSubmit,
  isReturningUser,
}) {
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col w-full h-full pb-6 text-center bg-white rounded-3xl"
    >
      <h3 className="mb-3 text-4xl font-extrabold text-dark-grey-900">
        Авторизация
      </h3>
      <p className="text-grey-700">Введите email и пароль</p>

      <div className="flex items-center my-5">
        <hr className="h-0 border-b border-solid border-grey-500 grow" />
        <hr className="h-0 border-b border-solid border-grey-500 grow" />
      </div>
      <label htmlFor="email" className="mb-2 text-sm text-start text-grey-900">
        Эл.почта<span className="text-red-500">*</span>
      </label>
      <input
        id="email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="mail@loopple.com"
        className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
      />
      <label
        htmlFor="password"
        className="mb-2 text-sm text-start text-grey-900"
      >
        Пароль<span className="text-red-500">*</span>
      </label>
      <input
        id="password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Введите пароль!"
        className="flex items-center w-full px-5 py-4 mb-5 mr-2 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
      />
      {isReturningUser && (
        <p className="text-green-500 mb-3 text-sm">
          Данные автоматически заполнены
        </p>
      )}
      <div className="flex ml-auto flex-row justify-between mb-8">
        <NavLink
          to="/forgot-password"
          className="mr-4 text-sm font-medium text-purple-blue-500"
        >
          Забыли пароль?
        </NavLink>
      </div>
      <button
        disabled={isLoading}
        className="w-full disabled:bg-gray-500 flex justify-center px-6 py-5 mb-5 text-sm font-bold leading-none text-white transition duration-300 md:w-96 rounded-2xl hover:bg-purple-blue-600 focus:ring-4 focus:ring-purple-blue-100 bg-purple-blue-500"
      >
        {isLoading ? (
          <svg
            className="text-gray-300 animate-spin"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
          >
            <path
              d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        ) : (
          "Войти"
        )}
      </button>
      <p className="text-sm leading-relaxed text-grey-900">
        Нету аккаунта ещё?{" "}
        <NavLink to="/" className="font-bold text-grey-700">
          Зарегестрироваться
        </NavLink>
      </p>
    </form>
  );
}
