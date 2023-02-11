import React from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { useThemeContext } from "../contexts/themeContext";

const Modal = ({ id, title, children }) => {
  const { closeModal } = useThemeContext();
  !document.getElementById(id)?.classList.contains("hidden") &&
    document.getElementById(`modal-${id}`)?.scrollIntoView();
  return (
    <div
      id={id}
      className="w-[100%] h-full flex items-center hidden justify-center absolute top-0 left-0 "
      style={{ zIndex: 2000 }}
    >
      <div className="w-full h-screen fixed  bg-black  bottom right opacity-80 z-[3000]"></div>
      <div className="min-w-[400px]  md:min-w-600px min-h-[200px] bg-white rounded-lg overflow-hidden z-[4000]">
        <div
          id={`modal-${id}`}
          className="w-full h-12 bg-blue-800 flex text-white  items-center justify-between px-4"
        >
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
        <div className="p-2 md:p-10">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
