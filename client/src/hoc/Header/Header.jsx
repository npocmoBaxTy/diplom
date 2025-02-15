import React from "react";
import { BsInfoSquareFill } from "react-icons/bs";
import { FaHome, FaPhoneVolume } from "react-icons/fa";
import { LuCrown } from "react-icons/lu";
import { NavLink } from "react-router-dom";
import Logo from "../../components/Logo/Logo";
import Profile from "../../components/Profile/Profile";
import Search from "../../components/Search/Search";
import "./Header.css";

export default function Header() {
  return (
    <div className="header flex items-center shadow-lg p-6">
      <div className="big__logo">
        <Logo />
      </div>
      <div className="mini_logo">
        <Logo mini />
      </div>
      <Search />
      <ul className="header__menu-list flex items-center gap-5 ml-10">
        <NavLink
          className={"text-lg duration-300 text-[#457f8d] hover:text-blue-900"}
        >
          <FaHome />
        </NavLink>
        <NavLink
          className={"text-lg duration-300 text-[#457f8d] hover:text-blue-900"}
        >
          <BsInfoSquareFill />
        </NavLink>
        <NavLink
          className={"text-lg duration-300 text-[#457f8d] hover:text-blue-900"}
        >
          <LuCrown />
        </NavLink>
        <NavLink
          className={"text-lg duration-300 text-[#457f8d] hover:text-blue-700"}
        >
          <FaPhoneVolume />
        </NavLink>
      </ul>
      <Profile />
    </div>
  );
}
