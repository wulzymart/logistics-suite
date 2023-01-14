import React from "react";
const CustomButton = ({ handleClick, children, ...otherProps }) => (
  <div className="text-center">
    <button
      className="min-w-fit bg-blue-500 hover:bg-red-700 w-56 p-3 text-center text-white font-medium text-lg rounded-lg"
      onClick={handleClick}
    >
      {children}
    </button>
  </div>
);
export default CustomButton;
