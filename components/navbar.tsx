import { FC } from "react";
import CarbonCalendar from "../icons/CarbonCalendar";
import CarbonFaceSatisfiedFilled from "../icons/CarbonFaceSatisfiedFilled";
import CarbonSettings from "../icons/CarbonSettings";

type Props = {
  children?: React.ReactNode;
};

const Navbar: FC<Props> = ({ children }) => {
  return (
    <div>
      <div>{children}</div>
      <div className="flex w-screen bg-gray-800 absolute bottom-0 items-center justify-between px-10 py-2 rounded-t-lg shadow-xl">
        <div className="flex flex-col items-center justify-center fill-white">
          <CarbonCalendar className="text-2xl" />
          <p className="text-white text-xs">Calendar</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <CarbonFaceSatisfiedFilled className="fill-green-400 text-4xl" />
        </div>
        <div className="flex flex-col items-center justify-center">
          <CarbonSettings className="text-2xl fill-white" />
          <p className="text-white text-xs">Settings</p>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
