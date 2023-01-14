import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { useState } from "react";

import CustomButton from "../components/button/button";
import Input from "../components/input/input";
import Modal from "../components/Modal";
import PinModal from "../components/PinModal";
import Select from "../components/select-input/select";
import { useAppConfigContext } from "../contexts/AppConfig.context";
import { useUserContext } from "../contexts/CurrentUser.Context";
import { useThemeContext } from "../contexts/themeContext";
import { db } from "../firebase/firebase";

const AddVehicle = () => {
  const vehicleTypes = [
    "Motorcycle",
    "Station Wagon",
    "Pickup",
    "Mini Van",
    "Van",
    "Mini Bus",
    "Bus",
    "Truck",
    "Trailer",
  ];
  const { stationsList, comparePin } = useAppConfigContext();
  const { currentUser } = useUserContext();
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [colour, setColour] = useState("");
  const [type, setType] = useState("");
  const [service, setService] = useState("");
  const [station, setStation] = useState("");
  const [regNo, setRegNo] = useState("");
  const [engineNo, setEngineNo] = useState("");
  const { openModal, closeModal } = useThemeContext();
  const [pin, setPin] = useState("");
  const registervehicle = async () => {
    const id = `${brand} ${model} ${year} ${regNo}`;
    const vehicle = {
      id,
      brand,
      model,
      year,
      colour,
      type,
      service,
      station,
      regNo,
      engineNo,
    };
    const vehicleRef = doc(db, "vehicles", id);
    const snapshot = await getDoc(vehicleRef);

    if (!snapshot.exists()) {
      setDoc(vehicleRef, vehicle).catch(() =>
        alert("error registring vehicle, please check network and retry")
      );
      alert("Vehicle Registration Successful");
      setBrand("");
      setModel("");
      setYear("");
      setColour("");
      setType("");
      setService("");
      setStation("");
      setRegNo("");
      setEngineNo("");
      setPin("");
    } else alert("Vehicle Exists");
  };
  const handleSubmit = () => {
    if (comparePin(pin, currentUser.pin)) {
      registervehicle();
      closeModal("pin-modal");
      closeModal("vehicle-modal");
    } else alert("incorrect Pin");
  };
  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-8">Add a new Vehicle</h1>
      <p className="mb-8 text-red-600">
        Please fill the following form spaces to add a new vehicle
      </p>
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="w-full">
          <p>Brand</p>
          <Input
            type="text"
            value={brand}
            handleChange={(e) => setBrand(e.target.value)}
          />
        </div>
        <div className="w-full ">
          <p>Model</p>
          <Input
            type="text"
            value={model}
            handleChange={(e) => setModel(e.target.value)}
          />
        </div>
        <div className="w-full ">
          <p>Year</p>
          <Input
            type="text"
            value={year}
            handleChange={(e) => setYear(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="w-full ">
          <p>Colour</p>
          <Input
            type="text"
            value={colour}
            handleChange={(e) => setColour(e.target.value)}
          />
        </div>
        <div className="w-full">
          <p>Registration Number</p>
          <Input
            type="text"
            value={regNo}
            handleChange={(e) => setRegNo(e.target.value)}
          />
        </div>
        <div className="w-full ">
          <p>Engine Number</p>
          <Input
            type="text"
            value={engineNo}
            handleChange={(e) => setEngineNo(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="w-full ">
          <p>Type</p>
          <Select
            options={vehicleTypes}
            value={type}
            handleChange={(e) => setType(e.target.value)}
          />
        </div>
        <div className="w-full ">
          <p>Service</p>
          <Select
            options={["Inter-Station trips", "Home trips"]}
            value={service}
            handleChange={(e) => setService(e.target.value)}
          />
        </div>
        {service === "Home trips" && (
          <div className="w-full ">
            <p>Station</p>
            <Select
              options={stationsList}
              value={station}
              handleChange={(e) => setStation(e.target.value)}
            />
          </div>
        )}
      </div>
      <CustomButton
        handleClick={() => {
          if (brand && model && regNo && service) {
            openModal("vehicle-modal");
          } else alert("Ensure all form details are filled before progressing");
        }}
      >
        Add Vehicle
      </CustomButton>
      <Modal id="vehicle-modal" title="Vehicle Summary">
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
          <p>
            Brand: <span>{brand}</span>{" "}
          </p>
          <p>
            Model: <span>{model}</span>{" "}
          </p>
          <p>
            year: <span>{year}</span>{" "}
          </p>
        </div>
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
          <p>
            Colour: <span>{colour}</span>{" "}
          </p>
          <p>
            Engine Number: <span>{engineNo}</span>{" "}
          </p>
          <p>
            Registration Number: <span>{regNo}</span>{" "}
          </p>
        </div>
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
          <p>
            Service type: <span>{service}</span>{" "}
          </p>
          {station && (
            <p>
              Engine Number: <span>{engineNo}</span>{" "}
            </p>
          )}
        </div>
        <CustomButton handleClick={() => openModal("pin-modal")}>
          Proceed
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
export default AddVehicle;
