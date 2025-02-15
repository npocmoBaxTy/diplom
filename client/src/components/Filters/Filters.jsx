import React, { useState, useEffect } from "react";
import { FaSortAmountDown } from "react-icons/fa";
import { FaFilter } from "react-icons/fa";
import { RiLayoutGridFill } from "react-icons/ri";
import { RiLayoutGrid2Fill } from "react-icons/ri";

export default function Filters({ sortby }) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  // Обработчик для переключения состояния выпадающего меню
  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  // Закрыть выпадающее меню при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest("#menu-button") &&
        !event.target.closest("#dropdown-menu")
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="main__content-filters mb-3 flex items-center flex-wrap w-full">
      <div className="filters__content relative p-2 flex items-center gap-4 w-full">
        <div className="sort_by_name flex items-center cursor-pointer p-2 border border-gray-300 rounded">
          <FaSortAmountDown className="mr-1 text-gray-700" />
          <span className="text-sm text-gray-700" onClick={sortby}>
            Сортировать по
          </span>
        </div>
        <div className="sort flex items-center cursor-pointer p-2 border border-gray-300 rounded">
          <FaFilter className="mr-1 text-gray-700" />
          <span className="text-sm text-gray-700">Фильтры</span>
        </div>
        <div className="filters flex items-center cursor-pointer">
          <div className="relative inline-block text-left">
            <div>
              <button
                type="button"
                className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                id="menu-button"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
                onClick={toggleDropdown}
              >
                Статус
                <svg
                  className="-mr-1 h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {/* Выпадающее меню */}
            <div
              id="dropdown-menu"
              className={`absolute z-10 mt-2 left-0 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition-all ${
                isDropdownOpen ? "block" : "hidden"
              }`}
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
            >
              <div className="py-1" role="none">
                <div
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-all"
                  role="menuitem"
                >
                  Завершенные
                </div>
                <div
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-all"
                  role="menuitem"
                >
                  Незавершенные
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid-filters ml-auto flex items-center gap-2 cursor-pointer">
          <span>
            <RiLayoutGridFill />
          </span>
          <span>
            <RiLayoutGrid2Fill />
          </span>
        </div>
      </div>
    </div>
  );
}
