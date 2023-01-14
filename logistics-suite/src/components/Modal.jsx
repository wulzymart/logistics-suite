import React from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { useThemeContext } from "../contexts/themeContext";

const Modal = ({ id, title, children }) => {
  const { closeModal } = useThemeContext();

  return (
    <div
      id={id}
      className="w-full h-screen flex items-center hidden justify-center absolute top-0 left-0 z-[3000]"
    >
      <div className="w-full h-[100%] bg-black absolute bottom right opacity-80 z-[2000]"></div>
      <div className="min-w-[400px] md-min-w-600px min-h-[200px] bg-white rounded-lg overflow-hidden z-[4000]">
        <div className="w-full h-12 bg-blue-800 flex text-white  items-center justify-between px-4">
          <p className="text-lg font-medium"> {title ? title : "loading"}</p>
          <span
            className="text-3xl "
            onClick={() => {
              closeModal(id);
            }}
          >
            <IoMdCloseCircle />
          </span>
        </div>
        <div className="p-10">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
