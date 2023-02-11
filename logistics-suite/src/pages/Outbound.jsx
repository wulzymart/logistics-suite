import { doc, setDoc } from "firebase/firestore";
import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import CustomButton from "../components/button/button";
import Header from "../components/Header";
import Modal from "../components/Modal";
import PinModal from "../components/PinModal";
import Select from "../components/select-input/select";
import TableGrid from "../components/TableGrid";
import { useAppConfigContext } from "../contexts/AppConfig.context";
import { useUserContext } from "../contexts/CurrentUser.Context";

import { useTablesContext } from "../contexts/TablesContext";
import { useThemeContext } from "../contexts/themeContext";
import { db } from "../firebase/firebase";

const OutBound = () => {
  const [action, setAction] = useState("");
  const { openModal, closeModal } = useThemeContext();
  const { comparePin, stationsList } = useAppConfigContext();
  const { currentUser } = useUserContext();
  const [pin, setPin] = useState("");
  const { outRows, transshipOutRows } = useTablesContext();

  const [transferStation, setTransferStation] = useState("");
  const rows = [...transshipOutRows, ...outRows];
  const outRowsMap = {};
  outRows.map((item) => Object.assign(outRowsMap, { [item.id]: item }));

  const [selectedIds, setSelectedIds] = useState([]);
  const selectedOrders = selectedIds.map((id) => outRowsMap[id]);
  let date = new Date();
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
  const setTranshipment = () => {
    let uneditableOrders = false;
    selectedIds.forEach((id) => {
      const { deliveryStatus, history } = outRowsMap[id];
      if (deliveryStatus === "Order Received") {
        history.push({
          info: `Order indicated for transhipment by ${currentUser.displayName}`,
          time: date.toLocaleString(),
        });
        const orderRef = doc(db, "orders", id);
        setDoc(
          orderRef,
          { transferStation, tranship: true, transshipIn: true, history },
          { merge: true }
        );
      } else {
        uneditableOrders = true;
      }
    });
    uneditableOrders &&
      alert("Some of the Selected Orders have already been assigned to trips");
  };
  const unassignTrip = () => {
    let uneditableOrders = false;
    selectedIds.forEach((id) => {
      const { trackingInfo, deliveryStatus, transshipOut, history, tripId } =
        outRowsMap[id];
      if (
        deliveryStatus === "Booked for Dispatch" ||
        deliveryStatus === "Set to leave transfer station"
      ) {
        history.push({
          info: `Trip ${tripId} unassigned by ${currentUser.displayName}`,
          time: date.toLocaleString(),
        });
        const newTrackingInfo = [];
        !transshipOut
          ? trackingInfo.map(
              (tracking) =>
                tracking.info !==
                  "Your order has been booked for dispatch, awaiting shipment" &&
                newTrackingInfo.push(tracking)
            )
          : trackingInfo.map(
              (tracking) =>
                tracking.info !==
                  "Your order has been assigned a new vehicle and will soon continue to the destination station" &&
                newTrackingInfo.push(tracking)
            );

        const orderRef = doc(db, "orders", id);
        setDoc(
          orderRef,
          {
            driverName: "",
            driverPhone: "",
            attendantName: "",
            attendantPhone: "",
            tripId: "",
            deliveryStatus: !transshipOut
              ? "Order Received"
              : "At transfer station",
            trackingInfo: newTrackingInfo,
            history,
          },
          { merge: true }
        );
      } else {
        uneditableOrders = true;
      }
    });
    uneditableOrders &&
      alert(
        "Some of the Selected Orders have already been dispatched or dont have trips assigned yet"
      );
  };
  const setDispatch = () => {
    let uneditableOrders = false;
    selectedIds.forEach((id) => {
      const { deliveryStatus, history, trackingInfo, transshipOut } =
        outRowsMap[id];
      if (
        deliveryStatus === "Booked for Dispatch" ||
        deliveryStatus === "Set to leave transfer station"
      ) {
        history.push({
          info: `Order set as dispatched by ${currentUser.displayName}`,
          time: date.toLocaleString(),
        });

        trackingInfo.push({
          info: !transshipOut
            ? "Your order has been dispatched, It is now in transit, You will be notified when arrived"
            : "Your order has departed transfer station for the destination station, you will be notified on arrival",
          time: date.toLocaleString(),
        });
        const orderRef = doc(db, "orders", id);
        setDoc(
          orderRef,
          {
            deliveryStatus: "Dispatched",
            trackingInfo,
          },
          { merge: true }
        );
      } else {
        uneditableOrders = true;
      }
    });
    uneditableOrders &&
      alert(
        "Some of the Selected Orders have already been dispatched or dont have trips assigned yet"
      );
  };
  const handleSubmit = () => {
    if (comparePin(pin, currentUser.pin)) {
      action === "unassign" && unassignTrip();
      action === "dispatched" && setDispatch();
      action === "transship" && setTranshipment();
      closeModal("pin-modal");
      closeModal("selectedOrders");
      setPin("");
      setSelectedIds([]);
    } else alert("incorrect pin");
  };
  return (
    <div>
      <Header title="View Outbound Orders" />
      <div className="w-full">
        <TableGrid
          columns={columns}
          rows={rows}
          setSelectedId={setSelectedIds}
          checkboxSelection
          autoHeight
        />
      </div>
      <div className="flex flex-col md:flex-row justify-end gap-4 mt-4">
        <CustomButton
          handleClick={() => {
            if (selectedIds.length) {
              setAction("transship");
              openModal("selectedOrders");
            } else alert("No selections made");
          }}
        >
          Mark for Transshipment
        </CustomButton>
        <CustomButton
          handleClick={() => {
            if (selectedIds.length) {
              setAction("unassign");
              openModal("selectedOrders");
            } else alert("No selections made");
          }}
        >
          Unassign Trip
        </CustomButton>
        <CustomButton
          handleClick={() => {
            if (selectedIds.length) {
              setAction("dispatched");
              openModal("selectedOrders");
            } else alert("No selections made");
          }}
        >
          Mark as Dispatched
        </CustomButton>
      </div>
      <Modal id="selectedOrders" title="Confirm Selected Trips">
        <div className="p-10 ">
          <p className="text-xl text-red-400 italics">
            Please check the selected orders and ensure they are correct before
            proceeding. Some changes may not be reversible
          </p>
          {action === "transship" && (
            <div className="flex gap-4">
              <p>Transfer Station:</p>{" "}
              <Select
                options={stationsList}
                value={transferStation}
                handleChange={(e) => setTransferStation(e.target.value)}
                children="Select Station"
              />
            </div>
          )}
          <div className="w-full mt-6">
            <TableGrid
              columns={modalColumns}
              rows={selectedOrders}
              autoHeight
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
        handleSubmit={handleSubmit}
      />
    </div>
  );
};
export default OutBound;
