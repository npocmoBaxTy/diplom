import React from "react";
import BreadCrumbs from "./../Breadcrumbs/Breadcrumbs";
import { Tab, TabList } from "@headlessui/react";
import Profile from "./../../../components/Profile/Profile";

const NewHeader = ({ name, setShow, postToDataBase }) => {
  return (
    <div className="header flex items-center text-xs border-b justify-between p-2">
      <BreadCrumbs name={name} setShow={setShow} />
      <TabList className={"flex items-center gap-4 py-3"}>
        <Tab>Create</Tab>
      </TabList>
      <div className="profile flex items-center">
        <div
          onClick={postToDataBase}
          className="publish px-3 py-1 border border-teal-700 rounded mr-2 duration-300 hover:bg-teal-700 hover:text-white cursor-pointer"
        >
          Опубликовать
        </div>
        <Profile mini={true} />
      </div>
    </div>
  );
};

export default NewHeader;
