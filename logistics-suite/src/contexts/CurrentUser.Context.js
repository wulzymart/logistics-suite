/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { app } from "../firebase/firebase";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState("loading");
  const [stationName, setStationName] = useState(null);
  const [stationId, setStationId] = useState("");
  const auth = getAuth(app);
  useEffect(() => {
    return async () => {
      return onAuthStateChanged(auth, async (user) => {
        if (user) {
          const uid = user.uid;
          await axios.get(`/users`, { params: { uid } }).then((data) => {
            const loggedInUser = data.data;

            setCurrentUser(loggedInUser);
            setStationName(loggedInUser.station);
            setStationId(loggedInUser.stationId);
          });
        } else {
          setCurrentUser(null);
          setStationName("");
          setStationId("");
        }
      });
    };
  }, []);

  return (
    <UserContext.Provider
      value={{
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
