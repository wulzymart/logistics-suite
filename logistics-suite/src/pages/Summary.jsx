import React from "react";
import { useUserContext } from "../contexts/CurrentUser.Context";
import { useAppConfigContext } from "../contexts/AppConfig.context";
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
  const [staffOrdCt, setStaffOrdCt] = useState("");
  const [statOrdCt, setStatOrdCt] = useState("");
  const [statInOrdCt, setStatInOrdCt] = useState("");

  const today = new Date().toDateString();
  const staffOrderCount = async () => {
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef,

      where("dateCreated", ">=", Timestamp.fromDate(new Date(today))),
      where("processedBy", "==", currentUser.id)
    );
    const snapshot = await getCountFromServer(q);
    setStaffOrdCt(snapshot.data().count);
  };
  const stationOrderCount = async () => {
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef,

      where("dateCreated", ">=", Timestamp.fromDate(new Date(today))),
      where("originStation", "==", stationName)
    );
    const snapshot = await getCountFromServer(q);
    setStatOrdCt(snapshot.data().count);
  };
  const stationInboundOrderCount = async () => {
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef,

      where("destinationStation", "==", stationName),
      where("deliveryStatus", "!=", "Delivered")
    );
    const snapshot = await getCountFromServer(q);
    setStatInOrdCt(snapshot.data().count);
  };
  staffOrderCount();
  stationOrderCount();
  stationInboundOrderCount();

  const userData = {
    "Station Name": stationName,
    "User ID": currentUser.id,
    Role: currentUser.role,
    Rank: currentUser.rank,
    "Staff Order Count": staffOrdCt,
    "Station Order count": statOrdCt,
    "Station Incoming Count": 0,
    "Station Warehouse": statInOrdCt ? statInOrdCt : 0,
  };
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
