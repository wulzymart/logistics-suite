/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useUserContext } from "../contexts/CurrentUser.Context";
import {
  collection,
  getCountFromServer,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useState } from "react";

const Summary = () => {
  const { currentUser, stationName } = useUserContext();
  const [staffOrdCt, setStaffOrdCt] = useState(0);
  const [statOrdCt, setStatOrdCt] = useState(0);
  const [statInOrdCt, setStatInOrdCt] = useState(0);
  const ordersRef = collection(db, "orders");
  const today = new Date().toDateString();
  //inbound warehoused destination arrived
  const [inWhd, setInWhd] = useState(0);
  //inbound warehouse transhiped arrived
  const [inWht, setInWht] = useState(0);
  // outbound trip assigned, not dispached
  const [outWhtnoD, setoutWhtnoD] = useState(0);
  // outbound order just received
  const [outWhnew, setOutWhnew] = useState(0);

  // outbound transhipped warehouse trip assigned no dispatch
  const [trOutWh, setTrOutWh] = useState(0);
  const staffOrderCount = async () => {
    const q = query(
      ordersRef,

      where("dateCreated", ">=", Timestamp.fromDate(new Date(today))),
      where("processedBy", "==", currentUser.id)
    );
    const snapshot = await getCountFromServer(q);
    setStaffOrdCt(snapshot.data().count);
  };
  const stationOrderCount = async () => {
    const q = query(
      ordersRef,

      where("dateCreated", ">=", Timestamp.fromDate(new Date(today))),
      where("originStation", "==", stationName)
    );
    const snapshot = await getCountFromServer(q);
    setStatOrdCt(snapshot.data().count);
  };
  const stationInboundOrderCount = async () => {
    const q = query(
      ordersRef,

      where("destinationStation", "==", stationName),
      where("deliveryStatus", "!=", "Delivered")
    );
    const snapshot = await getCountFromServer(q);
    setStatInOrdCt(snapshot.data().count);
  };

  const getQuery = async (query, setCount) => {
    const snapshot = await getCountFromServer(query);
    setCount(snapshot.data().count);
  };
  const warehouseinDestQuery = query(
    ordersRef,
    where("destinationStation", "==", stationName),
    where("deliveryStatus", "==", "Arrived at Destination Station")
  );
  const warehouseinTrQuery = query(
    ordersRef,
    where("transferStation", "==", stationName),
    where("deliveryStatus", "==", "At transfer station")
  );
  const warehouseOutnewQuery = query(
    ordersRef,
    where("originStation", "==", stationName),
    where("deliveryStatus", "==", "Order Received")
  );
  const warehouseOutnoDispatchQuery = query(
    ordersRef,
    where("originStation", "==", stationName),
    where("deliveryStatus", "==", "Booked for Dispatch")
  );
  const warehouseOutnoDispatchTrQuery = query(
    ordersRef,
    where("transferStation", "==", stationName),
    where("deliveryStatus", "==", "Set to leave transfer station")
  );

  const userData = {
    "Station Name": stationName,
    "User ID": currentUser.id,
    Role: currentUser.role,
    Rank: currentUser.rank,
    "Staff Order Count": staffOrdCt,
    "Station Order count": statOrdCt,
    "Station Incoming Count": statInOrdCt,
    "Station Warehouse": inWhd + inWht + outWhtnoD + outWhnew + trOutWh,
  };
  useEffect(() => {
    staffOrderCount();
    stationOrderCount();
    stationInboundOrderCount();
    getQuery(warehouseinDestQuery, setInWhd);
    getQuery(warehouseinTrQuery, setInWht);
    getQuery(warehouseOutnewQuery, setOutWhnew);
    getQuery(warehouseOutnoDispatchQuery, setoutWhtnoD);
    getQuery(warehouseOutnoDispatchTrQuery, setTrOutWh);
  }, []);
  return (
    <div>
      <div className="w-full flex justify-between text-pink-600 mb-16">
        <p className="italic">
          Welcome back <span>{currentUser.displayName}</span>
        </p>
      </div>
      <div className="flex flex-wrap w-full justify-center gap-4">
        {Object.keys(userData).map((key) => (
          <div
            key={key}
            className="text-center min-w-[230px] bg-teal-400 p-10 rounded-xl"
          >
            <p className="mb-3">{key}</p>
            <p>{userData[key]}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Summary;
