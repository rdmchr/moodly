import { FC, useState } from "react";
import CarbonCalendar from "../icons/CarbonCalendar";
import CarbonClose from "../icons/CarbonClose";
import CarbonFaceSatisfiedFilled from "../icons/CarbonFaceSatisfiedFilled";
import CarbonSettings from "../icons/CarbonSettings";
import EpLoading from "../icons/EpLoading";

type Props = {
  children?: React.ReactNode;
};

type ModalProps = {
  closeModal: () => void;
  modalState: boolean;
  mood: number;
  setMood: (mood: number) => void;
};

const Modal = ({
  closeModal,
  modalState: modalOpen,
  mood,
  setMood,
}: ModalProps) => {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const date = new Date().toISOString().split("T")[0];
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const day = `${days[new Date().getDay()]}, ${months[new Date().getMonth()]} ${new Date().getDate()}`;

  async function save() {
    setLoading(true);
    const data = await fetch("/api/v1/saveday", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: note,
        rating: mood,
        date,
      }),
      credentials: "include",
    });
    const json = await data.json();
    console.log(json);
    if (json.error) {
      setLoading(false);
      setError(json.error);
      setTimeout(() => setError(""), 2000);
    } else {
      setLoading(false);
      closeModal();
    }
  }

  return (
    <div
      className={`${
        modalOpen ? "" : "hidden"
      } absolute w-screen h-screen top-0 left-0 bg-white z-50`}
    >
      <div className="flex items-center justify-between px-2 py-2">
        <CarbonSettings className="text-2xl" />
        <h1 className="font-medium">{day}</h1>
        <CarbonClose onClick={closeModal} className="text-2xl" />
      </div>
      <div className="px-2">
        <div className="bg-gray-200 py-1 px-4 rounded-lg">
          <p className="text-center text-sm mb-2">How was your day?</p>
          <div className="flex items-center justify-between">
            <p
              className={`${mood === 5 ? "" : "grayscale"} text-4xl`}
              onClick={() => setMood(5)}
            >
              😀
            </p>
            <p
              className={`${mood === 4 ? "" : "grayscale"} text-4xl`}
              onClick={() => setMood(4)}
            >
              🙂
            </p>
            <p
              className={`${mood === 3 ? "" : "grayscale"} text-4xl`}
              onClick={() => setMood(3)}
            >
              😐
            </p>
            <p
              className={`${mood === 2 ? "" : "grayscale"} text-4xl`}
              onClick={() => setMood(2)}
            >
              😕
            </p>
            <p
              className={`${mood === 1 ? "" : "grayscale"} text-4xl`}
              onClick={() => setMood(1)}
            >
              ☹
            </p>
          </div>
        </div>
        <div className="bg-gray-200 py-1 px-4 rounded-lg mt-2">
          <p className="text-center text-sm mb-2">Today&apos;s note</p>
          <textarea
            className="resize-none w-full text-sm p-1 rounded-lg outline-none bg-gray-400 text-white placeholder:text-white"
            placeholder="Add a note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </div>
      <button
        className={`${
          error ? "bg-red-400" : ""
        } fixed bottom-0 w-screen bg-green-400 font-bold py-2`}
        onClick={save}
        disabled={loading}
      >
        {loading ? (
          <EpLoading className="animate-spin text-2xl mx-auto" />
        ) : error ? (
          <span>{error}</span>
        ) : (
          <span>Done</span>
        )}
      </button>
    </div>
  );
};

const Navbar: FC<Props> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [mood, setMood] = useState(0);

  function closeModal() {
    setModalOpen(false);
  }

  function openModal(mood: number) {
    setMood(mood);
    setModalOpen(true);
  }

  return (
    <div>
      <div>{children}</div>
      <Modal
        closeModal={closeModal}
        modalState={modalOpen}
        mood={mood}
        setMood={setMood}
      />
      <div
        onClick={() => setIsOpen(!isOpen)}
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
            <p className="text-4xl" onClick={() => openModal(5)}>
              😀
            </p>
            <p className="text-4xl" onClick={() => openModal(4)}>
              🙂
            </p>
            <p className="text-4xl" onClick={() => openModal(3)}>
              😐
            </p>
            <p className="text-4xl" onClick={() => openModal(2)}>
              😕
            </p>
            <p className="text-4xl" onClick={() => openModal(1)}>
              ☹
            </p>
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
