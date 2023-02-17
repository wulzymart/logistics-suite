/* eslint-disable react-hooks/exhaustive-deps */
import {
  collection,
  onSnapshot,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import React, { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import TableGrid from "../components/TableGrid";
import { useUserContext } from "../contexts/CurrentUser.Context";
import { db } from "../firebase/firebase";

const Trips = () => {
  const { stationName } = useUserContext();
  const [trips, setTrips] = useState([]);
  const columns = [
    {
      field: "id",
      headerName: "Trip Id",

      width: 150,
      renderCell: (param) => {
        return <Link to={`/trips/${param.value}`}>{param.value}</Link>;
      },
    },

    {
      field: "originStation",
      headerName: "Origin Station",

      width: 150,
    },
    {
      field: "destinationStation",
      headerName: "Destination Station",

      width: 150,
    },

    {
      field: "route",
      headerName: "Route",

      width: 150,
    },
    {
      field: "tripType",
      headerName: "Trip Type",

      width: 150,
    },
    {
      field: "serviceType",
      headerName: "Service Type",
      width: 150,
    },
    {
      field: "vehicle",
      headerName: "Vehicle",

      width: 150,
    },
    {
      field: "driverName",
      headerName: "Driver's Name",

      width: 150,
    },

    {
      field: "driverPhone",
      headerName: "Driver's Phone",

      width: 150,
    },
    {
      field: "attendantName",
      headerName: "Attendant's Name",

      width: 150,
    },
    {
      field: "attendantPhone",
      headerName: "Attendant's Phone",

      width: 150,
    },
  ];
  useEffect(() => {
    let today = new Date();
    today = today.toDateString();

    const tripsRef = collection(db, "trips");

    const getTrips = async () => {
      onSnapshot(
        query(
          tripsRef,
          where("originStation", "==", stationName),
          where("dateCreated", ">=", Timestamp.fromDate(new Date(today)))
        ),
        (docs) => {
          //   const tempData = {};
          const tempList = [];
          docs.forEach((doc) => {
            // Object.assign(tempData, { [doc.data().id]: doc.data() });
            tempList.push(doc.data());
          });

          setTrips(tempList);
        }
      );
    };
    getTrips();
  }, []);
  return (
    <div className="w-full">
      <Header title="View Trips" />
      <div className="mt-8 h-[500px]">
        <TableGrid
          autoHeight
          columns={columns}
          rows={trips}
          setSelectedId={() => {}}
        />
      </div>
    </div>
  );
};

export default Trips;
