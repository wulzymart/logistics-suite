// Customer pickup requests pertaining to users station will be displayed here, user will be able to mak as attended to when an action is taken

// getCount of unattended data from the length of the array, let notifictaion icon be red and display number of unattended requests

import React from "react";
import { Link } from "react-router-dom";

import Header from "../components/Header";

import TableGrid from "../components/TableGrid";
import { useTablesContext } from "../contexts/TablesContext";

const PickupRequests = () => {
  const { pickupRequests } = useTablesContext();

  function getCustomerName(params) {
    return `${params.row.firstName || ""} ${params.row.lastName || ""}`;
  }

  const columns = [
    {
      field: "id",
      headerName: "Id",
      width: 70,
      renderCell: (param) => {
        return (
          <Link to={`/pickup-requests/${param.value}`}>{param.value}</Link>
        );
      },
    },
    {
      field: "customerName",
      headerName: "Customer Name",
      valueGetter: getCustomerName,
      width: 150,
    },
    {
      field: "businessName",
      headerName: "Business Name",
      width: 150,
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      width: 150,
    },

    {
      field: "originAddress",
      headerName: "Address",
      width: 150,
    },
    {
      field: "destinationState",
      headerName: "Destination State",
      width: 150,
    },
    {
      field: "attendedTo",
      headerName: "Responded",
      renderCell: ({ value }) => {
        return (
          <div
            className={`${
              value ? "bg-green-500" : "bg-red-700"
            } text-white rounded-lg px-4 py-2`}
          >
            {value ? "Handled" : "Not Yet Handled"}
          </div>
        );
      },
      width: 150,
    },
  ];

  return (
    <div>
      <Header title="Pickup Requests" />
      <div className="w-full">
        <TableGrid
          autoHeight
          columns={columns}
          rows={pickupRequests}
          setSelectedId={() => {}}
        />
      </div>
    </div>
  );
};

export default PickupRequests;
