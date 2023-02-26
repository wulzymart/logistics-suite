/* eslint-disable react-hooks/exhaustive-deps */
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { useUserContext } from "./CurrentUser.Context";
let today = new Date();
let date = new Date(today.toDateString());
console.log(today, date);

const TablesContext = createContext();
export const TableProvider = ({ children }) => {
  const { stationName } = useUserContext();
  const [inRows, setInRows] = useState([]);
  const [transshipInRows, setTransshipInRows] = useState([]);
  const [transshipOutRows, setTransshipOutRows] = useState([]);
  const [outRows, setOutRows] = useState([]);
  const [pickupRequests, setPickupRequests] = useState([]);
  const [unattendedReqs, setUnattendedReqs] = useState(0);

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
  const requestsQuery = query(
    collection(db, "pickups"),
    where("nearestStation", "==", stationName),
    where("dateCreated", ">=", Timestamp.fromDate(date)),
    orderBy("dateCreated", "desc")
  );
  const getRequests = () => {
    onSnapshot(requestsQuery, (snapshots) => {
      const tempData = [];
      snapshots.forEach((snapshot) => {
        tempData.push(snapshot.data());
      });
      let count = 0;
      tempData.length &&
        tempData.forEach((data) => !data.attendedTo && count++);
      setPickupRequests(tempData);
      setUnattendedReqs(count);
    });
  };
  useEffect(() => {
    stationName && getQuery(InboundQuery, setInRows);
    stationName && getQuery(OutboundQuery, setOutRows);
    stationName && getQuery(transshippedInQuery, setTransshipInRows);
    stationName && getQuery(transshippedOutQuery, setTransshipOutRows);
    stationName && getRequests();
  }, [stationName]);

  return (
    <TablesContext.Provider
      value={{
        inRows,
        outRows,
        transshipInRows,
        transshipOutRows,
        pickupRequests,
        unattendedReqs,
      }}
    >
      {children}
    </TablesContext.Provider>
  );
};
export const useTablesContext = () => useContext(TablesContext);
