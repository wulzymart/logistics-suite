import React, { useState } from "react";

import Input from "../input/input";
const PinModdal = () => {
  const [hidden, setHidden] = useState(false);
  const [pin, setPin] = useState("");

  return (
    <div
      className={`w-[80%] md:w-1/4 ${
        hidden ? "hidden" : "block"
      } bg-white absolute rounded-xl flex flex-col gap-8 top-[40%] left-[10%] md:left-[37.5%]`}
    >
      <div className=" h-10 bg-emerald-900 rounded-lg flex items-center justify-end pr-5">
        <span className="cursor-pointer" onClick={() => setHidden(true)}>
          ❌
        </span>
      </div>
      <div className="px-5">
        <Input
          type={"password"}
          name={"Pin"}
          value={pin}
          onChange={(e) => setPin(e.value.target)}
          placeholder={"Enter Your Pin"}
        />
      </div>
      <div className="flex justify-end pr-5 mb-5">
        <button className="text-white font-medium text-lg rounded-xl bg-emerald-900 hover:bg-slate-900 py-2 px-3">
          Submit
        </button>
      </div>
    </div>
  );
};

export default PinModdal;
