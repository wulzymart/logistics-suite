import { doc, setDoc } from "firebase/firestore";
import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
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
  const { inRows, transshipInRows } = useTablesContext();
  console.log(transshipInRows);
  const rows = [...transshipInRows, ...inRows];

  const inRowsMap = {};
  rows.map((item) => Object.assign(inRowsMap, { [item.id]: item }));
  const [action, setAction] = useState("");
  const { openModal, closeModal } = useThemeContext();
  const { comparePin } = useAppConfigContext();
  const { currentUser } = useUserContext();
  const [pin, setPin] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const selectedOrders = selectedIds.map((id) => inRowsMap[id]);
  let date = new Date();
  const { stations } = useAppConfigContext();

  const setArrived = () => {
    let uneditableOrders = false;
    selectedIds.forEach((id) => {
      const {
        deliveryStatus,
        deliveryType,
        transshipIn,
        history,
        trackingInfo,
      } = inRowsMap[id];
      if (deliveryStatus === "Dispatched") {
        history.push({
          info: `Order Recieved by ${currentUser.displayName}`,
          time: date.toLocaleString(),
        });
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

        trackingInfo.push({
          info: transshipIn
            ? "Order arrived at transfer station, will be on the way to destination station soon"
            : trackingMessage,
          time: date.toLocaleString(),
        });
        const orderRef = doc(db, "orders", id);
        const arrivedStatus = "Arrived at Destination Station";
        if (!transshipIn) {
          setDoc(
            orderRef,
            { deliveryStatus: arrivedStatus, trackingInfo, history },
            { merge: true }
          );
        } else
          setDoc(
            orderRef,
            {
              deliveryStatus: "At transfer station",
              trackingInfo,
              history,
              transshipIn: false,
              transshipOut: true,
            },
            { merge: true }
          );
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
      const {
        deliveryStatus,

        history,
        trackingInfo,
      } = inRowsMap[id];

      history.push({
        info: `Order set as delivered by ${currentUser.displayName}`,
        time: date.toLocaleString(),
      });
      if (
        deliveryStatus === "Arrived at Destination Station" ||
        deliveryStatus === "With last man delivery"
      ) {
        trackingInfo.push({
          info: "Order delivered successfully",
          time: date.toLocaleString(),
        });
        const orderRef = doc(db, "orders", id);
        setDoc(
          orderRef,
          {
            deliveryStatus: "Delivered",
            trackingInfo,
            history,
          },
          { merge: true }
        );
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

  return (
    <div>
      <Header title="View Inbound Orders" />
      <div className="h-[500px]">
        <TableGrid
          columns={columns}
          rows={rows}
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
          Receive Waybills
        </CustomButton>

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
