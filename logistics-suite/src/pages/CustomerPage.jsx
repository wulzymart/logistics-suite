/* eslint-disable react-hooks/exhaustive-deps */
import {
  collection,
  doc,
  endBefore,
  getDocs,
  limit,
  limitToLast,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import CustomButton from "../components/button/button";
import Header from "../components/Header";
import { db } from "../firebase/firebase";
import { useUserContext } from "../contexts/CurrentUser.Context";
import { Link, useParams } from "react-router-dom";
import TableGrid from "../components/TableGrid";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import Modal from "../components/Modal";
import Input from "../components/input/input";
import PhoneInput from "react-phone-input-2";
import Select from "../components/select-input/select";
import { useAppConfigContext } from "../contexts/AppConfig.context";
import { useThemeContext } from "../contexts/themeContext";
import Textarea from "../components/textarea/textarea";
import PinModal from "../components/PinModal";
import { idGenerator } from "../AppBrain";
import axios from "axios";

const CustomerPage = () => {
  const paymentId = idGenerator(10);
  const { id } = useParams();
  const today = new Date().toLocaleString("en-US");

  const { states, statesList, comparePin } = useAppConfigContext();
  const { openModal, closeModal } = useThemeContext();
  const [pin, setPin] = useState("");
  const [action, setAction] = useState("");
  const [rows, setRows] = useState([]);
  const [customer, setCustomer] = useState();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [state, setState] = useState("");
  const [lga, setLga] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [amount, setAmount] = useState(0);
  const [paymentMode, setPaymentMode] = useState("");
  const [receiptInfo, setReceiptInfo] = useState("");

  const { currentUser } = useUserContext();

  const customerRef = doc(db, "customers", id);
  const [firstVisible, setFirstVisible] = useState("");
  const [lastVisible, setLastVisible] = useState("");
  const ordersRef = collection(db, "orders");
  const pageSize = 10;
  const queryOrders = query(
    ordersRef,
    where("customerId", "==", id),
    orderBy("dateCreated", "asc"),
    limit(pageSize)
  );
  const nextOrders = query(
    ordersRef,
    where("station", "==", id),
    orderBy("dateCreated", "asc"),
    startAfter(lastVisible),
    limit(pageSize)
  );
  const previousOrders = query(
    ordersRef,
    where("station", "==", id),
    orderBy("dateCreated", "asc"),
    endBefore(firstVisible),
    limitToLast(pageSize)
  );
  const getQuery = async (type) => {
    const querySnapshot = await getDocs(type);
    if (!querySnapshot.empty) {
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setFirstVisible(querySnapshot.docs[0]);
      const tempData = [];
      querySnapshot.forEach((doc) => {
        tempData.push(doc.data());
      });
      setRows(tempData);
    } else setRows([]);
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
      field: "receiverAddress",
      headerName: "Receiver's Address",

      width: 150,
      valueGetter: getReceiverAddress,
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

  const edit = () => {
    const history = customer.history;
    history.push({
      info: `customer details editied by ${currentUser.displayName}`,
      time: today,
    });
    setDoc(
      customerRef,
      {
        firstName,
        lastName,
        businessName,
        phoneNumber,
        email,
        address: { state, lga, streetAddress },
        history,
      },
      { merge: true }
    );
    closeModal("edit");
  };
  const upgrade = () => {
    const history = customer.history;
    history.push({
      info: `customer upgraded to E-commerce by ${currentUser.displayName}`,
      time: today,
    });
    axios({
      method: "post",
      url: `https://ls.webcouture.com.ng/ecommerce-user`,
      data: {
        customer,
      },
      headers: {
        " content-type": "application/json",
      },
    }).then((res) => {
      if (res.data === true) {
        setDoc(
          customerRef,
          {
            customerType: "E-commerce",
            businessName,
            history,
          },
          { merge: true }
        );
      } else
        alert(`${res.data.code} ${res.data.message}.
       'Please contact your software administrator for more details'`);
    });

    closeModal("upgrade");
  };
  const topUp = () => {
    let walletBalance = customer.walletBalance ? customer.walletBalance : 0;
    walletBalance = +walletBalance + +amount;
    const history = customer.history;
    history.push({
      info: `${amount}NGN was added to wallet by ${currentUser.displayName}`,
      time: today,
    });
    setDoc(
      customerRef,
      {
        walletBalance,
        history,
      },
      { merge: true }
    );
    closeModal("topUp");
    setDoc(doc(db, "income", paymentId), {
      id: paymentId,
      customerId: id,
      customerName: firstName + " " + lastName,
      businessName,
      amount,
      purpose: "Wallet Top-up",
      paymentMode,
      receiptInfo,
      dateMade: serverTimestamp(),
      processedBy: currentUser.displayName,
      station: currentUser.station,
    });
  };
  const handleSubmit = () => {
    if (comparePin(pin, currentUser.pin)) {
      action === "edit" && edit();
      action === "topUp" && topUp();
      action === "upgrade" && upgrade();
      setPin("");
      closeModal("pin-modal");
    } else alert("Wrong Pin");
  };
  useEffect(() => {
    const unsubsCribeCustomer = onSnapshot(customerRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setCustomer(data);
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setEmail(data.email);
        setBusinessName(data.businessName);
        setPhoneNumber(data.phoneNumber);
        setState(data.address.state);
        setLga(data.address.lga);
        setStreetAddress(data.address.streetAddress);
        getQuery(queryOrders);
      } else alert("not found");
    });

    return unsubsCribeCustomer;
  }, []);
  return (
    <div>
      {customer ? (
        <div className="flex flex-col gap-4 w-full">
          <Header title="Customer Information" />
          <div className="w-full rounded-lg p-8 bg-blue-200 flex flex-wrap justify-around gap-y-4">
            <div className="min-w-52 flex flex-col gap-4">
              <p className="flex flex-col  gap-2 mb-2">
                <span className="font-bold">Customer Name:</span>
                <span>{customer.firstName + " " + customer.lastName}</span>
              </p>
            </div>
            <div className="min-w-52 flex flex-col gap-4">
              <p className="flex flex-col  gap-2 mb-2">
                <span className="font-bold">Business Name:</span>
                <span>{customer.businessName}</span>
              </p>
            </div>
            <div className="min-w-52 flex flex-col gap-4">
              <p className="flex flex-col   gap-2 mb-2">
                <span className="font-bold">Date Registered</span>
                <span>
                  {customer.dateCreated.toDate().toDateString().split(" ")[1] +
                    " " +
                    customer.dateCreated.toDate().toDateString().split(" ")[2] +
                    " " +
                    customer.dateCreated.toDate().toDateString().split(" ")[3]}
                </span>
              </p>
            </div>
            <div className="min-w-52 flex flex-col gap-4">
              <p className="flex gap-2 flex-col  mb-2">
                <span className="font-bold">Customer Type:</span>
                <span>{customer.customerType}</span>
              </p>
            </div>
            <div className="min-w-52 flex flex-col gap-4">
              {customer.customerType === "E-commerce" && (
                <p className="flex flex-col  gap-2 mb-2">
                  <span className="font-bold">Wallet Balance:</span>
                  <span>{customer.walletBalance} NGN</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row  gap-4 ">
            <div className="flex flex-col bg-blue-400  w-full p-8 rounded-lg mb-4 gap-y-2">
              <p className="">
                <span>Phone Number: </span>
                <span>{customer.phoneNumber}</span>
              </p>
              <p className="">
                <span>Email: </span>
                <span>{customer.email}</span>
              </p>
            </div>
            <div className="flex flex-col bg-blue-400  w-full p-8 rounded-lg mb-4 gap-y-2">
              <p className="">Address:</p>
              <p className="">
                {customer.address.streetAddress + " " + customer.address.state}
              </p>
            </div>
          </div>
          <div className="flex gap-4 flex-col md:flex-row">
            {customer.customerType === "E-commerce" ? (
              <div className="flex gap-4 flex-col md:flex-row">
                <CustomButton
                  handleClick={() => {
                    setAction("topUp");
                    openModal("topUp");
                  }}
                >
                  Refill Wallet
                </CustomButton>
                {currentUser.adminRight === "Super Admin" && (
                  <CustomButton
                    handleClick={() => {
                      setAction("edit");
                      openModal("edit");
                    }}
                  >
                    Edit Details
                  </CustomButton>
                )}
              </div>
            ) : currentUser.adminRight === "Super Admin" ? (
              <div className="flex gap-4 flex-col md:flex-row">
                <CustomButton
                  handleClick={() => {
                    setAction("edit");
                    openModal("edit");
                  }}
                >
                  Edit Details
                </CustomButton>
                <CustomButton
                  handleClick={() => {
                    setAction("upgrade");
                    openModal("upgrade");
                  }}
                >
                  Upgrade Customer
                </CustomButton>
              </div>
            ) : (
              <CustomButton
                handleClick={() => {
                  setAction("edit");
                  openModal("edit");
                }}
              >
                Edit Details
              </CustomButton>
            )}
          </div>
          <div className="mt-4 w-full">
            <h2 className="text-xl font-body mb-4">Recent Orders</h2>
            <TableGrid
              columns={columns}
              rows={rows}
              autoHeight
              hideFooter
              setSelectedId={() => {}}
            />
            <div className="bg-blue-100 p-4">
              <div className="flex gap-6 justify-end pr-8">
                <button
                  className="flex items-center text-slate-800 "
                  onClick={() => getQuery(previousOrders)}
                >
                  <GrFormPrevious />
                </button>
                <button
                  className="flex items-center text-slate-800 "
                  onClick={() => getQuery(nextOrders)}
                >
                  <GrFormNext />
                </button>
              </div>
            </div>
          </div>
          <Modal id="edit" title="Edit Customer Information">
            <div className="flex flex-col gap-8">
              <div className=" flex flex-col md:flex-row gap-4">
                <div className="flex gap-2 items-center">
                  <p>First Name:</p>
                  <Input
                    type="text"
                    value={firstName}
                    handleChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 items-center">
                  <p>Last Name:</p>
                  <Input
                    type="text"
                    value={lastName}
                    handleChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 items-center">
                  <p>Business Name:</p>
                  <Input
                    type="text"
                    value={businessName}
                    handleChange={(e) => setBusinessName(e.target.value)}
                  />
                </div>
              </div>
              <div className=" flex flex-col md:flex-row gap-4">
                <div className="flex gap-2 items-center">
                  <p>Phone:</p>
                  <PhoneInput
                    country={"ng"}
                    onlyCountries={["ng"]}
                    value={phoneNumber}
                    prefix="+"
                    onChange={(phone) => {
                      phone = "+" + phone;
                      setPhoneNumber(phone);
                    }}
                    containerClass={" !w-full"}
                    inputClass={"!w-full !h-11"}
                  />
                </div>
                <div className="flex gap-4 items-center">
                  <p>Email:</p>
                  <Input
                    type="email"
                    value={email}
                    handleChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <p className="mb-4">Address:</p>
                <Select
                  options={statesList ? statesList : ["loading"]}
                  value={state}
                  handleChange={(e) => setState(e.target.value)}
                  children={"Select State"}
                />
                <Select
                  value={lga}
                  options={state ? states[state].lgas : [""]}
                  handleChange={(e) => setLga(e.target.value)}
                  children={"Select LGA"}
                />

                <Input
                  type={"text"}
                  name={"customerStreetAddress"}
                  placeholder={"Street Address"}
                  value={customer.address.streetAddress}
                  handleChange={(e) => setStreetAddress(e.target.value)}
                />
              </div>
              <CustomButton handleClick={() => openModal("pin-modal")}>
                Submit
              </CustomButton>
            </div>
          </Modal>
          <Modal id="upgrade">
            <div className="flex flex-col gap-8">
              <p className="text-lg font-bold">
                Upgrade Customer type to E-commerce
              </p>
              <div className="flex gap-2 items-center">
                <p>Business Name:</p>
                <Input
                  type="text"
                  value={businessName}
                  handleChange={(e) => setBusinessName(e.target.value)}
                />
              </div>

              <CustomButton handleClick={() => openModal("pin-modal")}>
                Submit
              </CustomButton>
            </div>
          </Modal>
          <Modal id="topUp" title="Top up Wallet">
            <div className="flex flex-col gap-8">
              <p className="text-red ">
                Please enter amount to add and payment type and receipt
                information
              </p>
              <div className="flex gap-2 items-center">
                <p>Amount (NGN):</p>
                <Input
                  type="number"
                  value={amount}
                  handleChange={(e) => setAmount(+e.target.value)}
                />
              </div>
              <div className="flex gap-2 items-center">
                <p>Payment mode:</p>
                <Select
                  options={["Cash", "Card", "Transfer"]}
                  value={paymentMode}
                  handleChange={(e) => setPaymentMode(e.target.value)}
                  children="Select Payment Mode"
                />
              </div>
              <div className="flex gap-2 items-center">
                <p>Receipt Info:</p>
                <Textarea
                  value={receiptInfo}
                  handleChange={(e) => setReceiptInfo(e.target.value)}
                />
              </div>

              <CustomButton handleClick={() => openModal("pin-modal")}>
                Submit
              </CustomButton>
            </div>
          </Modal>
          <PinModal
            pin={pin}
            handleChange={(e) => setPin(e.target.value)}
            handleSubmit={handleSubmit}
          />
        </div>
      ) : (
        <p>loading</p>
      )}
    </div>
  );
};

export default CustomerPage;
