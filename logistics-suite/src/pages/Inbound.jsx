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

const InBound = () => {
  const { inRows } = useTablesContext();
  const inRowsMap = {};
  inRows.map((item) => Object.assign(inRowsMap, { [item.id]: item }));
  const [action, setAction] = useState("");
  const { openModal, closeModal } = useThemeContext();
  const { comparePin } = useAppConfigContext();
  const { currentUser } = useUserContext();
  const [pin, setPin] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const selectedOrders = selectedIds.map((id) => inRowsMap[id]);
  let date = new Date();
  const { stations } = useAppConfigContext();

  const setTranshipment = () => {
    let uneditableOrders = false;
    selectedIds.forEach((id) => {
      if (inRowsMap[id].deliveryStatus === "Dispatched") {
        const trackingInfo = inRows[id].trackingInfo;
        trackingInfo.push({
          info: "Your order has been set to be delivered to a new location as requested",
          time: date.toLocaleString(),
        });
        const orderRef = doc(db, "orders", id);
        setDoc(orderRef, {
          deliveryStatus: "To be transshipped to new destination",
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
  const setArrived = () => {
    let uneditableOrders = false;
    selectedIds.forEach((id) => {
      if (inRowsMap[id].deliveryStatus === "Dispatched") {
        const deliveryType = inRowsMap[id].deliveryType;
        const trackingMessage =
          deliveryType === "Station to Delivery man" ||
          deliveryType === "Pickup to Delivery man"
            ? "Your order has arrived the destination station and will be delivered to the set delivery address. please prepare your documents for identification"
            : `Your order has arrived the destination station at ${
                stations[inRowsMap[id].destinationStation].address
                  .streetAddress +
                " " +
                stations[inRowsMap[id].destinationStation].address.lga +
                " " +
                stations[inRowsMap[id].destinationStation].address.state
              }. and awaiting pick up. kindly come with a valid means of identification`;
        const trackingInfo = inRows[id].trackingInfo;
        trackingInfo.push({
          info: trackingMessage,
          time: date.toLocaleString(),
        });
        const orderRef = doc(db, "orders", id);
        setDoc(orderRef, {
          deliveryStatus: "Arrived at Destination Station",
          trackingInfo,
        });
      } else {
        uneditableOrders = true;
      }
    });
    uneditableOrders &&
      alert(
        "Some of the Selected Orders are yet to be dispatched have already arrived"
      );
  };
  const setDelivered = () => {
    let uneditableOrders = false;
    selectedIds.forEach((id) => {
      if (
        inRowsMap[id].deliveryStatus === "Arrived at Destination Station" ||
        inRowsMap[id].deliveryStatus === "With last man delivery"
      ) {
        const deliveryType = inRowsMap[id].deliveryType;
        const trackingMessage =
          deliveryType === "Station to Delivery man" ||
          deliveryType === "Pickup to Delivery man"
            ? "Your order has arrived the destination station and will be delivered to the set delivery address. please prepare your documents for identification"
            : `Your order has arrived the destination station at ${
                stations[inRowsMap[id].destinationStation].address
                  .streetAddress +
                " " +
                stations[inRowsMap[id].destinationStation].address.lga +
                " " +
                stations[inRowsMap[id].destinationStation].address.state
              }. and awaiting pick up. kindly come with a valid means of identification`;
        const trackingInfo = inRows[id].trackingInfo;
        trackingInfo.push({
          info: trackingMessage,
          time: date.toLocaleString(),
        });
        const orderRef = doc(db, "orders", id);
        setDoc(orderRef, {
          deliveryStatus: "Delivered",
          trackingInfo,
        });
      } else {
        uneditableOrders = true;
      }
    });
    uneditableOrders &&
      alert("Some of the Selected Orders are yet to arrive your location");
  };
  const handleSubmit = () => {
    if (comparePin(pin, currentUser.pin)) {
      action === "arrived" && setArrived();
      action === "delivered" && setDelivered();
      closeModal("pin-modal");
      closeModal("selectedOrders");
      setPin("");
      setSelectedIds([]);
    } else alert("incorrect pin");
  };
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
      field: "originStation",
      headerName: "Origin Station",
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

  return (
    <div>
      <Header title="View Inbound Orders" />
      <div className="h-[500px]">
        <TableGrid
          columns={columns}
          rows={inRows}
          setSelectedId={setSelectedIds}
          checkboxSelection
        />
      </div>
      <div className="flex flex-col md:flex-row justify-end gap-4 mt-4">
        <CustomButton
          handleClick={() => {
            if (selectedIds.length) {
              setAction("arrived");
              openModal("selectedOrders");
            } else alert("No selections made");
          }}
        >
          Set as Arrived
        </CustomButton>
        {/* <CustomButton
          handleClick={() => {
            if (selectedIds.length) {
              setAction("transship");
              openModal("selectedOrders");
            } else alert("No selections made");
          }}
        >
          Mark for Transshipping
        </CustomButton> */}
        <CustomButton
          handleClick={() => {
            if (selectedIds.length) {
              setAction("delivered");
              openModal("selectedOrders");
            } else alert("No selections made");
          }}
        >
          Mark as Delivered
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
export default InBound;
