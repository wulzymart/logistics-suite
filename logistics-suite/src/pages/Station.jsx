/* eslint-disable react-hooks/exhaustive-deps */
import { TextField } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  onSnapshot,
  query,
  Timestamp,
  where,
  setDoc,
} from "firebase/firestore";

import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import { Link, useParams } from "react-router-dom";
import CustomButton from "../components/button/button";
import Header from "../components/Header";
import Input from "../components/input/input";
import Modal from "../components/Modal";
import PinModal from "../components/PinModal";
import Select from "../components/select-input/select";
import TableGrid from "../components/TableGrid";
import { useAppConfigContext } from "../contexts/AppConfig.context";
import { useUserContext } from "../contexts/CurrentUser.Context";
import { useThemeContext } from "../contexts/themeContext";
import { db } from "../firebase/firebase";

const Station = () => {
  const { id } = useParams();
  const [station, setStation] = useState("");
  const { openModal, closeModal } = useThemeContext();
  const { currentUser } = useUserContext();
  const { states, comparePin } = useAppConfigContext();
  function getReceiverName(params) {
    return `${params.row.receiver.firstName || ""} ${
      params.row.receiver.lastName || ""
    }`;
  }
  function getReceiverAddress(params) {
    return `${params.row.receiver.address.streetAddress || ""} ${
      params.row.receiver.address.lga || ""
    } ${params.row.receiver.address.state || ""}`;
  }
  function getPaymentStatus(params) {
    const paid = params.row.paid;

    if (paid) {
      return "Paid";
    } else return "Unpaid";
  }
  const warehouseColumns = [
    {
      field: "id",
      headerName: "Tracking Id",

      width: 150,
      renderCell: (param) => {
        return <Link to={`/orders/${param.value}`}>{param.value}</Link>;
      },
    },
    {
      field: "customerName",
      headerName: "Customer's Name",

      width: 150,
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
      field: "receiverName",
      headerName: "Receiver's Name",

      width: 150,
      valueGetter: getReceiverName,
    },

    {
      field: "tripId",
      headerName: "Trip Id",

      width: 150,
    },
    {
      field: "deliveryStatus",
      headerName: "Delivery Status",

      width: 150,
    },
    {
      field: "paid",
      headerName: "Payment Status",
      width: 150,
      valueGetter: getPaymentStatus,
      renderCell: (param) => (
        <p
          className={`${
            param.value === "Unpaid" ? "text-red-500" : "text-green-800"
          }`}
        >
          {param.value}
        </p>
      ),
    },
  ];
  const outboundColumns = [
    {
      field: "id",
      headerName: "Tracking Id",

      width: 150,
      renderCell: (param) => {
        return <Link to={`/orders/${param.value}`}>{param.value}</Link>;
      },
    },
    {
      field: "customerName",
      headerName: "Customer's Name",

      width: 150,
    },
    {
      field: "transferStation",
      headerName: "Transfer Station",

      width: 150,
    },
    {
      field: "destinationStation",
      headerName: "Destination Station",

      width: 150,
    },
    {
      field: "receiverName",
      headerName: "Receiver's Name",

      width: 150,
      valueGetter: getReceiverName,
    },
    {
      field: "receiverAddress",
      headerName: "Receiver's Address",

      width: 150,
      valueGetter: getReceiverAddress,
    },

    {
      field: "tripId",
      headerName: "Trip Id",

      width: 150,
    },
    {
      field: "deliveryStatus",
      headerName: "Delivery Status",

      width: 150,
    },
    {
      field: "paid",
      headerName: "Payment Status",
      width: 150,
      valueGetter: getPaymentStatus,
      renderCell: (param) => (
        <p
          className={`${
            param.value === "Unpaid" ? "text-red-500" : "text-green-800"
          }`}
        >
          {param.value}
        </p>
      ),
    },
  ];
  const inboundColumns = [
    {
      field: "id",
      headerName: "Tracking Id",
      width: 150,
      renderCell: (param) => {
        return <Link to={`/orders/${param.value}`}>{param.value}</Link>;
      },
    },
    {
      field: "customerName",
      headerName: "Customer's Name",

      width: 150,
    },
    {
      field: "originStation",
      headerName: "Origin Station",

      width: 150,
    },
    {
      field: "transferStation",
      headerName: "Transfer Station",

      width: 150,
    },
    {
      field: "destinationStation",
      headerName: "Destination Station",

      width: 150,
    },

    {
      field: "receiverName",
      headerName: "Receiver's Name",

      width: 150,
      valueGetter: getReceiverName,
    },
    {
      field: "receiverAddress",
      headerName: "Receiver's Address",

      width: 150,
      valueGetter: getReceiverAddress,
    },

    {
      field: "tripId",
      headerName: "Trip Id",

      width: 150,
    },
    {
      field: "deliveryStatus",
      headerName: "Delivery Status",

      width: 150,
    },
    {
      field: "paid",
      headerName: "Payment Status",
      width: 150,
      valueGetter: getPaymentStatus,
      renderCell: (param) => (
        <p
          className={`${
            param.value === "Unpaid" ? "text-red-500" : "text-green-800"
          }`}
        >
          {param.value}
        </p>
      ),
    },
  ];
  //inbound warehoused destination arrived
  const [inWhd, setInWhd] = useState([]);
  //inbound warehouse transhiped arrived
  const [inWht, setInWht] = useState([]);
  // outbound trip assigned, not dispached
  const [outWhtnoD, setoutWhtnoD] = useState([]);
  // outbound order just received
  const [outWhnew, setOutWhnew] = useState([]);

  // outbound transhipped warehouse trip assigned no dispatch
  const [trOutWh, setTrOutWh] = useState([]);
  //inbound orders for time set
  const [inbound, setInbound] = useState([]);
  //outbound orders
  const [outbound, setOutbound] = useState([]);

  //time boundaries
  const [inStartDate, setInStartDate] = useState(new Date());
  const [outStartDate, setOutStartDate] = useState(new Date());
  const [inEndDate, setInEndDate] = useState(new Date());
  const [outEndDate, setOutEndDate] = useState(new Date());
  const ordersRef = collection(db, "orders");
  const [phoneNumber1, setPhone1] = useState("");
  const [phoneNumber2, setPhone2] = useState("");
  const [lga, setLga] = useState("");
  const [shortCode, setShortCode] = useState();
  const [streetAddress, setStreetAddress] = useState("");
  const [action, setAction] = useState("");
  const [pin, setPin] = useState("");
  const deleteStation = () => {
    deleteDoc(doc(db, "stations", id));
    const newStates = states;
    delete newStates[station.address.state].stations[station.name];
    axios.post(`https://server.firstlinelogistics.ng/states`, newStates);
    closeModal("pin-modal");
    closeModal("delete-station");
  };
  const editStation = () => {
    const newStates = states;
    const newStation = {
      ...station,
      id,
      phoneNumber1,
      phoneNumber2,
      shortCode,
      address: { ...station.address, lga, streetAddress },
    };
    newStates[station.address.state].stations[station.name] = { ...newStation };
    axios.post(`https://server.firstlinelogistics.ng/states`, newStates);
    setDoc(doc(db, "stations", id), { ...newStation });
    closeModal("pin-modal");
    closeModal("edit-station");
  };
  const handleSubmit = () => {
    if (comparePin(pin, currentUser.pin)) {
      action === "delete" && deleteStation();
      action === "edit" && editStation();
    } else alert("Incorrent Pin");
  };

  const inboundQuery = station
    ? query(
        ordersRef,
        where("destinationStation", "==", station.name),
        where("dateCreated", ">=", Timestamp.fromDate(inStartDate)),
        where("dateCreated", "<=", Timestamp.fromDate(inEndDate))
      )
    : "";
  const outboundQuery = station
    ? query(
        ordersRef,
        where("originStation", "==", station.name),
        where("dateCreated", ">=", Timestamp.fromDate(outStartDate)),
        where("dateCreated", "<=", Timestamp.fromDate(outEndDate))
      )
    : "";
  async function getInAndOutboudQuery(queried, setRows) {
    await getDocs(queried).then((docs) => {
      const tempData = [];
      docs.forEach((doc) => tempData.push(doc.data()));
      setRows(tempData);
    });
  }
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
    const getStation = async () => {
      await getDoc(doc(db, "stations", id)).then((doc) => {
        setStation(doc.data());
        setPhone1(doc.data().phoneNumber1);
        setPhone2(doc.data().phoneNumber2);
        setLga(doc.data().address.lga);
        setShortCode(doc.data().shortCode);
        setStreetAddress(doc.data().address.streetAddress);
      });
    };
    getStation();
  }, [id]);
  useEffect(() => {
    if (station) {
      const warehouseinDestQuery = query(
        ordersRef,
        where("destinationStation", "==", station.name),
        where("deliveryStatus", "==", "Arrived at Destination Station")
      );
      const warehouseinTrQuery = query(
        ordersRef,
        where("transferStation", "==", station.name),
        where("deliveryStatus", "==", "At transfer station")
      );
      const warehouseOutnewQuery = query(
        ordersRef,
        where("originStation", "==", station.name),
        where("deliveryStatus", "==", "Order Received")
      );
      const warehouseOutnoDispatchQuery = query(
        ordersRef,
        where("originStation", "==", station.name),
        where("deliveryStatus", "==", "Booked for Dispatch")
      );
      const warehouseOutnoDispatchTrQuery = query(
        ordersRef,
        where("transferStation", "==", station.name),
        where("deliveryStatus", "==", "Set to leave transfer station")
      );
      getQuery(warehouseinDestQuery, setInWhd);
      getQuery(warehouseinTrQuery, setInWht);
      getQuery(warehouseOutnewQuery, setOutWhnew);
      getQuery(warehouseOutnoDispatchQuery, setoutWhtnoD);
      getQuery(warehouseOutnoDispatchTrQuery, setTrOutWh);
    }
  }, [station]);

  return (
    station && (
      <div>
        <Header title="View Station" />
        <div className="w-[100%] rounded overflow-hidden shadow-lg bg-white">
          <div className="px-6 py-4">
            <h2 className="font-bold text-xl mb-4">{station.name}</h2>
            <div className="flex flex-wrap gap-x-8 gap-y-4 ">
              <p className="text-gray-700 text-base mb-2">
                Short code: {station.shortCode}
              </p>
              <p className="text-gray-700 text-base mb-2">
                Phone number 1: {station.phoneNumber1}
              </p>
              {station.phoneNumber2 && (
                <p className="text-gray-700 text-base mb-2">
                  Phone number 2: {station.phoneNumber2 || "N/A"}
                </p>
              )}
              <div className="w-[400px] flex gap-2">
                <p className="text-gray-700 text-base mb-2 ">Address:</p>
                <span className="text-gray-700 text-base ml-4 mb-2">
                  {station.address.streetAddress}, {station.address.lga},{" "}
                  {station.address.state}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[100%] rounded overflow-hidden shadow-lg bg-white mt-8">
          <div className="px-6 py-4 w-full flex flex-col md:flex-row gap-y-4 gap-x-6 justify-end">
            <CustomButton handleClick={() => openModal("edit-station")}>
              Edit Station Details
            </CustomButton>
            <CustomButton handleClick={() => openModal("delete-station")}>
              Delete Station
            </CustomButton>
          </div>
          <Modal title="Confirm Station Deletion" id="delete-station">
            <div className="p-8">
              <p>
                Are you sure you want to delete station{" "}
                <em className="font-bold">
                  {station.name} {station.shortCode}
                </em>
              </p>
              <p className="italic text-red-500 mb-6">
                This will not be reversible
              </p>
              <CustomButton
                handleClick={() => {
                  setAction("delete");
                  openModal("pin-modal");
                }}
              >
                Proceed
              </CustomButton>
            </div>
          </Modal>
          <Modal title="Edit station" id="edit-station">
            <div className="p-8">
              <p className="text-xl text-red-800 mb-8">
                You are editing {station.name} Please fill in the appropriate
                information before proceeding
              </p>
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="flex flex-col gap-4 w-full ">
                  <p className="min-w-fit">Short Code</p>
                  <Input
                    type="text"
                    value={shortCode}
                    handleChange={(e) => setShortCode(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-4 w-full ">
                  <p>Phone Number 1</p>

                  <PhoneInput
                    country={"ng"}
                    onlyCountries={["ng"]}
                    prefix="+"
                    value={phoneNumber1}
                    onChange={(phone) => {
                      phone = "+" + phone;
                      setPhone1(phone);
                    }}
                    containerClass={"h-full !w-full rounded-lg"}
                    inputClass={"!w-full !min-h-full"}
                  />
                </div>
                <div className="flex flex-col gap-4 w-full ">
                  <p>Phone Number 2</p>

                  <PhoneInput
                    placeholder="Phone2"
                    country={"ng"}
                    onlyCountries={["ng"]}
                    prefix="+"
                    value={phoneNumber2}
                    onChange={(phone) => {
                      phone = "+" + phone;
                      setPhone2(phone);
                    }}
                    containerClass={" h-full rounded-lg !w-full"}
                    inputClass={"!w-full !min-h-full"}
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="flex flex-col gap-4 w-full ">
                  <p>LGA</p>
                  <Select
                    options={
                      station.address.state
                        ? states[station.address.state].lgas
                        : [""]
                    }
                    name="stationLga"
                    value={lga}
                    handleChange={(e) => {
                      setLga(e.target.value);
                    }}
                  >
                    Select LGA
                  </Select>
                </div>
              </div>
              <p>Address</p>
              <Input
                type="text"
                value={streetAddress}
                handleChange={(e) => setStreetAddress(e.target.value)}
              />
              <div className="w-full mt-8">
                <CustomButton
                  handleClick={() => {
                    setAction("edit");
                    openModal("pin-modal");
                  }}
                >
                  Save station
                </CustomButton>
              </div>
            </div>
          </Modal>
          <PinModal
            pin={pin}
            handleChange={(e) => setPin(e.target.value)}
            handleSubmit={handleSubmit}
          />
        </div>
        <div className="w-[100%] mt-8 px-6 py-8 first-letter:rounded overflow-hidden shadow-lg bg-white">
          <p className="text-2xl font-bold">Orders in warehouse</p>
          <div className="w-full mt-6">
            <TableGrid
              columns={warehouseColumns}
              rows={[...inWht, ...inWhd, ...outWhnew, ...outWhtnoD, ...trOutWh]}
              autoHeight
              setSelectedId={() => {}}
            />
          </div>
        </div>
        <div className="w-[100%] mt-8 px-6 py-8 first-letter:rounded overflow-hidden shadow-lg bg-white">
          <p className="text-2xl font-bold mb-4">OutBound Orders</p>
          <div>
            <div className=" gap-4 items-center flex justify-end mb-4">
              <div className="p-4 rounded-lg flex flex-col md:flex-row w-full justify-end  gap-4">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    renderInput={(props) => (
                      <TextField
                        {...props}
                        inputProps={{ ...props.inputProps, readOnly: true }}
                      />
                    )}
                    label="Start"
                    value={outStartDate}
                    onChange={(newValue) => {
                      setOutStartDate(newValue.$d);
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
                    value={outEndDate}
                    onChange={(newValue) => {
                      setOutEndDate(newValue.$d);
                    }}
                  />
                </LocalizationProvider>
                <CustomButton
                  handleClick={async () => {
                    await getInAndOutboudQuery(outboundQuery, setOutbound);
                  }}
                >
                  Get Data
                </CustomButton>
              </div>
            </div>
          </div>
          <div className="w-full mt-6">
            <TableGrid
              columns={outboundColumns}
              rows={outbound}
              autoHeight
              setSelectedId={() => {}}
            />
          </div>
        </div>
        <div className="w-[100%] mt-8 px-6 py-8 first-letter:rounded overflow-hidden shadow-lg bg-white">
          <p className="text-2xl font-bold mb-4">Inbound Orders</p>
          <div>
            <div className=" gap-4 items-center flex justify-end mb-4">
              <div className="p-4 rounded-lg flex flex-col md:flex-row w-full justify-end  gap-4">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    renderInput={(props) => (
                      <TextField
                        {...props}
                        inputProps={{ ...props.inputProps, readOnly: true }}
                      />
                    )}
                    label="Start"
                    value={inStartDate}
                    onChange={(newValue) => {
                      setInStartDate(newValue.$d);
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
                    value={inEndDate}
                    onChange={(newValue) => {
                      setInEndDate(newValue.$d);
                    }}
                  />
                </LocalizationProvider>
                <CustomButton
                  handleClick={async () => {
                    await getInAndOutboudQuery(inboundQuery, setInbound);
                  }}
                >
                  Get Data
                </CustomButton>
              </div>
            </div>
          </div>
          <div className="w-full mt-6">
            <TableGrid
              columns={inboundColumns}
              rows={inbound}
              autoHeight
              setSelectedId={() => {}}
            />
          </div>
        </div>
      </div>
    )
  );
};

export default Station;
