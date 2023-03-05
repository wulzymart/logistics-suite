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

const AssignLocalTrip = () => {
  const { openModal, closeModal } = useThemeContext();
  const { comparePin } = useAppConfigContext();
  const { stationName, currentUser } = useUserContext();
  //apd =arrived pickup to deliveryman
  //asd =arrived station to deliveryman
  //uic = unassigned intracity
  const [apd, setApd] = useState([]);
  const [asd, setAsd] = useState([]);
  const [uic, setUic] = useState([]);
  const orders = {};
  apd.map((item) => Object.assign(orders, { [item.id]: item }));
  asd.map((item) => Object.assign(orders, { [item.id]: item }));
  uic.map((item) => Object.assign(orders, { [item.id]: item }));
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
        const { trackingInfo, deliveryStatus } = orders[id];
        const newTrackingInfo = {
          info:
            deliveryStatus === "Arrived at Destination Station"
              ? "Your order will soon arrive at the destination address, please prepare all necessary documents for collection"
              : "Your order has been booked for dispatch, awaiting shipment",

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
            deliveryStatus:
              deliveryStatus === "Arrived at Destination Station"
                ? "With last man delivery"
                : "Booked for Dispatch",
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
      field: "originStation",
      headerName: "Destination Station",

      width: 150,
    },
    {
      field: "transferStation",
      headerName: "Transfer Station",

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
      field: "originStation",
      headerName: "Destination Station",

      width: 150,
    },
    {
      field: "transferStation",
      headerName: "Transfer Station",

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
          where("tripType", "==", "Local Trip"),
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

        setTrips(tempData);
        setTripsList(tempList);
      });
    };
    getTrips();
  }, []);

  useEffect(() => {
    const ordersRef = collection(db, "orders");
    const unassignedICQuery = query(
      ordersRef,
      where("originStation", "==", stationName),
      where("tripId", "==", ""),
      where("intraCity", "==", "Yes")
    );

    const arrivedP_DQuery = query(
      ordersRef,
      where("destinationStation", "==", stationName),
      where("deliveryType", "==", "Pickup to Delivery man"),
      where("deliveryStatus", "==", "Arrived at Destination Station")
    );
    const arrivedS_DQuery = query(
      ordersRef,
      where("destinationStation", "==", stationName),
      where("deliveryType", "==", "Station to Delivery man"),
      where("deliveryStatus", "==", "Arrived at Destination Station")
    );
    const getOrders = async () => {
      await getDocs(unassignedICQuery).then((docs) => {
        const tempData = [];
        docs.forEach((doc) => {
          tempData.push(doc.data());
        });
        setUic(tempData);
      });

      await getDocs(arrivedP_DQuery).then((docs) => {
        const tempData = [];
        docs.forEach((doc) => {
          tempData.push(doc.data());
        });

        setApd(tempData);
      });
      await getDocs(arrivedS_DQuery).then((docs) => {
        const tempData = [];
        docs.forEach((doc) => {
          tempData.push(doc.data());
        });

        setAsd(tempData);
      });
    };
    getOrders();
  }, []);
  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-8">Assign Local trip</h1>
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
          rows={[...uic, ...apd, ...asd]}
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

export default AssignLocalTrip;
