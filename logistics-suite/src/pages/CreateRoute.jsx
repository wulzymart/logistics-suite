import React, { useState } from "react";
import Select from "../components/select-input/select";
import CustomButton from "../components/button/button";

import Input from "../components/input/input";
import { useAppConfigContext } from "../contexts/AppConfig.context";
import Modal from "../components/Modal";
import { useThemeContext } from "../contexts/themeContext";
import { idGenerator } from "../AppBrain";
import PinModal from "../components/PinModal";
import { useUserContext } from "../contexts/CurrentUser.Context";
import { db } from "../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";

const CreateRoute = () => {
  const Id = idGenerator(5);
  const [genId] = useState(Id);
  const { openModal, closeModal } = useThemeContext();
  const { states, statesList, stationsList, comparePin } =
    useAppConfigContext();
  const [routeName, setRouteName] = useState("");
  const [routeId, setRouteId] = useState(genId);
  const [statesPicked, setStatesPicked] = useState([]);
  const [originState, setOriginState] = useState("");
  const [originStateCode, setOriginStateCode] = useState("");
  const [originStation, setOriginStation] = useState("");
  const [destinationStation, setDestinationStation] = useState("");
  const [destinationState, setDestinationState] = useState("");
  const [destinationStateCode, setDestinationStateCode] = useState("");
  const { currentUser } = useUserContext();
  const [pin, setPin] = useState("");
  async function saveRoute() {
    if (comparePin(pin, currentUser.pin)) {
      const Route = {
        id: routeId,
        name: routeName,
        states: statesPicked,
        originState,
        originStation,
        destinationState,
        destinationStation,
      };
      const routeRef = doc(db, "routes", Route.id);
      try {
        await setDoc(routeRef, Route);
        alert("New Route Successfully Created");
        closeModal("pin-modal");
        closeModal("routes-modal");
      } catch (error) {
        alert("error creating new route try again");
      }
    } else alert("Wrong user pin");
  }
  const genRouteId = (code1 = originStateCode, code2 = destinationStateCode) =>
    setRouteId(`${code1}-${genId}-${code2}`);
  const addState = (value) => {
    setStatesPicked([...statesPicked, value]);
  };
  const removeState = (value) => {
    const statesCopy = statesPicked;
    const removeIndex = statesCopy.indexOf(value);
    statesCopy.splice(removeIndex, 1);
    setStatesPicked(statesCopy);
  };
  const handleChange = (value) => {
    statesPicked.includes(value) ? removeState(value) : addState(value);
  };

  return (
    <div className="">
      <h1 className="text-2xl font-bold text-center">Create New Route</h1>
      <div className="mt-12">
        <p className="text-xl text-red-600 dark:text-pink-100">
          Please kindly enter the following fields and select the states covered
          by the route.
        </p>

        <div className="flex flex-col md:flex-row gap-8 w-ful my-8">
          <div className="w-full">
            <p className="text-lg mb-4">Route Name</p>
            <Input
              type="text"
              value={routeName}
              handleChange={(e) => setRouteName(e.target.value)}
            />
          </div>
          <div className="w-full">
            <p className="text-lg mb-4">RouteID</p>
            <Input type="text" value={routeId} disabled />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-8 w-full my-8">
          <div className="w-full">
            <p className="text-lg mb-4">Origin State</p>
            <Select
              options={statesList}
              value={originState}
              handleChange={(e) => {
                const value = e.target.value;
                setOriginState(value);
                setOriginStateCode(states[value].code);
                genRouteId(states[value].code);
              }}
            />
          </div>
          <div className="w-full">
            <p className="text-lg mb-4">Origin Station</p>
            <Select
              options={stationsList}
              value={originStation}
              handleChange={(e) => {
                setOriginStation(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-8 w-ful my-8">
          <div className="w-full">
            <p className="text-lg mb-4">Destination State</p>
            <Select
              options={statesList}
              value={destinationState}
              handleChange={(e) => {
                const value = e.target.value;
                setDestinationState(value);

                setDestinationStateCode(states[value].code);
                genRouteId(originStateCode, states[value].code);
              }}
            />
          </div>
          <div className="w-full">
            <p className="text-lg mb-4">Destination Station</p>
            <Select
              options={stationsList}
              value={destinationStation}
              handleChange={(e) => {
                setDestinationStation(e.target.value);
              }}
            />
          </div>
        </div>
        <p className="text-lg mb-4">States covered</p>
        <div className="w-full min-h-[400px] p-10 flex flex-wrap gap-14 border-2 border-solid border-black dark:border-white rounded-lg">
          {statesList.map((state, i) => (
            <div key={i} className="flex items-center gap-3 w-32 h-8">
              <input
                type="checkbox"
                className="h-5 w-5 rounded"
                name="state"
                value={state}
                onChange={() => {
                  handleChange(state);
                 
                }}
              />
              <p className="text-lg">{state}</p>
            </div>
          ))}
        </div>
        <div className="w-full mt-8">
          <CustomButton handleClick={() => openModal("routes-modal")}>
            Create Route
          </CustomButton>
        </div>
        <Modal id="routes-modal" title="Route Summary">
          <div className="p-10">
            <div className="flex flex-col md:flex-row gap-10 justify-between mb-6">
              <p className="text-md font-medium">
                Route Name:
                <span className="font-regular"> {routeName}</span>
              </p>
              <p className="text-md font-medium">
                Route ID:
                <span className="font-regular"> {}</span>
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-10 justify-between mb-6 ">
              <p className="text-md font-medium">
                Origin State:
                <span className="font-regular"> {originState}</span>
              </p>
              <p className="text-md font-medium">
                Origin Station:
                <span className="font-regular"> {originStation}</span>
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-10 justify-between mb-6">
              <p className="text-md font-medium">
                Destination State:
                <span className="font-regular"> {destinationState}</span>
              </p>
              <p className="text-md font-medium">
                Destination Station:
                <span className="font-regular"> {destinationStation}</span>
              </p>
            </div>
            <div className="flex gap-2 mb-8">
              <p className="text-md font-medium">Route States:</p>
              <div className="flex flex-wrap gap-4">
                {statesPicked.map((state, i) => (
                  <span key={i}>{state}</span>
                ))}
              </div>
            </div>
            <CustomButton handleClick={() => openModal("pin-modal")}>
              Proceed
            </CustomButton>
          </div>
        </Modal>
        <PinModal
          pin={pin}
          handleChange={(e) => setPin(e.target.value)}
          handleSubmit={saveRoute}
        />
      </div>
    </div>
  );
};

export default CreateRoute;
