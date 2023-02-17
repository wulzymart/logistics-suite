import React from "react";
const Select = ({
  options,
  name,

  value,
  handleChange,
  children,
  ...otherProps
}) => (
  <div className=" w-full">
    <select
      className="rounded-lg font-openSans w-full  py-2 px-3 outline-0 invalid:border-red-500 "
      name={name}
      value={value}
      onChange={handleChange}
      {...otherProps}
    >
      <option value="">{children}</option>
      {options.map((item, index) => (
        <option key={index} value={item}>
          {item}
        </option>
      ))}
    </select>
  </div>
);
export default Select;
