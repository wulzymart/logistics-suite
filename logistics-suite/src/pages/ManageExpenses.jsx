/* eslint-disable react-hooks/exhaustive-deps */
import {
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import CustomButton from "../components/button/button";

import Header from "../components/Header";
import Modal from "../components/Modal";
import PinModal from "../components/PinModal";

import TableGrid from "../components/TableGrid";
import { useAppConfigContext } from "../contexts/AppConfig.context";

import { useUserContext } from "../contexts/CurrentUser.Context";
import { useThemeContext } from "../contexts/themeContext";

import { db } from "../firebase/firebase";

const ManageExpenses = () => {
  const { currentUser } = useUserContext();
  const { comparePin } = useAppConfigContext();
  const { openModal, closeModal } = useThemeContext();
  const [rows, setRows] = useState([]);
  const [expenses, setExpenses] = useState();
  const [selectedIds, setSelectedIds] = useState([]);
  const [pin, setPin] = useState("");
  const [action, setAction] = useState("");
  const selectedExpenses = selectedIds.map((id) => expenses[id]);
  let date = new Date();
  const handleSubmit = () => {
    setPin("");
    if (comparePin(pin, currentUser.pin)) {
      const approved =
        action === "approve" ? true : action === "decline" && false;
      let uneditable = 0;
      selectedIds.forEach((id) => {
        if (expenses[id].approved === "") {
          setDoc(doc(db, "expenses", id), { approved }, { merge: true });
        } else uneditable++;
      });
      uneditable &&
        alert(`${uneditable} expenses have already been attended to`);

      closeModal("pin-modal");
      closeModal("selected-modal");
    } else {
      setPin("");
      alert("Incorrect Pin");
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "Id",
      width: 100,
    },
    {
      field: "approved",
      headerName: "Status",

      width: 150,
      valueGetter: (params) =>
        params.row.approved === ""
          ? "Pending"
          : params.row.approved === true
          ? "Approved"
          : params.row.approved === false && "Not Approved",
      renderCell: (params) => (
        <p
          className={`${
            params.value === "Approved"
              ? "bg-green-600"
              : params.value === "Pending"
              ? "bg-yellow-600"
              : params.value === "Not Approved" && "bg-red-700"
          } py-2 px-4 text-white rounded-md`}
        >
          {params.value}
        </p>
      ),
    },
    {
      field: "purpose",
      headerName: "Purose",

      width: 100,
    },
    {
      field: "amount",
      headerName: "Amount",

      width: 100,
    },
    {
      field: "description",
      headerName: "Description",

      width: 200,
    },
    {
      field: "staffName",
      headerName: "Requested By",

      width: 150,
    },

    {
      field: "station",
      headerName: "Station",

      width: 100,
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
  const getExpenses = () => {
    onSnapshot(
      query(
        collection(db, "expenses"),
        where(
          "dateCreated",
          ">=",
          Timestamp.fromDate(new Date(date.toDateString()))
        )
      ),
      (docs) => {
        const tempData = [];
        const tempObj = {};
        docs.forEach((doc) => {
          tempData.push(doc.data());
          Object.assign(tempObj, { [doc.data().id]: doc.data() });
        });
        setRows(tempData);
        setExpenses(tempObj);
      }
    );
  };
  useEffect(() => {
    return getExpenses();
  }, []);
  return (
    <div>
      <Header title="View All Requested Expenses" />
      <div className="w-full">
        <TableGrid
          autoHeight
          columns={columns}
          rows={rows}
          setSelectedId={setSelectedIds}
          checkboxSelection
        />
      </div>
      <div className="mt-8 w-full flex flex-col md:flex-row gap-8 md:justify-end">
        <CustomButton
          handleClick={() => {
            if (!selectedIds.length) return;
            setAction("approve");
            openModal("selected-modal");
          }}
        >
          Approve
        </CustomButton>
        <CustomButton
          handleClick={() => {
            if (!selectedIds.length) return;
            setAction("decline");
            openModal("selected-modal");
          }}
        >
          Decline
        </CustomButton>
      </div>
      <Modal id="selected-modal" title="Selected Expenses">
        <div>
          <p className="mb-8">Please confirm selected expenses for approval</p>
          <div className="w-full mb-8">
            <TableGrid
              rows={selectedExpenses}
              columns={columns}
              autoHeight
              setSelectedId={() => {}}
            />
          </div>
          <CustomButton handleClick={() => openModal("pin-modal")}>
            Proceed
          </CustomButton>
        </div>
      </Modal>
      <PinModal
        pin={pin}
        handleChange={(e) => setPin(e.target.value)}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};
export default ManageExpenses;
