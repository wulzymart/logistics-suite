import React, { useState } from "react";
import { HiSearch } from "react-icons/hi";
import CustomButton from "../components/button/button";
import Header from "../components/Header";

import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import Select from "../components/select-input/select";
import { useAppConfigContext } from "../contexts/AppConfig.context";
import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import TableGrid from "../components/TableGrid";
import { GridToolbar } from "@mui/x-data-grid";

const Outflow = () => {
  const date = new Date();
  const { stationsList } = useAppConfigContext();
  const [station, setStation] = useState("");

  const [startDate, setStartDate] = useState(date);
  const [endDate, setEndDate] = useState(date);
  const ecommercePayments = query(
    collection(db, "walletPayout"),
    where("dateMade", ">=", Timestamp.fromDate(startDate)),
    where("dateMade", "<=", Timestamp.fromDate(endDate)),
    orderBy("dateMade", "asc")
  );
  const allExpenses = query(
    collection(db, "expenses"),
    where("approved", "==", true),
    where("dateCreated", ">=", Timestamp.fromDate(startDate)),
    where("dateCreated", "<=", Timestamp.fromDate(endDate)),
    orderBy("dateCreated", "asc")
  );
  const stationExpenses = query(
    collection(db, "expenses"),
    where("approved", "==", true),
    where("station", "==", station),
    where("dateCreated", ">=", Timestamp.fromDate(startDate)),
    where("dateCreated", "<=", Timestamp.fromDate(endDate)),
    orderBy("dateCreated", "asc")
  );
  function getDate(params) {
    return params.row.dateMade.toDate().toDateString();
  }
  function getDatePP(params) {
    return params.row.dateCreated.toDate().toDateString();
  }
  async function getQuery(queried, setRows, setTotal) {
    await getDocs(queried).then((docs) => {
      const tempData = [];
      docs.forEach((doc) => tempData.push(doc.data()));
      const total = tempData.reduce((acc, data) => acc + +data.amount, 0);
      setRows(tempData);
      setTotal(total);
    });
  }
  const ecomColumns = [
    {
      field: "id",
      headerName: "Id",
      width: 150,
    },
    { field: "amount", headerName: "Amount (NGN)", width: 150 },
    {
      field: "dateMade",
      headerName: "Date",
      valueGetter: getDate,
      width: 150,
    },
    {
      field: "customerName",
      headerName: "Customer's Name",
      width: 150,
    },
    {
      field: "businessName",
      headerName: "Business Name",
      width: 150,
    },
    {
      field: "station",
      headerName: "Station",
      width: 150,
    },
    {
      field: "processedBy",
      headerName: "Handler",
      width: 150,
    },
  ];
  const ppColumns = [
    {
      field: "id",
      headerName: "Id",
      width: 150,
    },
    {
      field: "dateCreated",
      headerName: "Date",
      valueGetter: getDatePP,
      width: 150,
    },
    {
      field: "purpose",
      headerName: "Purpose",
      width: 150,
    },
    {
      field: "description",
      headerName: "Business Name",
      width: 150,
    },
    {
      field: "station",
      headerName: "Station",
      width: 150,
    },
    {
      field: "staffName",
      headerName: "Requested By",
      width: 150,
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
  ];
  const [ecommRows, setEcommRows] = useState([]);
  const [ecomTotal, setEcomTotal] = useState(0);
  const [ppRows, setPprows] = useState([]);
  const [ppTotal, setPpTotal] = useState(0);

  return (
    <div>
      <Header title="Account Outflow Summary" />
      <div>
        <div className=" gap-4 items-center flex justify-end mb-4">
          <div className="p-4 rounded-lg flex flex-col md:flex-row w-1/2 justify-end  gap-4">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                renderInput={(props) => (
                  <TextField
                    {...props}
                    inputProps={{ ...props.inputProps, readOnly: true }}
                  />
                )}
                label="Start"
                value={startDate}
                onChange={(newValue) => {
                  setStartDate(newValue.$d);
                }}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                renderInput={(props) => (
                  <TextField
                    {...props}
                    inputProps={{ ...props.inputProps, readOnly: true }}
                  />
                )}
                label="End"
                value={endDate}
                onChange={(newValue) => {
                  setEndDate(newValue.$d);
                }}
              />
            </LocalizationProvider>
          </div>
        </div>
        <div className=" bg-blue-100 px-8 rounded-lg mb-4 flex flex-col md:flex-row justify-between  items-center">
          <p className="font-bold text-xl my-8">E-commerce Wallet Payments</p>
          <div className=" flex flex-col md:flex-row">
            <CustomButton
              handleClick={async () => {
                await getQuery(ecommercePayments, setEcommRows, setEcomTotal);
              }}
            >
              Get E-commerce Payments
            </CustomButton>
          </div>
        </div>
        <div className="w-full">
          <TableGrid
            components={{
              Toolbar: GridToolbar,
            }}
            columns={ecomColumns}
            rows={ecommRows}
            autoHeight
            setSelectedId={() => {}}
          />
        </div>
        <div className="flex justify-end mt-4">
          <p>
            <span className="font-bold">Total:</span> {ecomTotal}NGN
          </p>
        </div>
      </div>
      <div className="w-full mt-8 bg-blue-200 px-8 py-4 rounded-lg flex flex-col md:flex-row justify-between items-center">
        <p className="font-bold text-xl inline">Expenses Summary</p>
        <div className="w-full flex flex-col md:flex-row justify-end items-center gap-4">
          <div className="inline w-full md:w-[200px] relative">
            <Select
              options={stationsList ? stationsList : [""]}
              children="Select Station"
              value={station}
              handleChange={(e) => setStation(e.target.value)}
            />
            <button
              onClick={async () => {
                await getQuery(stationExpenses, setPprows, setPpTotal);
              }}
              className="absolute right-0 top-[0.5px] bg-blue-800 text-xl font-bold text-white  rounded-lg h-10 w-10 flex justify-center items-center"
            >
              <HiSearch />
            </button>
          </div>
          <div className="">
            <CustomButton
              handleClick={async () =>
                await getQuery(allExpenses, setPprows, setPpTotal)
              }
            >
              All Stations
            </CustomButton>
          </div>
        </div>
      </div>
      <div className="w-full">
        <TableGrid
          columns={ppColumns}
          rows={ppRows}
          autoHeight
          setSelectedId={() => {}}
          components={{
            Toolbar: GridToolbar,
          }}
        />
      </div>
      <div className="flex justify-end mt-4">
        <p>
          <span className="font-bold">Total:</span> {ppTotal}NGN
        </p>
      </div>
    </div>
  );
};

export default Outflow;
