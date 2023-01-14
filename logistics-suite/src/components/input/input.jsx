import React from "react";
const Input = ({
  type,
  name,
  value,
  placeholder,
  handleChange,
  ...otherProps
}) => (
  <div className=" w-full ">
    <input
      className="rounded-lg font-openSans  w-full py-2 pl-3  border-solid border-1 focus:border-0  disabled:bg-white"
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      {...otherProps}
    />
  </div>
);
export default Input;
