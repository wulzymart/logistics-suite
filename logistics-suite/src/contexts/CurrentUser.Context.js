/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import React, { createContext, useContext, useEffect, useState } from "react";
import { rootUrl } from "../AppBrain";
import { app } from "../firebase/firebase";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  console.log("loaded");
  const [currentUser, setCurrentUser] = useState("loading");
  const [stationName, setStationName] = useState("");
  const [stationId, setStationId] = useState("");
  const [staffState, setStaffState] = useState("");
  const auth = getAuth(app);

  const authChange = () =>
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        await axios
          .get(`https://kind-waders-hare.cyclic.app/users/?uid=${uid}`)
          .then((data) => {
            console.log(data.data);
            const loggedInUser = data.data;
            setCurrentUser(loggedInUser);
            setStationName(loggedInUser.station);
            setStationId(loggedInUser.stationId);
            setStaffState(loggedInUser.address.state);
          });
      } else {
        setCurrentUser(null);
        setStationName("");
        setStationId("");
        setStaffState("");
      }
    });

  useEffect(() => {
    return authChange();
  }, []);

  return (
    <UserContext.Provider
      value={{
        staffState,
        currentUser,
        stationName,
        setStationName,
        stationId,
        setStationId,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
