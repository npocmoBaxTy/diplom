import React from "react";
import { NavLink } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <div className="mt-auto">
      <footer class="footer p-4 bg-white shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800">
        <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2024{" "}
          <NavLink to="#" class="hover:underline" target="_blank">
            Mephi™
          </NavLink>
          . Все права защищены.
        </span>
        <ul class="footer__list flex flex-wrap items-center mt-3 sm:mt-0">
          <li>
            <NavLink
              to="#"
              class="mr-4 text-sm text-gray-500 hover:underline md:mr-6 dark:text-gray-400"
            >
              О нас
            </NavLink>
          </li>
          <li>
            <NavLink
              to="#"
              class="mr-4 text-sm text-gray-500 hover:underline md:mr-6 dark:text-gray-400"
            >
              Соглашение
            </NavLink>
          </li>
          <li>
            <NavLink
              to="#"
              class="mr-4 text-sm text-gray-500 hover:underline md:mr-6 dark:text-gray-400"
            >
              Лицензия
            </NavLink>
          </li>
        </ul>
      </footer>
    </div>
  );
}
