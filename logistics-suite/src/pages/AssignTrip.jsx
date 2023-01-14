import React from "react";
import CustomButton from "../components/button/button";
import Select from "../components/select-input/select";

const AssignTrip = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-8">Assign trip</h1>
      <div className="flex gap-4 items-center">
        <p className="text-lg min-w-fit">Select trip</p>
        <Select options={["trips"]}>Select Trip</Select>
      </div>
      <div className="mb-8 p-10">Trip Unassigned Waybill List</div>
      <CustomButton>Assign</CustomButton>
    </div>
  );
};

export default AssignTrip;
