import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { PencilIcon } from "@heroicons/react/16/solid";
import React, { useEffect, useState } from "react";
import { FaUserAstronaut } from "react-icons/fa";
import { RxExit } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import {
  loggedIn,
  setCurEmail,
  setCurUser,
} from "../../Store/Slices/LoginSlice";
import "./Profile.css";
import { MdOutlineCreateNewFolder } from "react-icons/md";

export default function Profile({ mini }) {
  const email = useSelector((state) => state.login.curEmail);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const url = process.env.REACT_APP_SERVER_URL;
  useEffect(() => {
    // Функция для получения информации о пользователе
    const fetchUserInfo = async () => {
      if (!email) return; // Проверяем, что email существует

      try {
        const response = await fetch(`${url}/get-user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        if (response.ok) {
          const data = await response.json();
          setUserInfo(data);
          dispatch(setCurUser(data));
          setError("");
        } else {
          setUserInfo(null);
          setError("User not found");
        }
      } catch (err) {
        console.error("Error fetching user info:", err);
        setError("An error occurred");
      }
    };
    fetchUserInfo();
  }, [email, dispatch]);
  const navigate = useNavigate();
  const exitHandler = () => {
    localStorage.removeItem("token");
    dispatch(setCurEmail(null));
    dispatch(loggedIn(false));
    navigate("/");
  };

  return (
    <div className="header__profile-wrapper ml-auto">
      {userInfo ? (
        <div className="header__profile-inner flex items-center">
          <div className="text-right">
            <Menu>
              <MenuButton className="inline-flex items-center rounded-md py-1.5 px-3 text-sm/6 font-semibold data-[focus]:outline-1 data-[focus]:outline-white">
                <div className="profile__avatar flex items-ce">
                  <div className="profile__default-avatar p-4 rounded-full text-xl mr-3 bg-gray-50 text-[#457f8d] shadow-md">
                    <FaUserAstronaut />
                  </div>
                </div>
                {mini ? null : (
                  <div className="profile__inner-names">
                    <span className="profile__names-name mr-1">
                      {userInfo.name}
                    </span>
                    <span className="profile__names-name">
                      {userInfo.surname[0].toUpperCase() + "."}
                    </span>
                  </div>
                )}
              </MenuButton>

              <MenuItems
                transition
                anchor="bottom end"
                className="w-52 mt-2 rounded-xl border border-white/5 bg-gray-50 shadow-md p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
              >
                <MenuItem>
                  <NavLink
                    to="/main/profile"
                    className="group text-black flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-gray-500"
                  >
                    <PencilIcon className="size-4 fill-black" />
                    Профиль
                  </NavLink>
                </MenuItem>
                {userInfo.role === "teacher" ? (
                  <MenuItem>
                    <NavLink
                      to="/main/tests/create"
                      className="group text-black flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-gray-500"
                    >
                      <MdOutlineCreateNewFolder />
                      Создать Тест
                    </NavLink>
                  </MenuItem>
                ) : null}
                <MenuItem>
                  <button
                    onClick={exitHandler}
                    className="group text-black flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-gray-500"
                  >
                    <RxExit />
                    Выход
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      ) : (
        !error && <NavLink to={"/signin"}>Войти</NavLink>
      )}
    </div>
  );
}
