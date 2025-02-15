import React, { useEffect, useState } from "react";
import "./ListOfStudents.css";
import { PiCaretUpDownThin } from "react-icons/pi";
import ListofStudentsModal from "./Modal";
import { IoMdShare } from "react-icons/io";
import { MdOutlineEdit } from "react-icons/md";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaFilter } from "react-icons/fa";
import { FaSortAmountDown } from "react-icons/fa";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [curItem, setCurItem] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Текущая страница
  const [studentsPerPage, setStudentsPerPage] = useState(10); // Количество студентов на странице
  const [selected, setSelected] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const openModal = (item) => {
    setIsModalOpen(true);
    setCurItem(item);
  };

  const closeModal = () => setIsModalOpen(false);

  const searchHandler = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/api/students`
        );
        if (!response.ok) {
          throw new Error("Ошибка при получении данных");
        }
        const data = await response.json();
        setStudents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [students]);

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelected([]); // Снимаем выделение со всех
    } else {
      const currentStudentsIds = currentStudents.map((student) => student.id);
      setSelected(currentStudentsIds); // Выбираем всех на текущей странице
    }
    setSelectAll(!selectAll);
  };

  const toggleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id)); // Убираем из выбранных
    } else {
      setSelected([...selected, id]); // Добавляем в выбранные
    }
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  const filteredStudents = students.filter((student) => {
    const fullName = `${student.name} ${student.surname}`.toLowerCase();
    return (
      fullName.includes(search.toLowerCase()) ||
      student.groups?.toLowerCase().includes(search.toLowerCase()) ||
      student.email?.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Логика пагинации
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  const perPageHandler = (ind) => {
    if (ind > 0) {
      setStudentsPerPage(ind);
      setCurrentPage(1);
    }
  };

  return (
    <div className="user__page-list bg-[#f7f8fe] min-h-[100vh]">
      <form
        className="students__list-search p-1 mb-2 flex items-center justify-between"
        onSubmit={searchHandler}
      >
        <input
          type="text"
          className="w-1/3 p-2 border rounded-md outline-none text-sm"
          placeholder="Поиск по имени или группе студента"
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="add__member cursor-pointer text-blue-500 font-semibold">
          + Добавить
        </div>
      </form>
      <div className="table__filter px-3 flex items-center mb-5 gap-4">
        <div className="selected text-sm flex items-center">
          <input
            type="checkbox"
            className="mr-1"
            name="all-check"
            id="all-check"
            checked={selectAll}
            onChange={toggleSelectAll}
          />{" "}
          <span>{selected.length} выбрано</span>
        </div>
        <div className="share flex items-center text-gray-600 cursor-pointer gap-1 text-sm duration-300 hover:text-gray-900">
          <IoMdShare />
          Поделиться
        </div>
        <div className="edit flex items-center text-gray-600 cursor-pointer gap-1 text-sm duration-300 hover:text-gray-900">
          <MdOutlineEdit />
          Изменить
        </div>
        <div className="delete flex items-center text-gray-600 cursor-pointer gap-1 text-sm duration-300 hover:text-gray-900">
          <FaRegTrashCan />
          Удалить
        </div>
        <div className="options ml-auto flex items-center gap-3">
          <div className="filter flex items-center text-gray-600 cursor-pointer gap-1 text-sm duration-300 hover:text-gray-900">
            <FaFilter /> Фильтры
          </div>
          <div className="sort flex items-center text-gray-600 cursor-pointer gap-1 text-sm duration-300 hover:text-gray-900">
            <FaSortAmountDown />
            Сортировать
          </div>
        </div>
      </div>
      <table className="min-w-full border bg-white shadow-md">
        <thead className="border-b-gray-100 border-b">
          <tr>
            <th
              scope="col"
              className="text-sm text-gray-900 px-6 py-4 text-left"
            >
              {" "}
            </th>
            <th
              scope="col"
              className="text-sm text-gray-700 px-6 py-4 text-left cursor-pointer"
            >
              ID <PiCaretUpDownThin className="inline" />
            </th>
            <th
              scope="col"
              className=" items-center text-sm text-gray-900 px-6 py-4 text-left cursor-pointer"
            >
              <span>Имя</span> <PiCaretUpDownThin className="inline" />
            </th>
            <th
              scope="col"
              className="text-sm font-bold text-gray-900 px-6 py-4 text-left cursor-pointer"
            >
              Группа <PiCaretUpDownThin className="inline" />
            </th>
            <th
              scope="col"
              className="text-sm font-bold text-gray-900 px-6 py-4 text-left cursor-pointer"
            >
              Эл.Почта <PiCaretUpDownThin className="inline" />
            </th>
            <th
              scope="col"
              className="text-sm font-bold text-gray-900 px-6 py-4 text-left "
            >
              Информация
            </th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {currentStudents?.map((student, index) => (
            <>
              <ListofStudentsModal
                isOpen={isModalOpen}
                onClose={closeModal}
                item={curItem}
              />

              <tr className={`border-b duration-300 hover:bg-gray-50`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <input
                    type="checkbox"
                    name=""
                    id=""
                    checked={selected.includes(student.id)}
                    onChange={() => toggleSelect(student.id)}
                    className="border-gray-300"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {index + 1}
                </td>
                <td className="text-sm text-gray-900 font-semibold px-6 py-4 whitespace-nowrap">
                  <img
                    src="https://img.freepik.com/free-vector/astronaut-playing-planet-ball-cartoon-vector-icon-illustration_138676-3477.jpg?t=st=1729020987~exp=1729024587~hmac=5d4e3f0ecc4986765dba29263f9ef87f0776241fc101f196948b035498c118e6&w=826"
                    alt=""
                    className="w-10 h-10 rounded-full inline mr-2"
                  />
                  {student.name + " " + student.surname}
                </td>
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  {student.groups}
                </td>
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  {student.email}
                </td>
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => {
                      openModal(student);
                    }}
                    className={"px-2 py-1 rounded bg-teal-700 text-white"}
                  >
                    Подробнее
                  </button>
                </td>
              </tr>
            </>
          ))}
        </tbody>
      </table>

      <div className="flex items-center gap-3 bg-white p-3 shadow-md border border-t-0 text-sm w-full">
        <div className="how-much-show text-sm">
          <span className="text-gray-600">Кол.во</span>{" "}
          <input
            type="number"
            className="border rounded ml-1 px-1 outline-none w-16"
            value={studentsPerPage}
            onChange={(e) => perPageHandler(e.target.value)}
          />
        </div>
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-1 mx-1 disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          &lt;
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={`text-sm px-3 rounded py-0.5 ${
              currentPage === index + 1
                ? "text-blue-500 border border-blue-500"
                : "text-gray-700"
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-1 mx-1 cursor-pointer disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default StudentList;
