import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import CustomButton from "../components/button/button";
import Input from "../components/input/input";
import PinModal from "../components/PinModal";
import Select from "../components/select-input/select";

import { useThemeContext } from "../contexts/themeContext";
import {
  doc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAppConfigContext } from "../contexts/AppConfig.context";
import { idGenerator } from "../AppBrain";
import axios from "axios";
import { useUserContext } from "../contexts/CurrentUser.Context";

const AddStation = () => {
  const preId = idGenerator(6);
  const { states, statesList, comparePin } = useAppConfigContext();

  const [stationName, setStationName] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [state, setState] = useState("");
  const [lga, setLga] = useState("");
  const [id, setId] = useState("");
  const [Pin, setPin] = useState("");
  const [strAddress, setStrAddress] = useState("");
  const setStateNId = (state) => {
    setState(state);
    setId(states[state].code + "-" + preId);
  };
  const { currentUser } = useUserContext();
  const saveStation = async () => {
    const stationsRef = collection(db, "stations");
    const q = query(stationsRef, where("name", "==", stationName));
    const snapShot = await getDocs(q);
    const station = {
      name: stationName,
      phoneNumber1: phone1,
      phoneNumber2: phone2,
      id,
      address: { state, lga, stretAddress: strAddress },
    };
    if (snapShot.empty) {
      const stationRef = doc(stationsRef, id);
      setDoc(stationRef, station);
      const newStates = states;
      Object.assign(newStates[state].stations, {
        [stationName]: station,
      });
      axios.post("/states", newStates);
    }
  };
  const { openModal, closeModal } = useThemeContext();

  const handleSubmit = () => {
    if (comparePin(Pin, currentUser.pin)) {
      saveStation();
      closeModal("pin-modal");
      alert("Station Saved");
      setStationName("");
      setPhone1("");
      setPhone2("");
      setState("");
      setLga("");
      setId("");
      setPin("");
    } else alert("Incorrect Pin");
  };
  return (
    <div>
      <h1 className="text-center text-3xl font-bold mb-8">Add a new Station</h1>
      <p className="text-xl text-red-800 mb-8">
        Please fill in the appropriate information
      </p>
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="flex flex-col gap-4 w-full ">
          <p className="min-w-fit">Station name</p>
          <Input
            type="text"
            name="stationName"
            value={stationName}
            handleChange={(e) => setStationName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-4 w-full ">
          <p>Phone Number 1</p>

          <PhoneInput
            placeholder="Phone1"
            country={"ng"}
            onlyCountries={["ng"]}
            prefix="+"
            value={phone1}
            onChange={(phone) => {
              phone = "+" + phone;
              setPhone1(phone);
            }}
            containerClass={"h-full !w-full rounded-lg"}
            inputClass={"!w-full !min-h-full"}
          />
        </div>
        <div className="flex flex-col gap-4 w-full ">
          <p>Phone Number 2</p>

          <PhoneInput
            placeholder="Phone2"
            country={"ng"}
            onlyCountries={["ng"]}
            prefix="+"
            value={phone2}
            onChange={(phone) => {
              phone = "+" + phone;
              setPhone2(phone);
            }}
            containerClass={" h-full rounded-lg !w-full"}
            inputClass={"!w-full !min-h-full"}
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="flex gap-4 flex-col w-full ">
          <p>State</p>
          <Select
            options={statesList ? statesList : ["loading"]}
            name="stationState"
            value={state}
            handleChange={(e) => setStateNId(e.target.value)}
          >
            Select State
          </Select>
        </div>
        <div className="flex flex-col gap-4 w-full ">
          <p>LGA</p>
          <Select
            options={state ? states[state].lgas : ["awaiting state select"]}
            name="stationLga"
            value={lga}
            handleChange={(e) => {
              setLga(e.target.value);
            }}
          >
            Select LGA
          </Select>
        </div>
      </div>
      <p>Address</p>
      <Input
        type="text"
        value={strAddress}
        handleChange={(e) => setStrAddress(e.target.value)}
      />
      <div className="w-full mt-8">
        <CustomButton handleClick={() => openModal("pin-modal")}>
          Save station
        </CustomButton>
      </div>
      <PinModal
        pin={Pin}
        handleChange={(e) => setPin(e.target.value)}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default AddStation;
