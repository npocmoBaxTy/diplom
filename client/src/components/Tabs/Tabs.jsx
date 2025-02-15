import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import History from "../History/Histroy";
import StudentList from "../ListAll/ListofStudents";
import MyTests from "../MyTests/MyTests";

export default function TabsCustom({ user, history }) {
  return (
    <TabGroup className={"p-5"}>
      <TabList className="flex gap-4">
        <Tab
          key={"profile__tab"}
          className="rounded py-1 px-3 text-sm/6 font-semibold text-blue-500 focus:outline-none data-[selected]:bg-blue-500 data-[selected]:text-white  data-[focus]:outline-1 data-[focus]:outline-white"
        >
          Профиль
        </Tab>
        <Tab
          key={"rating__tab"}
          className="rounded py-1 px-3 text-sm/6 font-semibold text-blue-500 focus:outline-none data-[selected]:bg-blue-500 data-[selected]:text-white  data-[focus]:outline-1 data-[focus]:outline-white"
        >
          {user.role === "student" ? "Рейтинг" : "Мои тесты"}
        </Tab>
        <Tab
          key={"history__tab"}
          className="rounded py-1 px-3 text-sm/6 font-semibold text-blue-500 focus:outline-none data-[selected]:bg-blue-500 data-[selected]:text-white  data-[focus]:outline-1 data-[focus]:outline-white"
        >
          {user.role === "student" ? "История" : "Список студентов"}
        </Tab>
      </TabList>
      <TabPanels className="mt-3 shadow-lg border-2 rounded-lg border-gray-100">
        <TabPanel key={"profile_tab"} className="rounded-xl p-3">
          <h3 className="profile__tab-title border-b-2 pb-3 text-2xl">
            Персональная информация
          </h3>
          <div className="profile__tab-table p-2">
            <div className="profile__tab-name">
              <div className="flex gap-4 items-center border-b-2 border-gray-200 py-3">
                <span className="text-lg font-bold">Имя:</span>
                <span className="text-lg font-bold text-gray-700">
                  {user.name}
                </span>
              </div>
              <div className="flex gap-4 items-center border-b-2 border-gray-200 py-3">
                <span className="text-lg font-bold">Фамилия:</span>
                <span className="text-lg font-bold text-gray-700">
                  {user.surname}
                </span>
              </div>
              <div className="flex gap-4 items-center border-b-2 border-gray-200 py-3">
                <span className="text-lg font-bold">Роль:</span>
                <span className="text-lg font-bold text-gray-700">
                  {user.role}
                </span>
              </div>
              <div className="flex gap-4 items-center border-b-2 border-gray-200 py-3">
                <span className="text-lg font-bold">Почта:</span>
                <span className="text-lg font-bold text-gray-700">
                  {user.email}
                </span>
              </div>
              <div className="flex gap-4 items-center border-b-2 border-gray-200 py-3">
                <span className="text-lg font-bold">Группа:</span>
                <span className="text-lg font-bold text-gray-700">
                  {user.groups}
                </span>
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel key={"raiting_tab"} className="rounded-xl p-3">
          {user.role === "student" ? (
            <div className="profile__tab-title">raiting</div>
          ) : (
            <MyTests />
          )}
        </TabPanel>
        <TabPanel key={"history_tab"} className="rounded-xl p-3">
          {user.role === "student" ? (
            <History arr={history} />
          ) : (
            <StudentList />
          )}
        </TabPanel>
      </TabPanels>
    </TabGroup>
  );
}
