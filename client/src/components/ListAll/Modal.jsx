import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

import Attempts from "../../hoc/Attempts/Attempts";

export default function ListofStudentsModal({ isOpen, onClose, item }) {
  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-10 focus:outline-none"
      onClose={() => false}
    >
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-[rgba(0,0,0,.2)]">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md rounded-xl bg-white p-6 duration-300 ease-out shadow-xl">
            <DialogTitle
              as="h1"
              className="text-2xl font-medium text-black mb-2"
            >
              Назначить попытки студенту: {item?.name + " " + item?.surname}
            </DialogTitle>
            <Attempts student_id={item?.id} />
            <button
              className="p-2 bg-red-500 text-white rounded-lg mt-2"
              onClick={onClose}
            >
              Закрыть
            </button>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
