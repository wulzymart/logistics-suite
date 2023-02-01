/* eslint-disable react-hooks/exhaustive-deps */
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { useUserContext } from "./CurrentUser.Context";

const TablesContext = createContext();
export const TableProvider = ({ children }) => {
  const { stationName } = useUserContext();
  const [inRows, setInRows] = useState([]);
  const [outRows, setOutRows] = useState([]);

  const ordersRef = collection(db, "orders");
  const InboundQuery = query(
    ordersRef,
    where("destinationStation", "==", stationName),
    orderBy("dateCreated", "asc")
  );
  const OutboundQuery = query(
    ordersRef,
    where("originStation", "==", stationName),
    orderBy("dateCreated", "asc")
  );

  const getQuery = (query, setRows) => {
    onSnapshot(query, (snapshots) => {
      const tempData = [];
      snapshots.forEach((snapshot) => {
        tempData.push(snapshot.data());
      });

      setRows(tempData);
    });
  };
  useEffect(() => {
    stationName && getQuery(InboundQuery, setInRows);
    stationName && getQuery(OutboundQuery, setOutRows);
  }, [stationName]);

  return (
    <TablesContext.Provider value={{ inRows, outRows }}>
      {children}
    </TablesContext.Provider>
  );
};
export const useTablesContext = () => useContext(TablesContext);
