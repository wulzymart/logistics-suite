/* eslint-disable array-callback-return */
import React from "react";
import { Link } from "react-router-dom";

import Header from "../components/Header";

import TableGrid from "../components/TableGrid";
import { useAppConfigContext } from "../contexts/AppConfig.context";

const ManageStations = () => {
  const { stations } = useAppConfigContext();
  const stationsList = [];
  Object.keys(stations).map((station) => {
    stationsList.push(stations[station]);
  });

  function getState(params) {
    return `${params.row.address.state || ""}`;
  }
  function getAddress(params) {
    return `${params.row.address.streetAddress || ""}`;
  }
  function getPhone(params) {
    return `${params.row.phoneNumber1 || ""} ${params.row.phoneNumber2 || ""}`;
  }

  const columns = [
    {
      field: "id",
      headerName: "Id",
      width: 150,
      renderCell: (param) => {
        return (
          <Link to={`/super-admin/stations/${param.value}`}>{param.value}</Link>
        );
      },
    },
    {
      field: "name",
      headerName: "Name",
      width: 150,
    },
    {
      field: "shortCode",
      headerName: "Short Code",
      width: 150,
    },
    {
      field: "state",
      headerName: "State",
      width: 150,
      valueGetter: getState,
    },

    {
      field: "address",
      headerName: "Address",
      width: 150,
      valueGetter: getAddress,
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number(s)",
      width: 150,
      valueGetter: getPhone,
    },
  ];

  return (
    <div>
      <Header title="Manage Stations" />
      <div className="w-full">
        <TableGrid
          autoHeight
          columns={columns}
          rows={stationsList}
          setSelectedId={() => {}}
        />
      </div>
    </div>
  );
};

export default ManageStations;
