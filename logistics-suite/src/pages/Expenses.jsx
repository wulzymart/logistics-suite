/* eslint-disable react-hooks/exhaustive-deps */
import {
  collection,
  onSnapshot,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";

import Header from "../components/Header";

import TableGrid from "../components/TableGrid";

import { useUserContext } from "../contexts/CurrentUser.Context";

import { db } from "../firebase/firebase";

const Expenses = () => {
  const [rows, setRows] = useState([]);

  let date = new Date();
  const { stationName } = useUserContext();

  const columns = [
    {
      field: "id",
      headerName: "Id",
      width: 150,
    },
    {
      field: "approved",
      headerName: "Status",

      width: 150,
      valueGetter: (params) =>
        params.row.approved === ""
          ? "Pending"
          : params.row.approved === true
          ? "Approved"
          : params.row.approved === false && "Not Approved",
      renderCell: (params) => (
        <p
          className={`${
            params.value === "Approved"
              ? "bg-green-600"
              : params.value === "Pending"
              ? "bg-yellow-600"
              : params.value === "Not Approved" && "bg-red-700"
          } py-2 px-4 text-white rounded-md`}
        >
          {params.value}
        </p>
      ),
    },
    {
      field: "purpose",
      headerName: "Purose",

      width: 150,
    },
    {
      field: "amount",
      headerName: "Amount",

      width: 150,
    },
    {
      field: "description",
      headerName: "Description",

      width: 200,
    },
    {
      field: "orderId",
      headerName: "Order Id",

      width: 150,
    },

    {
      field: "tripId",
      headerName: "Trip Id",

      width: 150,
    },
    {
      field: "staffName",
      headerName: "Requested By",

      width: 150,
    },

    {
      field: "station",
      headerName: "Station",

      width: 150,
    },
  ];
  const getExpenses = () => {
    onSnapshot(
      query(
        collection(db, "expenses"),
        where("station", "==", stationName),
        where(
          "dateCreated",
          ">=",
          Timestamp.fromDate(new Date(date.toDateString()))
        )
      ),
      (docs) => {
        const tempData = [];
        docs.forEach((doc) => tempData.push(doc.data()));
        setRows(tempData);
      }
    );
  };
  useEffect(() => {
    return getExpenses();
  }, []);
  return (
    <div>
      <Header title="View Station Expenses" />
      <div className="w-full">
        <TableGrid
          autoHeight
          columns={columns}
          rows={rows}
          setSelectedId={() => {}}
        />
      </div>
    </div>
  );
};
export default Expenses;
