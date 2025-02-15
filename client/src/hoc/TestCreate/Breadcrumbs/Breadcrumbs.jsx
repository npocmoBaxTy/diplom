import React from "react";
import Logo from "./../../../components/Logo/Logo";
import { NavLink } from "react-router-dom";
import "./../TestCreate.css";

const Breadcrumbs = ({ name, setShow }) => {
  return (
    <div className="breadcrumbs flex items-center text-gray-600 font-semibold text-xs py-3 w-1/6 overflow-hidden pr-2">
      <NavLink
        to={"/main"}
        className={
          "text-sm flex items-center mr-1 hover:underline duration-300"
        }
      >
        <Logo mini={true} />
      </NavLink>
      <span> {">"} </span>
      <div
        className={
          "text-sm flex items-center mr-1 hover:underline duration-300 cursor-pointer "
        }
        onClick={setShow}
      >
        <span className="ml-1 text-ellipsis block mr-2 w-full">{name}</span>
      </div>
    </div>
  );
};

export default Breadcrumbs;
