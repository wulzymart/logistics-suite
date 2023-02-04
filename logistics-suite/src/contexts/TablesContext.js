/* eslint-disable react-hooks/exhaustive-deps */
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { useUserContext } from "./CurrentUser.Context";

const TablesContext = createContext();
export const TableProvider = ({ children }) => {
  const { stationName } = useUserContext();
  const [inRows, setInRows] = useState([]);
  const [transshipInRows, setTransshipInRows] = useState([]);
  const [transshipOutRows, setTransshipOutRows] = useState([]);
  const [outRows, setOutRows] = useState([]);

  const ordersRef = collection(db, "orders");
  const InboundQuery = query(
    ordersRef,
    where("destinationStation", "==", stationName),
    where("deliveryStatus", "!=", "Delivered")
  );
  const OutboundQuery = query(
    ordersRef,
    where("originStation", "==", stationName),
    where("deliveryStatus", "!=", "Delivered")
  );
  const transshippedInQuery = query(
    ordersRef,
    where("transferStation", "==", stationName),
    where("transshipIn", "==", true),
    where("deliveryStatus", "!=", "Delivered")
  );
  const transshippedOutQuery = query(
    ordersRef,
    where("transferStation", "==", stationName),
    where("transshipOut", "==", true),
    where("deliveryStatus", "!=", "Delivered")
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
    stationName && getQuery(transshippedInQuery, setTransshipInRows);
    stationName && getQuery(transshippedOutQuery, setTransshipOutRows);
  }, [stationName]);

  return (
    <TablesContext.Provider
      value={{ inRows, outRows, transshipInRows, transshipOutRows }}
    >
      {children}
    </TablesContext.Provider>
  );
};
export const useTablesContext = () => useContext(TablesContext);
