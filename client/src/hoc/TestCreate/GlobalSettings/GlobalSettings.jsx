import React from "react";
import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { toast } from "react-toastify";

const GlobalSettings = ({ setName, setTime, time, name, isOpen, setOpen }) => {
  function close() {
    if (name === "") {
      toast.error("Введите название теста");
    } else {
      setOpen(false);
    }
  }
  return (
    <>
      <Dialog
        open={isOpen}
        as="div"
        className="relative z-50 focus:outline-none"
        onClose={close}
      >
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black/30">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl bg-white shadow-md p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <DialogTitle
                as="h3"
                className="text-base/7 font-medium text-gray-700 mb-4"
              >
                Изменить настройки
              </DialogTitle>
              <div className="flex flex-col gap-4">
                <label htmlFor="test__name">
                  <span className="text-sm text-gray-700">
                    Название теста:{" "}
                  </span>
                  <input
                    type="text"
                    name="test__name"
                    className="border rounded border-gray-200 px-2 outline-none bg-transparent ml-1"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>
                <label htmlFor="test__time">
                  <span className="text-sm text-gray-700">
                    Длительность теста:{" "}
                  </span>
                  <input
                    type="number"
                    name="test__time"
                    className="border rounded border-gray-200 px-2 outline-none bg-transparent ml-1"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </label>
              </div>
              <div className="mt-4">
                <Button
                  className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                  onClick={close}
                >
                  Сохранить
                </Button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default GlobalSettings;
