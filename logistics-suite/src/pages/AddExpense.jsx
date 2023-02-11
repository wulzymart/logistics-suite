import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { idGenerator } from "../AppBrain";
import CustomButton from "../components/button/button";
import Header from "../components/Header";
import Input from "../components/input/input";
import Modal from "../components/Modal";
import PinModal from "../components/PinModal";
import Select from "../components/select-input/select";
import Textarea from "../components/textarea/textarea";
import { useAppConfigContext } from "../contexts/AppConfig.context";
import { useUserContext } from "../contexts/CurrentUser.Context";
import { useThemeContext } from "../contexts/themeContext";
import { db } from "../firebase/firebase";

const AddExpense = () => {
  const { openModal, closeModal } = useThemeContext();
  const { comparePin } = useAppConfigContext();
  const Purposes = [
    { purpose: "Marketing", max: 1500 },
    { purpose: "Loading" },
    { purpose: "Unloading" },
    { purpose: "Trip Allowance", max: 7000 },
    { purpose: "Fueling" },
    { purpose: "Others" },
  ];
  const purposesList = Purposes.map((purpose) => purpose.purpose);
  const { currentUser } = useUserContext();
  const [purpose, setPurpose] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const approved = "";
  const [orderId, setOrderId] = useState("");
  const [tripId, setTripId] = useState("");
  const [pin, setPin] = useState("");
  const [id, setId] = useState(idGenerator(7));
  const handleSubmit = () => {
    if (comparePin(pin, currentUser.pin)) {
      setDoc(doc(db, "expenses", id), {
        id,
        purpose,
        amount,
        description,
        orderId,
        tripId,
        approved,
        staffId: currentUser.id,
        staffName: currentUser.displayName,
        station: currentUser.station,
        stationId: currentUser.stationId,
        dateCreated: serverTimestamp(),
      });

      setPin("");
      closeModal("pin-modal");
      closeModal("expense-modal");
      setPurpose("");
      setAmount("");
      setDescription("");
      setOrderId("");
      setTripId("");
      setId(idGenerator(7));
    } else alert("Incorrect Pin");
  };

  return (
    <div>
      <Header title="Register Expense" />
      <div className="flex flex-wrap justify-center gap-8 mb-10">
        <div className="flex flex-col gap-2 items-center w-[300px]">
          <p>Purpose:</p>
          <Select
            options={purposesList}
            value={purpose}
            handleChange={(e) => setPurpose(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2 items-center w-[300px]">
          <p>Amount (NGN):</p>
          <Input
            type="number"
            value={amount}
            handleChange={(e) => setAmount(e.target.value)}
            max={
              purpose
                ? Purposes[purposesList.indexOf(purpose)].max
                  ? Purposes[purposesList.indexOf(purpose)].max
                  : 1000000
                : 0
            }
          />

          {purpose && Purposes[purposesList.indexOf(purpose)].max && (
            <p>Max: {Purposes[purposesList.indexOf(purpose)].max}NGN</p>
          )}
        </div>
        <div className="flex flex-col gap-2 items-center w-[300px]">
          <p>Description:</p>
          <Textarea
            type="text"
            value={description}
            handleChange={(e) => setDescription(e.target.value)}
            placeholder="Describe this expense, expense will not be approved without description"
          />
        </div>
        <div className="flex flex-col gap-2 items-center w-[300px]">
          <p>Order Id:</p>
          <Input
            type="text"
            value={orderId}
            handleChange={(e) => setOrderId(e.target.value)}
            placeholder="For expenses regarding an order"
          />
        </div>
        <div className="flex flex-col gap-2 items-center w-[300px]">
          <p>Trip Id:</p>
          <Input
            type="text"
            value={tripId}
            handleChange={(e) => setTripId(e.target.value)}
            placeholder="For expenses regarding an order"
          />
        </div>
      </div>
      <CustomButton
        handleClick={() => {
          const max = purpose
            ? Purposes[purposesList.indexOf(purpose)].max
              ? Purposes[purposesList.indexOf(purpose)].max
              : ""
            : "";
          if (!purpose || !amount || !description) {
            alert("Please fill necessary details before proceeding");
            return;
          }
          if (max && amount > max) {
            alert("Amount entered is more than your daily allowance");
            return;
          }
          openModal("expense-modal");
        }}
      >
        Submit
      </CustomButton>
      <Modal id="expense-modal" title="Expense Summary">
        <div className="p-4 border border-gray-400 mb-8">
          <div className="text-lg font-medium mb-2">Purpose: {purpose}</div>
          <div className="text-lg font-medium mb-2">Amount (NGN): {amount}</div>
          <div className="text-lg font-medium mb-2">
            Description: {description}
          </div>
          {orderId && (
            <div className="text-lg font-medium mb-2">Order Id: {orderId}</div>
          )}
          {tripId && (
            <div className="text-lg font-medium mb-2">Trip Id: {tripId}</div>
          )}
        </div>
        <CustomButton
          handleClick={() => {
            openModal("pin-modal");
          }}
        >
          Save
        </CustomButton>
      </Modal>
      <PinModal
        pin={pin}
        handleChange={(e) => setPin(e.target.value)}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default AddExpense;
