import React from "react";

import CustomButton from "./button/button";
import Input from "./input/input";
import Modal from "./Modal";

const PinModal = ({ handleSubmit, handleChange, pin }) => {

  return (
    <Modal
      
      title="Confirm operation"
      id="pin-modal"
    >
      <p className="text-lg font-medium">Enter Your Pin</p>
      <Input
        name="staffPin"
        type="password"
        value={pin}
        handleChange={handleChange}
      />
      <div className="mt-8">
        <CustomButton
          handleClick={() => {
            handleSubmit();
          }}
        >
          Proceed
        </CustomButton>
      </div>
    </Modal>
  );
};

export default PinModal;
