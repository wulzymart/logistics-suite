/* eslint-disable react-hooks/exhaustive-deps */

import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
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
  const orders = {};
  noTripOrders.map((item) => Object.assign(orders, { [item.id]: item }));
  const { stationName, currentUser } = useUserContext();
  const [selectedIds, setSelectedIds] = useState([]);
  const [tripId, setTripId] = useState("");
  const [trips, setTrips] = useState({});
  const [tripsList, setTripsList] = useState(["Awaiting Trips"]);
  const [pin, setPin] = useState();
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
      const attendantName = trips[tripId].attendantName;
      const driverPhone = trips[tripId].driverPhone;
      const attendantPhone = trips[tripId].attendantPhone;
      let date = new Date();
      const trackingInfo = trips[tripId].trackingInfo;
      const newTrackingInfo = {
        info: "Your order has been booked for dispatch, awaiting shipment",
        time: date.toLocaleString(),
      };
      trackingInfo.push(newTrackingInfo);
      selectedIds.forEach(async (id) => {
        const orderRef = doc(db, "orders", id);
        await setDoc(
          orderRef,
          {
            driverName,
            driverPhone,
            attendantName,
            attendantPhone,
            tripId,
            deliveryStatus: "Booked for Dispatch",
            trackingInfo,
          },
          { merge: true }
        ).catch((err) => alert("error: ", err));
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
      headerClassName: "bg-blue-200 ",
      width: 150,
    },
    {
      field: "customerName",
      headerName: "Customer's Name",
      headerClassName: "bg-blue-200 ",
      width: 150,
    },
    {
      field: "destinationStation",
      headerName: "Destination Station",
      headerClassName: "bg-blue-200 ",
      width: 150,
    },
    {
      field: "receiverName",
      headerName: "Receiver's Name",
      headerClassName: "bg-blue-200 ",
      width: 150,
      valueGetter: getReceiverName,
    },
    {
      field: "receiverAddress",
      headerName: "Receiver's Address",
      headerClassName: "bg-blue-200 ",
      width: 150,
      valueGetter: getReceiverAddress,
    },

    {
      field: "tripId",
      headerName: "Trip Id",
      headerClassName: "bg-blue-200 ",
      width: 150,
    },
    {
      field: "deliveryStatus",
      headerName: "Delivery Status",
      headerClassName: "bg-blue-200 ",
      width: 150,
    },
    {
      field: "paymentStatus",
      headerName: "Payment Status",
      headerClassName: "bg-blue-200 ",
      width: 150,
    },
  ];
  const modalColumns = [
    {
      field: "id",
      headerName: "Tracking Id",
      headerClassName: "bg-blue-200 ",
      width: 150,
    },
    {
      field: "customerName",
      headerName: "Customer's Name",
      headerClassName: "bg-blue-200 ",
      width: 150,
    },
    {
      field: "destinationStation",
      headerName: "Destination Station",
      headerClassName: "bg-blue-200 ",
      width: 150,
    },
    {
      field: "receiverName",
      headerName: "Receiver's Name",
      headerClassName: "bg-blue-200 ",
      width: 150,
      valueGetter: getReceiverName,
    },
    {
      field: "receiverAddress",
      headerName: "Receiver's Address",
      headerClassName: "bg-blue-200 ",
      width: 150,
      valueGetter: getReceiverAddress,
    },
  ];

  useEffect(() => {
    let today = new Date();
    today = today.toDateString();
    console.log(today);
    const tripsRef = collection(db, "trips");

    const getTrips = async () => {
      onSnapshot(
        query(
          tripsRef,
          where("originStation", "==", stationName),
          where("dateCreated", ">=", Timestamp.fromDate(new Date(today)))
        ),
        (docs) => {
          const tempData = {};
          const tempList = [];
          docs.forEach((doc) => {
            Object.assign(tempData, { [doc.data().id]: doc.data() });
            tempList.push(doc.data().id);
          });
          console.log(tempData);
          setTrips(tempData);
          setTripsList(tempList);
        }
      );
    };
    getTrips();
  }, []);
  useEffect(() => {
    const ordersRef = collection(db, "orders");
    const unassignedTripQuery = query(
      ordersRef,
      where("originStation", "==", stationName),
      where("tripId", "==", ""),
      orderBy("dateCreated", "asc")
    );
    onSnapshot(unassignedTripQuery, (docs) => {
      const tempData = [];
      docs.forEach((doc) => {
        Object.assign(tempData, { [doc.data().id]: doc.data() });
        tempData.push(doc.data());
      });
      console.log(tempData);
      setNoTripOrders(tempData);
    });
  }, []);
  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-8">Assign trip</h1>
      <div className="flex gap-4 items-center">
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
      <div className="mb-8 h-[500px] p-10">
        <TableGrid
          columns={columns}
          rows={noTripOrders}
          setSelectedId={setSelectedIds}
          rowsPerPage={10}
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
          <div className="h-[250px]">
            <TableGrid columns={modalColumns} rows={selectedOrders} />
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
