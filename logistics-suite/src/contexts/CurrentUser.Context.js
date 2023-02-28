/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

import React, { createContext, useContext, useEffect, useState } from "react";

import { app } from "../firebase/firebase";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [stationName, setStationName] = useState("");
  const [stationId, setStationId] = useState("");
  const [staffState, setStaffState] = useState("");
  const auth = getAuth(app);

  const authChange = () =>
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        uid.length === 10
          ? await axios
              .get(`https://ls.webcouture.com.ng/users/?uid=${uid}`)
              .then((data) => {
                const loggedInUser = data.data;
                setIsLoading(false);
                setCurrentUser(loggedInUser);
                setStationName(loggedInUser.station);
                setStationId(loggedInUser.stationId);
                setStaffState(loggedInUser?.address?.state);
              })
          : signOut(auth).then(() => {
              setCurrentUser(null);
            });
      } else {
        setCurrentUser(null);
        setStationName("");
        setStationId("");
        setStaffState("");
        setIsLoading(false);
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
        isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
