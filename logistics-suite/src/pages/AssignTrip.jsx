/* eslint-disable react-hooks/exhaustive-deps */

import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CustomButton from "../components/button/button";
import Modal from "../components/Modal";
import PinModal from "../components/PinModal";
import Select from "../components/select-input/select";
import TableGrid from "../components/TableGrid";
import { useAppConfigContext } from "../contexts/AppConfig.context";
import { useUserContext } from "../contexts/CurrentUser.Context";
import { useThemeContext } from "../contexts/themeContext";
import { db } from "../firebase/firebase";

const AssignTrip = () => {
  const { openModal, closeModal } = useThemeContext();
  const { comparePin } = useAppConfigContext();
  const [noTripOrders, setNoTripOrders] = useState([]);
  const [transhippedOutOrders, setTransOutOrders] = useState([]);
  const orders = {};
  noTripOrders.map((item) => Object.assign(orders, { [item.id]: item }));
  transhippedOutOrders.map((item) =>
    Object.assign(orders, { [item.id]: item })
  );
  transhippedOutOrders.map((item) =>
    Object.assign(orders, { [item.id]: item })
  );
  const { stationName, currentUser } = useUserContext();
  const [selectedIds, setSelectedIds] = useState([]);
  const [tripId, setTripId] = useState("");
  const [trips, setTrips] = useState({});
  const [tripsList, setTripsList] = useState([""]);
  const [pin, setPin] = useState("");
  const selectedOrders = selectedIds.map((id) => orders[id]);
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
  async function assignTrip() {
    if (comparePin(pin, currentUser.pin)) {
      const driverName = trips[tripId].driverName;
      const attendantName = trips[tripId].attendantName || "";
      const driverPhone = trips[tripId].driverPhone;
      const attendantPhone = trips[tripId].attendantPhone || "";
      let date = new Date();

      selectedIds.map(async (id) => {
        const trackingInfo = orders[id].trackingInfo;
        const { transshipOut } = orders[id];
        const newTrackingInfo = {
          info: !transshipOut
            ? "Your order has been booked for dispatch, awaiting shipment"
            : "Your order has been assigned a new vehicle and will soon continue to the destination station",
          time: date.toLocaleString("en-US"),
        };
        trackingInfo.push(newTrackingInfo);
        const history = orders[id].history;
        const orderRef = doc(db, "orders", id);
        history.push({
          info: `Trip ${tripId} assigned by ${currentUser.displayName}`,
          time: date.toLocaleString("en-US"),
        });

        await setDoc(
          orderRef,
          {
            driverName,
            driverPhone,
            attendantName,
            attendantPhone,
            tripId,
            deliveryStatus: !transshipOut
              ? "Booked for Dispatch"
              : "Set to leave transfer station",
            trackingInfo,
            history,
          },
          { merge: true }
        );
        setPin("");
        setTripId("");
        setSelectedIds([]);
        closeModal("pin-modal");
        closeModal("trips");
      });
    } else alert("Wrong user pin");
  }
  const columns = [
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
      field: "paymentStatus",
      headerName: "Payment Status",

      width: 150,
    },
  ];
  const modalColumns = [
    {
      field: "id",
      headerName: "Tracking Id",

      width: 150,
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
  ];

  useEffect(() => {
    let today = new Date();
    today = today.toDateString();

    const tripsRef = collection(db, "trips");

    const getTrips = async () => {
      await getDocs(
        query(
          tripsRef,
          where("tripType", "==", "Station-Station"),
          where("originStation", "==", stationName),
          where("dateCreated", ">=", Timestamp.fromDate(new Date(today)))
        )
      ).then((docs) => {
        const tempData = {};
        const tempList = [];
        docs.forEach((doc) => {
          Object.assign(tempData, { [doc.data().id]: doc.data() });
          tempList.push(doc.data().id);
        });
        console.log("loaded", tempData);
        setTrips(tempData);
        setTripsList(tempList);
      });
    };
    getTrips();
  }, []);
  useEffect(() => {
    const ordersRef = collection(db, "orders");
    const unassignedTripQuery = query(
      ordersRef,
      where("originStation", "==", stationName),
      where("intraCity", "==", "No"),
      where("tripId", "==", "")
    );
    const transshippedOutQuery = query(
      ordersRef,
      where("transferStation", "==", stationName),
      where("deliveryStatus", "==", "At transfer station")
    );
    const getOrders = async () => {
      await getDocs(unassignedTripQuery).then((docs) => {
        const tempData = [];
        docs.forEach((doc) => {
          tempData.push(doc.data());
        });

        setNoTripOrders(tempData);
      });
      await getDocs(transshippedOutQuery).then((docs) => {
        const tempData = [];
        docs.forEach((doc) => {
          tempData.push(doc.data());
        });

        setTransOutOrders(tempData);
      });
    };
    getOrders();
  }, []);
  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-8">Assign trip</h1>
      <div className="flex gap-4 items-center mb-8">
        <p className="text-lg min-w-fit">Select trip</p>
        <Select
          options={tripsList}
          value={tripId}
          handleChange={(e) => setTripId(e.target.value)}
          children="Select Trip"
        >
          Select Trip
        </Select>
      </div>
      <div className="mb-8  md:p-10 w-full">
        <TableGrid
          autoHeight
          columns={columns}
          rows={[...transhippedOutOrders, ...noTripOrders]}
          setSelectedId={setSelectedIds}
          pageSize={10}
          checkboxSelection
        />
      </div>
      <CustomButton
        handleClick={() => {
          tripId
            ? selectedIds.length
              ? openModal("trips")
              : alert("No order selected")
            : alert("No trip Selected");
        }}
      >
        Assign
      </CustomButton>
      <Modal id="trips" title="Confirm Selected Orders">
        <div className="p-10 ">
          <p className="text-xl text-red-400 italics">
            Please check the selected orders and ensure they are correct before
            proceeding
          </p>
          <div>
            <p>Trip Id: {tripId}</p>
          </div>
          <div className="w-full">
            <TableGrid
              autoHeight
              columns={modalColumns}
              rows={selectedIds.length === 0 ? [] : selectedOrders}
              setSelectedId={() => {}}
            />
          </div>
        </div>
        <CustomButton handleClick={() => openModal("pin-modal")}>
          Proceed
        </CustomButton>
      </Modal>
      <PinModal
        pin={pin}
        handleChange={(e) => setPin(e.target.value)}
        handleSubmit={assignTrip}
      />
    </div>
  );
};

export default AssignTrip;
