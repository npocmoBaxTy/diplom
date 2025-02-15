import "./../Create.css";
import { useSelector } from "react-redux";
import { Tab, TabList } from "@headlessui/react";
import Logo from "./../../../components/Logo/Logo";
import Profile from "./../../../components/Profile/Profile";
import { NavLink } from "react-router-dom";
import { LuClipboardPen } from "react-icons/lu";
import { HiMiniUsers } from "react-icons/hi2";
import { FaListCheck } from "react-icons/fa6";
import { BsCloudPlus } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa";
const CreateSidebar = () => {
  const user = useSelector((state) => state.login.curUser);

  return (
    <aside className="create__wrapper-nav fixed h-[100vh] shrink-0 flex gap-2 flex-col items-center p-10 bg-[#fff]">
      <TabList className={"sidebar-tab-list flex flex-col gap-2"}>
        <NavLink
          to="/main"
          className="sidebar__logo p-2 py-5 border-b-2 flex justify-center w-[80%] mb-2"
        >
          <Logo mini={true} />
        </NavLink>
        <Tab
          className={
            "py-4 rounded-md duration-300 hover:text-black  data-[selected]:bg-white"
          }
        >
          <FaRegUser />
        </Tab>
        <Tab
          className={
            "py-4 rounded-md duration-300 hover:text-black   data-[selected]:bg-white"
          }
        >
          <FaListCheck />
        </Tab>
        {user.role === "student" ? null : (
          <Tab
            className={
              "py-4 rounded-md duration-300 hover:text-black  data-[selected]:bg-white"
            }
          >
            <HiMiniUsers />
          </Tab>
        )}
        {user.role === "student" ? null : (
          <Tab
            className={
              "py-4 rounded-md duration-300 hover:text-black  data-[selected]:bg-white"
            }
          >
            <LuClipboardPen />
          </Tab>
        )}
        {user.role === "student" ? null : (
          <NavLink
            to="/main/tests/create"
            className={
              "to__create py-4 rounded-md duration-300 hover:text-black  data-[selected]:bg-white"
            }
          >
            <BsCloudPlus />
          </NavLink>
        )}
      </TabList>
      <div className="mt-auto border-0 flex w-full justify-center">
        <Profile mini={true} />
      </div>
    </aside>
  );
};

export default CreateSidebar;
