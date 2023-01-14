import React from "react";
import StaffReg from "../components/forms/StaffReg";
import Header from "../components/Header";

const NewStaff = () => {
  return (
    <div>
      <Header title={"New Staff Registration"} category={"Form"} />

      <p className="font-light text-3xl text-red-800 italic mb-14">
        Please ensure that confirm staff information before filling and before
        submission of form
      </p>
      <StaffReg />
    </div>
  );
};

export default NewStaff;
