/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */

import axios from "axios";
import bcrypt from "bcryptjs";

import React, { createContext, useContext, useEffect, useState } from "react";

import { useUserContext } from "./CurrentUser.Context";

const AppConfigContext = createContext();

export const AppConfigContextProvider = ({ children }) => {
  const { stationName } = useUserContext();
  const [states, setStates] = useState();
  const [statesList, setStatesList] = useState(["Loading"]);
  const [stations, setStations] = useState({});
  const [stationsList, setStationsList] = useState(["Loading"]);
  const [routes, setRoutes] = useState({});
  const [routesList, setRoutesList] = useState(["Loading"]);
  const [attendantsList, setAttendantsList] = useState(["Loading"]);
  const [attendants, setAttendants] = useState("");
  const [driversList, setDriversList] = useState(["Loading"]);
  const [drivers, setDrivers] = useState({});
  const [interStateVehicles, setinterStateVehicles] = useState({});
  const [stationVehicles, setStationVehicles] = useState({});
  const [intVehList, setIntVehList] = useState(["loading"]);
  const [statVehList, setStatVehList] = useState(["Loading"]);
  const getHashedPin = (pin) => {
    const salt = bcrypt.genSaltSync(10);

    const hashedPin = bcrypt.hashSync(pin, salt);
    return hashedPin;
  };
  const comparePin = (pin, hash) => {
    const pinCheck = bcrypt.compareSync(pin, hash);
    return pinCheck;
  };

  useEffect(() => {
    axios.get("/states").then((data) => {
      setStates(data.data);

      setStatesList(Object.keys(data.data).map((key) => key));
    });
    axios.get("/routes").then((data) => {
      setRoutes(data.data);
      const list = Object.keys(data.data).map((key) => data.data[key].name);
      setRoutesList(list);
    });

    axios.get("/stations").then((data) => {
      const stationsByName = {};
      // eslint-disable-next-line array-callback-return
      Object.keys(data.data).map((key) => {
        const object = { [data.data[key].name]: data.data[key] };
        Object.assign(stationsByName, object);
      });
      setStations(stationsByName);

      const list = Object.keys(stationsByName);
      setStationsList(list);
    });
    axios
      .get(`/users`, { params: { role: "Vehicle Attendant" } })
      .then((data) => {
        setAttendants(data.data);
        setAttendantsList(Object.keys(data.data));
      });

    axios.get(`/users`, { params: { role: "Driver" } }).then((data) => {
      setDrivers(data.data);
      setDriversList(Object.keys(data.data));
    });
    axios
      .get("/vehicles", { params: { type: "interState" } })
      .then(({ data }) => {
        setinterStateVehicles(data);
        setIntVehList(Object.keys(data));
      });
  }, []);
  useEffect(() => {
    if (stationName) {
      axios
        .get("/vehicles", {
          params: { type: "station", station: stationName },
        })
        .then(({ data }) => {
          setStationVehicles(data);
          setStatVehList(Object.keys(data));
        });
    }
  }, [stationName]);
  return (
    <AppConfigContext.Provider
      value={{
        states,
        setStates,
        statesList,
        setStatesList,
        stations,
        stationsList,
        routes,
        routesList,
        attendantsList,
        setAttendantsList,
        attendants,
        driversList,
        setDriversList,
        drivers,
        interStateVehicles,
        stationVehicles,
        intVehList,
        statVehList,
        getHashedPin,
        comparePin,
      }}
    >
      {children}
    </AppConfigContext.Provider>
  );
};

export const useAppConfigContext = () => useContext(AppConfigContext);
