import { doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";

import { idGenerator } from "../AppBrain";
import CustomButton from "../components/button/button";
import Input from "../components/input/input";
import Modal from "../components/Modal";
import PinModal from "../components/PinModal";
import Select from "../components/select-input/select";
import { useAppConfigContext } from "../contexts/AppConfig.context";
import { useUserContext } from "../contexts/CurrentUser.Context";
import { useThemeContext } from "../contexts/themeContext";
import { db } from "../firebase/firebase";

const CreateTrip = () => {
  const { openModal, closeModal } = useThemeContext();
  const {
    stationsList,
    routesList,
    attendantsList,
    attendants,
    driversList,
    drivers,
    intVehList,
    statVehList,
    comparePin
  } = useAppConfigContext();
  const [id, setId] = useState(idGenerator(3));
  const { currentUser } = useUserContext();

  const [tripId, setTripId] = useState("");
  const setNameId = (name) => {
    setTripName(name);
    setTripId(name + "-" + id);
  };
  const [tripName, setTripName] = useState("");
  const [tripType, setTripType] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [originStation, setOriginStation] = useState("");
  const [destinationStation, setDestinationStation] = useState("");
  const [route, setRoute] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [driver, setDriver] = useState("");
  const [attendant, setAttendant] = useState("");
  const [pin, setPin] = useState("");
  async function saveTrip() {
    if (comparePin(pin, currentUser.pin)) {
      const trip = {
        id: tripId,
        name: tripName,
        tripType,
        serviceType,
        originStation,
        destinationStation,
        route,
        vehicle,
        driverName: driver,
        driverPhone: drivers[driver]?.phoneNumber,
        attendantName: attendant,
        attendantPhone: attendants[attendant]?.phoneNumber,
      };
      const tripRef = doc(db, "trips", trip.id);
      try {
        await setDoc(tripRef, trip);
        alert("New trip Successfully Created");
        closeModal("pin-modal");
        closeModal("create-trip-modal");
        setPin("");
        setId(idGenerator(3));
        setTripName("");
        setTripId("");
        setTripType("");
        setServiceType("");
        setOriginStation("");
        setDestinationStation("");
        setRoute("");
        setVehicle("");
        setDriver("");
        setAttendant("");
      } catch (error) {
        alert("error creating trip try again");
      }
    } else alert("Wrong user pin");
  }
  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-8">Create a new Trip</h1>
      <p>Please fill the following form spaces to create a new trip</p>
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="w-full">
          <p>Trip Name</p>
          <Input
            type="text"
            value={tripName}
            handleChange={(e) => setNameId(e.target.value)}
          />
        </div>
        <div className="w-full ">
          <p>Trip Id</p>
          <Input disabled type="text" value={tripId} />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="w-full">
          <p>Trip Type</p>
          <Select
            options={["Station-Station", "Home Delivery"]}
            value={tripType}
            handleChange={(e) => {
              const value = e.target.value;
              setTripType(value);
              if (value === "Home Delivery") {
                setRoute("");
                setDestinationStation("");
              }
            }}
            children="Select One"
          />
        </div>
        <div className="w-full ">
          <p>Service Type</p>
          <Select
            options={["Regular", "Express"]}
            value={serviceType}
            handleChange={(e) => setServiceType(e.target.value)}
            children="Select One"
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="w-full">
          <p className="">Origin Station</p>
          <Select
            options={stationsList}
            value={originStation}
            handleChange={(e) => setOriginStation(e.target.value)}
            children="Select One"
          />
        </div>
        {tripType !== "Home Delivery" && (
          <div className="w-full">
            <p className="">Desination Station</p>
            <Select
              options={stationsList}
              value={destinationStation}
              handleChange={(e) => setDestinationStation(e.target.value)}
              children="Select One"
            />
          </div>
        )}
        {tripType !== "Home Delivery" && (
          <div className="w-full">
            <p className="">Select Route</p>
            <Select
              options={routesList}
              value={route}
              handleChange={(e) => setRoute(e.target.value)}
              children="Select One"
            />
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="w-full">
          <p>Select Vehicle</p>
          <Select
            options={
              tripType === "Home Delivery"
                ? statVehList
                : tripType === "Station-Station"
                ? intVehList
                : ["Select Trip Type !!"]
            }
            value={vehicle}
            handleChange={(e) => setVehicle(e.target.value)}
            children="Select One"
          />
        </div>
        <div className="w-full ">
          <p>Driver</p>
          <Select
            options={driversList}
            value={driver}
            handleChange={(e) => setDriver(e.target.value)}
            children="Select One"
          />
        </div>
        <div className="w-full ">
          <p>Vehicle Attendant</p>
          <Select
            options={attendantsList}
            value={attendant}
            handleChange={(e) => setAttendant(e.target.value)}
            children="Select One"
          />
        </div>
      </div>
      <div className="w-full">
        <CustomButton
          handleClick={() => {
            if (
              tripName &&
              serviceType &&
              tripType &&
              originStation &&
              driver
            ) {
              if (
                tripType === "Station-Station" &&
                destinationStation &&
                route &&
                attendant
              ) {
                openModal("create-trip-modal");
              } else if (tripType === "Home Delivery") {
                openModal("create-trip-modal");
              } else alert("Enter all necessary information");
            } else alert("Enter all necessary information");
          }}
        >
          Create trip
        </CustomButton>
      </div>
      <Modal id="create-trip-modal" title="Trip Summary">
        <div className=" p-10 flex flex-col gap-8 ">
          <div className="flex justify-between gap-10">
            <p>
              Trip ID: <span>{tripId}</span>
            </p>
            <p>
              Trip Name: <span>{tripName}</span>
            </p>
          </div>
          <div className="flex justify-between gap-10">
            <p>
              Trip Type: <span>{tripType}</span>
            </p>
            <p>
              Service Type: <span>{serviceType}</span>
            </p>
          </div>
          <div className="flex justify-between gap-10">
            <p>
              Origin Station: <span>{originStation}</span>
            </p>
            {tripType !== "Home Delivery" && (
              <p>
                Destination Station: <span>{destinationStation}</span>
              </p>
            )}
            {tripType !== "Home Delivery" && (
              <p>
                Route: <span>{route}</span>
              </p>
            )}
          </div>
          <div className="flex justify-between gap-10">
            <p>
              Vehicle Details: <span>{vehicle}</span>
            </p>
          </div>
          <div className="flex justify-between gap-10">
            <p>
              Driver's Name: <span>{driver}</span>
            </p>
            <p>
              Driver's Contact: <span>{drivers[driver]?.phoneNumber}</span>
            </p>
          </div>
          {attendant && (
            <div className="flex justify-between gap-10">
              <p>
                Attendant's Name: <span>{attendant}</span>
              </p>
              <p>
                Attendant's Contact:{" "}
                <span>{attendants[attendant]?.phoneNumber}</span>
              </p>
            </div>
          )}
          <CustomButton handleClick={() => openModal("pin-modal")}>
            Proceed
          </CustomButton>
        </div>
      </Modal>
      <PinModal
        pin={pin}
        handleChange={(e) => setPin(e.target.value)}
        handleSubmit={() => saveTrip()}
      />
    </div>
  );
};

export default CreateTrip;
