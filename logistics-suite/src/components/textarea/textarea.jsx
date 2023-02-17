import React from "react";
const Textarea = ({
  type,
  name,
  value,
  placeholder,
  handleChange,
  ...otherProps
}) => (
  <div className=" w-full ">
    <textarea
      className="rounded-lg font-openSans  w-full py-2 pl-3 outline-0 disabled:bg-white invalid:border-red-500"
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      {...otherProps}
    />
  </div>
);
export default Textarea;
