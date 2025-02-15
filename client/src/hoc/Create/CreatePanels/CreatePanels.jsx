import { TabPanels, TabPanel } from "@headlessui/react";
import Profile from "./Profile/Profile";
import StudentList from "./../../../components/ListAll/ListofStudents";
import MyTests from "./../../../components/MyTests/MyTests";
import TestResults from "./History/History";

const CreatePanels = () => {
  return (
    <TabPanels className="create__wrapper-content w-full flex-grow ml-40">
      <TabPanel className={"p-5 bg-[#f7f8fe] min-h-[100vh]"}>
        <Profile />
      </TabPanel>
      <TabPanel className={"p-5 bg-[#f7f8fe] min-h-[100vh]"}>
        <TestResults />
      </TabPanel>
      <TabPanel className={"p-5 bg-[#f7f8fe] min-h-[100vh]"}>
        <h1 className="text-2xl pl-2 text-gray-500 mb-2">Список Студентов</h1>
        <StudentList />
      </TabPanel>
      <TabPanel className={"p-5 bg-[#f7f8fe] min-h-[100vh]"}>
        <h1 className="text-2xl pl-1 text-gray-500 mb-3">Список Тестов</h1>
        <MyTests />
      </TabPanel>
    </TabPanels>
  );
};

export default CreatePanels;
