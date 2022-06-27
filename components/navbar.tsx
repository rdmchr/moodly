import { NextPage } from "next";
import { FC, useState } from "react";
import CarbonCalendar from "../icons/CarbonCalendar";
import CarbonClose from "../icons/CarbonClose";
import CarbonFaceSatisfiedFilled from "../icons/CarbonFaceSatisfiedFilled";
import CarbonSettings from "../icons/CarbonSettings";

type Props = {
  children?: React.ReactNode;
};

type ModalProps = {
  closeModal: () => void;
  modalState: boolean;
};

const Modal = ({ closeModal, modalState: modalOpen }: ModalProps) => {
  return (
    <div className={`${modalOpen ? "" : "hidden"} absolute w-screen h-screen top-0 left-0 bg-white z-50`}>
      <div>
        <h1>Modal</h1>
        <CarbonClose onClick={closeModal} />
      </div>
    </div>
  );
};

const Navbar: FC<Props> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  function closeModal() {
    setModalOpen(false);
  }

  return (
    <div>
      <div>{children}</div>
      <Modal closeModal={closeModal} modalState={modalOpen} />
      <div
        className={`${
          isOpen ? "" : "hidden"
        } absolute top-0 left-0 z-30 w-screen h-screen backdrop-blur-sm`}
      />
      <div className="absolute bottom-0 z-40">
        <div
          className={` ${
            isOpen ? "" : "hidden"
          } bg-gray-800 mb-4 w-max mx-auto px-4 py-2 rounded-lg`}
        >
          <p className="text-center text-sm text-white mb-2">
            How was your day?
          </p>
          <div className="flex items-center justify-between">
            <p className="text-4xl">😀</p>
            <p className="text-4xl">🙂</p>
            <p className="text-4xl">😐</p>
            <p className="text-4xl">😕</p>
            <p className="text-4xl">☹</p>
          </div>
        </div>
        <div className="flex w-screen bg-gray-800 items-center justify-between px-10 py-2 rounded-t-lg shadow-xl">
          <div className="flex flex-col items-center justify-center fill-white">
            <CarbonCalendar className="text-2xl" />
            <p className="text-white text-xs">Calendar</p>
          </div>
          <div
            className="flex flex-col items-center justify-center"
            onClick={() => setIsOpen(!isOpen)}
          >
            <CarbonFaceSatisfiedFilled className="fill-green-400 text-4xl" />
          </div>
          <div className="flex flex-col items-center justify-center">
            <CarbonSettings className="text-2xl fill-white" />
            <p className="text-white text-xs">Settings</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
