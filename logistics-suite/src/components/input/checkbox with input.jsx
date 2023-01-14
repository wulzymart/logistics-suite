import React, { useState } from "react";

const CheckedInput = ({
  title,
  type,
  name,
  value,
  placeholder,
  handleChange,
  toggleDelete,

  ...otherProps
}) => {
  const [disabled, setDisabled] = useState(true);
  return (
    <div className=" w-[30%] flex gap-8 items-center">
      <input
        className="rounded-lg  w-6 h-6   outline-0"
        type="checkbox"
        onChange={() => {
          setDisabled(!disabled);
          toggleDelete();
        }}
      />
      <p className="text-white font-light text-[16px]">{title}</p>
      <input
        className="rounded-lg w-full  h-6 pl-3 outline-0 disabled:bg-white"
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        disabled={disabled}
      />
    </div>
  );
};
export default CheckedInput;
