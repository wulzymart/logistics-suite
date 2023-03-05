import { doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { useAppConfigContext } from "../../contexts/AppConfig.context";
import { useUserContext } from "../../contexts/CurrentUser.Context";
import { useThemeContext } from "../../contexts/themeContext";
import { db } from "../../firebase/firebase";
import CustomButton from "../button/button";
import Input from "../input/input";
import Modal from "../Modal";
import PinModal from "../PinModal";
import Select from "../select-input/select";

const EditTripStaff = ({ data }) => {
  const { stationsList, comparePin } = useAppConfigContext();
  const { currentUser } = useUserContext();
  const { openModal, closeModal } = useThemeContext();
  const [station, setStation] = useState(data.station);

  const [grossSalary, setGross] = useState(data.grossSalary);
  const [tax, setTax] = useState(data.tax);
  const [pension, setPension] = useState(data.pension);
  const [netSalary, setNet] = useState(data.netSalary);
  const [pin, setPin] = useState("");
  const [bank, setBankDetails] = useState(
    data.bank ? data.bank : { bankName: "", accountNo: "" }
  );
  const setBank = (e) => {
    const { name, value } = e.target;
    setBankDetails({ ...bank, [name]: value });
  };
  const handleSubmit = () => {
    if (comparePin(pin, currentUser.pin)) {
      setDoc(
        doc(db, "tripStaff", data.id),
        { station, grossSalary, tax, pension, netSalary, bank },
        { merge: true }
      );
      setPin("");
      closeModal("pin-modal");
      closeModal("edit-staff");
    } else alert("Wrong Pin");
  };
  return (
    <Modal id="edit-staff" title="Edit Professional Details">
      <div className="lg:w-[800px] md:w-[700px]">
        <div className="p-2 bg-white dark:bg-slate-500 dark:text-white rounded-lg shadow ">
          <h2 className="text-lg font-medium">Station Information</h2>
          <div className="p-2 flex flex-col md:flex-row gap-4">
            <div className="flex md:flex-col gap-4 items-center md:w-1/3">
              <p className="text-[16px] font-medium">Station:</p>
              <Select
                options={stationsList ? stationsList : [""]}
                value={station}
                handleChange={(e) => setStation(e.target.value)}
                children="Select Station"
              />
            </div>
          </div>
        </div>
        <div className="w-full mb-10">
          <p className="font-medium mb-5">Bank Details</p>
          <div className="flex flex-wrap gap-x-[4%] gap-y-8 ">
            <div className="w-full md:w-[48%] ">
              <Input
                placeholder={"Bank Name"}
                type="text"
                required
                name="bankName"
                value={bank.bankName}
                handleChange={(e) => setBank(e)}
              />
            </div>
            <div className="w-full md:w-[48%]">
              <Input
                placeholder={"Account No"}
                name={"accountNo"}
                type="text"
                required
                value={bank.accountNo}
                handleChange={(e) => setBank(e)}
              />
            </div>
          </div>
        </div>
        <div className="p-2 bg-white dark:bg-slate-500 dark:text-white rounded-lg shadow mt-2">
          <h2 className="text-lg font-medium">Salary Information</h2>
          <div className="flex flex-col  md:flex-row gap-4">
            <div className="flex md:flex-col gap-4 items-center md:w-1/4">
              <p className="text-[15px] font-medium">Gross Salary (NGN):</p>
              <Input
                type="number"
                value={grossSalary}
                handleChange={(e) => setGross(e.target.value)}
              />
            </div>
            <div className="flex md:flex-col gap-4 items-center md:w-1/4">
              <p className="text-[15px] font-medium">Tax (NGN):</p>{" "}
              <Input
                type="number"
                value={tax}
                handleChange={(e) => setTax(e.target.value)}
              />
            </div>

            <div className="flex md:flex-col gap-4 items-center md:w-1/4">
              <p className="text-[15px] font-medium">Pension (NGN):</p>
              <Input
                type="number"
                value={pension}
                handleChange={(e) => setPension(e.target.value)}
              />
            </div>
            <div className="flex md:flex-col gap-4 items-center md:w-1/4">
              <p className="text-[15px] font-medium">Net Salary (NGN):</p>
              <Input
                type="number"
                value={netSalary}
                handleChange={(e) => setNet(e.target.value)}
              />
            </div>
          </div>
        </div>
        <CustomButton handleClick={() => openModal("pin-modal")}>
          Submit
        </CustomButton>
      </div>
      <PinModal
        pin={pin}
        handleChange={(e) => setPin(e.target.value)}
        handleSubmit={handleSubmit}
      />
    </Modal>
  );
};

export default EditTripStaff;
