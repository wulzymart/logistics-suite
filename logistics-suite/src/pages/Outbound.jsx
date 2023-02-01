import { doc, setDoc } from "firebase/firestore";
import React from "react";
import { useState } from "react";
import CustomButton from "../components/button/button";
import Header from "../components/Header";
import Modal from "../components/Modal";
import PinModal from "../components/PinModal";
import TableGrid from "../components/TableGrid";
import { useAppConfigContext } from "../contexts/AppConfig.context";
import { useUserContext } from "../contexts/CurrentUser.Context";

import { useTablesContext } from "../contexts/TablesContext";
import { useThemeContext } from "../contexts/themeContext";
import { db } from "../firebase/firebase";

const OutBound = () => {
  const [action, setAction] = useState("");
  const { openModal, closeModal } = useThemeContext();
  const { comparePin } = useAppConfigContext();
  const { currentUser } = useUserContext();
  const [pin, setPin] = useState("");
  const { outRows } = useTablesContext();

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
  const unassignTrip = () => {
    let uneditableOrders = false;
    selectedIds.forEach((id) => {
      if (outRowsMap[id].deliveryStatus === "Booked for Dispatch") {
        const trackingInfo = outRowsMap[id].trackingInfo;
        const newTrackingInfo = [];
        trackingInfo.map(
          (tracking) =>
            tracking.info !==
              "Your order has been booked for dispatch, awaiting shipment" &&
            newTrackingInfo.push(tracking)
        );

        const orderRef = doc(db, "orders", id);
        setDoc(orderRef, {
          driverName: "",
          driverPhone: "",
          attendantName: "",
          attendantPhone: "",
          tripId: "",
          deliveryStatus: "",
          trackingInfo: newTrackingInfo,
        });
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
      if (outRowsMap[id].deliveryStatus === "Booked for Dispatch") {
        const trackingInfo = outRows[id].trackingInfo;
        trackingInfo.push({
          info: "Your order has been dispatched, It is now in transit, You will be notified when arrived",
          time: date.toLocaleString(),
        });
        const orderRef = doc(db, "orders", id);
        setDoc(orderRef, {
          deliveryStatus: "Dispatched",
          trackingInfo,
        });
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
      action === "unassign" ? unassignTrip() : setDispatch();
      closeModal("pin-modal");
      closeModal("selectedOrders");
      setPin("");
      setSelectedIds([]);
    } else alert("incorrect pin");
  };
  return (
    <div>
      <Header title="View Outbound Orders" />
      <div className="h-[500px]">
        <TableGrid
          columns={columns}
          rows={outRows}
          setSelectedId={setSelectedIds}
          checkboxSelection
        />
      </div>
      <div className="flex flex-col md:flex-row justify-end gap-4 mt-4">
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

          <div className="h-[250px] mt-6">
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
        handleSubmit={handleSubmit}
      />
    </div>
  );
};
export default OutBound;
