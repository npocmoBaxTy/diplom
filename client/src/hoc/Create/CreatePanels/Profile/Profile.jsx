import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

const Profile = () => {
  const user = useSelector((state) => state.login.curUser);
  const [username, setUsername] = useState(user.name);
  const [surname, setSurname] = useState(user.surname);
  const [email, setEmail] = useState(user.email);
  useEffect(() => {}, [user]);
  return (
    <div className="profile__info-change p-5">
      <h1 className="profile__title text-4xl text-gray-700 mb-4">
        Информация о вас!
      </h1>
      <div className="profile__name text-md mb-3 text-gray-700">
        Ваше Имя :{" "}
        <input
          type="text"
          className="border-b-2 ml-1 w-96 bg-gray-50 p-1 outline-none text-black"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="profile__surname text-md mb-3 text-gray-700">
        Ваша Фамилия :{" "}
        <input
          type="text"
          className="border-b-2 w-96 ml-1 bg-gray-50 p-1 outline-none text-black"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
        />
      </div>
      <div className="profile__surname text-md mb-3 text-gray-700">
        Ваш E-mail :{" "}
        <input
          type="text"
          className="border-b-2 ml-1 w-96 bg-gray-50 p-1 outline-none text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="profile__image flex items-center gap-3 mt-8 overflow-hidden pb-4">
        <span className="text-gray-700 mb-2">Ваша Фотография :</span>
        <div className="w-40 shadow-xl rounded-full mb-2">
          <img
            className="default__profile-img w-40 rounded-full"
            src="https://img.freepik.com/free-vector/astronaut-playing-planet-ball-cartoon-vector-icon-illustration_138676-3477.jpg?t=st=1729020987~exp=1729024587~hmac=5d4e3f0ecc4986765dba29263f9ef87f0776241fc101f196948b035498c118e6&w=826"
            alt="user"
          />
        </div>
      </div>
      <div class="sm:col-span-6">
        <label
          for="cover-photo"
          class="block text-sm font-medium text-gray-700"
        >
          {" "}
          Загрузить фото{" "}
        </label>
        <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div class="space-y-1 text-center">
            <svg
              class="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <div class="flex text-sm text-gray-600">
              <label
                for="file-upload"
                class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
              >
                <span>Upload a file</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  class="sr-only"
                />
              </label>
              <p class="pl-1">or drag and drop</p>
            </div>
            <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>
      </div>
      <div className="profile__btns flex gap-3 items-center mt-5">
        <button className="px-3 shadow-md border-0 outline-none py-2 rounded-md bg-teal-700 text-white text-sm">
          Сохранить
        </button>
      </div>
    </div>
  );
};

export default Profile;
