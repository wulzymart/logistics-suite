/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { appBrain, idGenerator } from "../AppBrain";
import CustomButton from "../components/button/button";
import Header from "../components/Header";
import Input from "../components/input/input";
import Modal from "../components/Modal";
import PinModal from "../components/PinModal";
import Select from "../components/select-input/select";
import Textarea from "../components/textarea/textarea";
import { useAppConfigContext } from "../contexts/AppConfig.context";
import { useUserContext } from "../contexts/CurrentUser.Context";
import { useThemeContext } from "../contexts/themeContext";
import { db } from "../firebase/firebase";
import NotFound from "./NotFound";

const OrderPage = () => {
  const [notFound, setNotFound] = useState(false);
  const { stationName, currentUser } = useUserContext();
  const { openModal, closeModal } = useThemeContext();
  const { comparePin, stations, stationsList } = useAppConfigContext();
  const { id } = useParams();
  const [order, setOrder] = useState();
  const [customer, setCustomer] = useState();
  const [Receiver, setReceiver] = useState();
  const [item, setItem] = useState();

  const [tripId, setTripId] = useState("");
  const [trips, setTrips] = useState({});
  const [tripsList, setTripsList] = useState([""]);
  const [action, setAction] = useState("");
  const [paymentMode, setPaymentMd] = useState("");
  const [receivedByName, setReceivedByName] = useState("");
  const [receivedByPhone, setReceivedByPhone] = useState("");

  const [receipt, setReceipt] = useState("");
  const [transferStation, setTransferStation] = useState("");
  let date = new Date();

  const paymentId = idGenerator(10);
  const [pin, setPin] = useState("");
  const pay = () => {
    closeModal("payment-summary");
    closeModal("payment-modal");
    const { history } = order;
    history.push({
      info: `Payment details entered by ${currentUser.displayName}`,
      time: date.toLocaleString("en-US"),
    });
    setDoc(
      doc(db, "orders", id),
      { paid: true, paymentMode, receiptInfo: receipt, history },
      { merge: true }
    );
    setDoc(doc(db, "income", paymentId), {
      id: paymentId,
      customerId: customer.id,
      customerName: customer.firstName + " " + customer.lastName,
      businessName: customer.businessName,
      amount: +order.total,
      purpose: "Order Payment",
      orderId: order.id,
      vat: order.VAT,
      insurance: order.insurance,
      net: order.subtotal,
      paymentMode,
      receiptInfo: receipt,
      dateMade: serverTimestamp(),
      processedBy: currentUser.displayName,
      station: currentUser.station,
    });
  };
  function assignTrip() {
    const driverName = trips[tripId].driverName;
    const attendantName = trips[tripId].attendantName || "";
    const driverPhone = trips[tripId].driverPhone;
    const attendantPhone = trips[tripId].attendantPhone || "";

    const { transshipOut, trackingInfo, history } = order;
    const newTrackingInfo = {
      info: !transshipOut
        ? "Your order has been booked for dispatch, awaiting shipment"
        : "Your order has been assigned a new vehicle and will soon continue to the destination station",
      time: date.toLocaleString("en-US"),
    };
    trackingInfo.push(newTrackingInfo);

    const orderRef = doc(db, "orders", id);
    history.push({
      info: `Trip ${tripId} assigned by ${currentUser.displayName}`,
      time: date.toLocaleString("en-US"),
    });

    setDoc(
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
    setTripId("");
    closeModal("trip-assign");
  }
  const setTranshipment = () => {
    const { deliveryStatus, history } = order;

    if (deliveryStatus === "Order Received") {
      history.push({
        info: `Order indicated for transhipment by ${currentUser.displayName}`,
        time: date.toLocaleString("en-US"),
      });
      const orderRef = doc(db, "orders", id);
      setDoc(
        orderRef,
        { transferStation, tranship: true, transshipIn: true, history },
        { merge: true }
      );
    } else {
      alert(" Order has already been assigned to a trip");
    }
    closeModal("transship");
    closeModal("confirm-transship");
  };
  const unassignTrip = () => {
    const { trackingInfo, deliveryStatus, transshipOut, history, tripId } =
      order;
    if (
      deliveryStatus === "Booked for Dispatch" ||
      deliveryStatus === "Set to leave transfer station"
    ) {
      history.push({
        info: `Trip ${tripId} unassigned by ${currentUser.displayName}`,
        time: date.toLocaleString("en-US"),
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
      alert("Order has already been dispatched or Not assigned to trip");
    }

    closeModal("trip-unassign");
  };
  const setDispatch = () => {
    const { deliveryStatus, history, trackingInfo, transshipOut } = order;
    if (
      deliveryStatus === "Booked for Dispatch" ||
      deliveryStatus === "Set to leave transfer station"
    ) {
      history.push({
        info: `Order set as dispatched by ${currentUser.displayName}`,
        time: date.toLocaleString("en-US"),
      });

      trackingInfo.push({
        info: !transshipOut
          ? "Your order has been dispatched, It is now on transit, You will be notified when arrived"
          : "Your order has departed transfer station for the destination station, you will be notified on arrival",
        time: date.toLocaleString("en-US"),
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
      alert("Order has already been dispatched or not assigned yet");
    }
    closeModal("dispatched");
  };
  const setArrived = () => {
    const {
      deliveryStatus,
      deliveryType,
      transshipIn,
      history,
      trackingInfo,
      destinationStation,
    } = order;
    if (deliveryStatus === "Dispatched") {
      history.push({
        info: `Order Recieved by ${currentUser.displayName}`,
        time: date.toLocaleString("en-US"),
      });
      const trackingMessage =
        deliveryType === "Station to Delivery man" ||
        deliveryType === "Pickup to Delivery man"
          ? "Your order has arrived the destination station and will be delivered to the set delivery address. please prepare your documents for identification"
          : `Your order has arrived the destination station at ${
              stations[destinationStation].address.streetAddress +
              " " +
              stations[destinationStation].address.lga +
              " " +
              stations[destinationStation].address.state
            }. and awaiting pick up. kindly come with a valid means of identification`;

      trackingInfo.push({
        info: transshipIn
          ? "Order arrived at transfer station, will be on the way to destination station soon"
          : trackingMessage,
        time: date.toLocaleString("en-US"),
      });
      const orderRef = doc(db, "orders", id);
      const arrivedStatus = "Arrived at Destination Station";
      if (!transshipIn) {
        setDoc(
          orderRef,
          {
            deliveryStatus: arrivedStatus,
            trackingInfo,
            history,
            arrivedAtDestinationStation: serverTimestamp(),
          },
          { merge: true }
        );
      } else
        setDoc(
          orderRef,
          {
            deliveryStatus: "At transfer station",
            trackingInfo,
            history,
            arrivedAtTransferStation: serverTimestamp(),
            transshipIn: false,
            transshipOut: true,
          },
          { merge: true }
        );
    } else {
      alert("Orders is yet to be dispatched has already arrived");
    }
    closeModal("arrived");
  };
  const setDelivered = () => {
    const { deliveryStatus, id, history, trackingInfo, intraCity } = order;

    history.push({
      info: `Order set as delivered by ${currentUser.displayName}`,
      time: date.toLocaleString("en-US"),
    });
    trackingInfo.push({
      info: "Order delivered successfully",
      time: date.toLocaleString("en-US"),
    });
    const orderRef = doc(db, "orders", id);
    if (
      (intraCity === "Yes" && deliveryStatus === "Dispatched") ||
      deliveryStatus === "Arrived at Destination Station" ||
      deliveryStatus === "With last man delivery"
    ) {
      setDoc(
        orderRef,
        {
          receivedByName,
          deliveredAt: serverTimestamp(),
          receivedByPhone,
          deliveryStatus: "Delivered",
          trackingInfo,
          history,
        },
        { merge: true }
      ).then(() => {
        setReceivedByName("");
        setReceivedByPhone("");
      });
    } else {
      alert("Order is yet to arrive your location");
    }
    closeModal("set-received-by");
    closeModal("delivered");
  };
  const handleSubmit = () => {
    if (comparePin(pin, currentUser.pin)) {
      setPin("");
      closeModal("pin-modal");

      action === "pay" && pay();
      action === "assignTrip" && assignTrip();
      action === "unassignTrip" && unassignTrip();
      action === "transship" && setTranshipment();
      action === "dispatched" && setDispatch();
      action === "arrived" && setArrived();
      action === "delivered" && setDelivered();
    } else alert("Incorrenct Pin");
  };
  useEffect(() => {
    const orderRef = doc(db, "orders", id);
    const getOrder = onSnapshot(orderRef, (snapshot) => {
      if (snapshot.exists()) {
        setOrder(snapshot.data());
        setReceiver(snapshot.data().receiver);
        setItem(snapshot.data().item);
        const customerRef = doc(db, "customers", snapshot.data().customerId);
        const getCustomer = async () => {
          const customerSnapshot = await getDoc(customerRef);
          setCustomer(customerSnapshot.data());
        };
        getCustomer();
      } else setNotFound(true);
    });

    return getOrder;
  }, []);
  useEffect(() => {
    let today = new Date();
    today = today.toDateString();

    const tripsRef = collection(db, "trips");

    if (!order) return;
    const getTrips = async () => {
      const queried =
        order.intraCity === "No"
          ? query(
              tripsRef,
              where("originStation", "==", stationName),
              where("tripType", "==", "Station-Station"),
              where("dateCreated", ">=", Timestamp.fromDate(new Date(today)))
            )
          : query(
              tripsRef,
              where("originStation", "==", stationName),
              where("tripType", "==", "Local Trip"),
              where("dateCreated", ">=", Timestamp.fromDate(new Date(today)))
            );
      await getDocs(queried).then((docs) => {
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
  }, [order]);

  return !notFound ? (
    <div>
      {order ? (
        <div className="flex flex-col gap-4 w-full">
          <Header title="Order Information" />
          <div className="w-full rounded-lg p-8 bg-blue-200 flex flex-col md:flex-row md:flex-wrap justify-around gap-y-4">
            <div className="min-w-52 flex flex-col gap-4">
              <p className="flex flex-col  gap-2 mb-2">
                <span className="font-bold">Tracking ID:</span>
                <span>{order.id}</span>
              </p>
              <p className="flex flex-col   gap-2 mb-2">
                <span className="font-bold">Date Created:</span>
                <span>
                  {order.dateCreated.toDate().toDateString().split(" ")[1] +
                    " " +
                    order.dateCreated.toDate().toDateString().split(" ")[2] +
                    " " +
                    order.dateCreated.toDate().toDateString().split(" ")[3]}
                </span>
              </p>
            </div>
            <div className="min-w-52 flex flex-col gap-4">
              <p className="flex gap-2 flex-col  mb-2">
                <span className="font-bold">Origin Station:</span>
                <span>{order.originStation}</span>
              </p>
              <p className="flex gap-2 flex-col  mb-2">
                <span className="font-bold">Destination Station:</span>
                <span>{order.destinationStation}</span>
              </p>
            </div>
            <div className="min-w-52 flex flex-col gap-4">
              <p className="flex gap-2 flex-col  mb-2">
                <span className="font-bold">Delivery Type:</span>
                <span>{order.deliveryType}</span>
              </p>
              <p className="flex gap-2 flex-col  mb-2">
                <span className="font-bold">Service Type:</span>
                <span>{order.deliveryService}</span>
              </p>
            </div>
            <div className="min-w-52 flex flex-col gap-4">
              <p className="flex flex-col  gap-2 mb-2">
                <span className="font-bold">Price:</span>
                <span>{order.total} NGN</span>
              </p>
              <p className="flex flex-col  gap-2 mb-2">
                <span className="font-bold">Payment Status:</span>
                <span>{order.paid ? "Paid" : "Not Paid"}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row  gap-4 ">
            <div className="flex flex-col  md:w-1/3 bg-slate-100 border border-solid border-slate-300 p-8 rounded-lg ">
              {customer ? (
                <div className="mb-10 pb-8 border-b border-b-black">
                  <p className="text-xl font-semibold mb-4">
                    Sender's Information
                  </p>
                  <p className=" flex gap-3 mb-2">
                    <span>Name:</span>
                    <span>{customer.firstName + " " + customer.lastName}</span>
                  </p>
                  <p className=" flex gap-3 mb-2">
                    <span>Business Name:</span>
                    <span>{customer.businessName}</span>
                  </p>
                  <p className=" flex gap-3 mb-2">
                    <span>Customer Type:</span>
                    <span>{customer.customerType}</span>
                  </p>
                  <p className=" flex gap-3 mb-2">
                    <span>Phone Number:</span>
                    <span>{customer.phoneNumber}</span>
                  </p>
                  <p className=" flex gap-3 mb-2">
                    <span>Email:</span>
                    <span>{customer.email}</span>
                  </p>
                  <p className=" flex gap-3 mb-2">
                    <span>Address:</span>
                    <span>
                      {customer.address.streetAddress +
                        " " +
                        customer.address.state}
                    </span>
                  </p>
                </div>
              ) : (
                "loading"
              )}
              <div>
                <p className="text-xl font-semibold mb-4">
                  Receiver's Information
                </p>
                <p className=" flex gap-3 mb-2">
                  <span>Name:</span>
                  <span>{Receiver.firstName + " " + Receiver.lastName}</span>
                </p>
                <p className=" flex gap-3 mb-2">
                  <span>Business Name:</span>
                  <span>{Receiver.businessName}</span>
                </p>

                <p className=" flex gap-3 mb-2">
                  <span>Phone Number:</span>
                  <span>{Receiver.phoneNumber}</span>
                </p>

                <p className=" flex gap-3 mb-2">
                  <span>Address:</span>
                  <span>
                    {Receiver.address.streetAddress +
                      " " +
                      Receiver.address.state}
                  </span>
                </p>
              </div>
              <div className="mt-6 flex flex-col gap-6">
                {!order.paid && (
                  <CustomButton handleClick={() => openModal("payment-modal")}>
                    Enter Payment Info
                  </CustomButton>
                )}
                {order.originStation === currentUser.station &&
                  !order.tripId && (
                    <CustomButton handleClick={() => openModal("trip-assign")}>
                      Assign Trip
                    </CustomButton>
                  )}
                {order.originStation === currentUser.station &&
                  !order.tripId &&
                  order.intraCity === "No" && (
                    <CustomButton handleClick={() => openModal("transship")}>
                      Transship
                    </CustomButton>
                  )}
                {order.originStation === currentUser.station &&
                  order.tripId &&
                  (order.deliveryStatus === "Booked for Dispatch" ||
                    order.deliveryStatus ===
                      "Set to leave transfer station") && (
                    <CustomButton
                      handleClick={() => openModal("trip-unassign")}
                    >
                      Un-Assign Trip
                    </CustomButton>
                  )}
                {order.originStation === currentUser.station &&
                  (order.deliveryStatus === "Booked for Dispatch" ||
                    order.deliveryStatus ===
                      "Set to leave transfer station") && (
                    <CustomButton handleClick={() => openModal("dispatched")}>
                      Set as Dispatched
                    </CustomButton>
                  )}
                {order.destinationStation === currentUser.station &&
                  order.deliveryStatus === "Dispatched" && (
                    <CustomButton handleClick={() => openModal("arrived")}>
                      Arrived
                    </CustomButton>
                  )}
                {((order.intraCity === "Yes" &&
                  order.deliveryStatus === "Dispatched") ||
                  (order.destinationStation === currentUser.station &&
                    (order.deliveryStatus ===
                      "Arrived at Destination Station" ||
                      order.deliveryStatus === "With last man delivery"))) && (
                  <CustomButton handleClick={() => openModal("delivered")}>
                    Delivered
                  </CustomButton>
                )}
              </div>
            </div>
            <div className=" h-full">
              <div className=" bg-blue-500 text-white w-full p-8 rounded-lg mb-4">
                <p className="text-xl font-semibold mb-8">Item Details</p>
                <div className="flex flex-wrap gap-x-16 gap-y-2 mb-2">
                  <p className="">
                    <span>Cartegory: </span>
                    <span>{item.cartegory}</span>
                  </p>
                  <p className="">
                    <span>Condition: </span>
                    <span>{item.condition}</span>
                  </p>
                  <p className="">
                    <span>Quantity: </span>
                    <span>{item.quantity}</span>
                  </p>
                  <p className="">
                    <span>Weight: </span>
                    <span>{item.weight}</span>
                  </p>
                  <p className="">
                    <span>Value: </span>
                    <span>{item.value} NGN</span>
                  </p>
                </div>
                <p>
                  <span>Description: </span>
                  <span>{item.description}</span>
                </p>
              </div>
              <div className=" bg-blue-500 text-white w-full p-8 rounded-lg mb-4">
                <p className="text-xl font-semibold mb-8">Trip Details</p>
                <div className="flex flex-wrap gap-x-8 gap-y-2 mb-2">
                  <p className="w-42">
                    <span>Route: </span>
                    <span>{order.routeName}</span>
                  </p>
                  <p className="w-42">
                    <span>Trip: </span>
                    <span>{order.tripName}</span>
                  </p>
                  <p className="w-44">
                    <span>Vehicle: </span>
                    <span>{order.vehicleId}</span>
                  </p>
                  <p className="w-42">
                    <span>Driver's Name: </span>
                    <span>{order.driver?.name}</span>
                  </p>
                  <p className="w-42">
                    <span>Driver's Phone: </span>
                    <span>{order.driver?.phone}</span>
                  </p>
                  {order.attendant?.name && (
                    <p className="w-42">
                      <span>Attendant's Name: </span>
                      <span>{order.attendant.name}</span>
                    </p>
                  )}
                  {order.attendant?.phone && (
                    <p className="w-42">
                      <span>Attendant's Phone: </span>
                      <span>{order.attendant.phone}</span>
                    </p>
                  )}
                </div>
              </div>
              <div className=" bg-blue-500 text-white w-full p-8 rounded-lg mb-4">
                <p className="text-xl font-semibold mb-8">Price Details</p>
                <div className="flex flex-wrap gap-x-8 gap-y-2 mb-2">
                  <p className="w-42">
                    <span>Freight Price: </span>
                    <span>{order.freightPrice} NGN</span>
                  </p>
                  <p>
                    <span className="mr-4">Additional Charges:</span>
                    {order.additionalCharges ? (
                      Object.keys(order.additionalCharges).map((key) => (
                        <span key={key}>
                          <span>{key}: </span>
                          <span>{order.additionalCharges[key]} NGN</span>
                        </span>
                      ))
                    ) : (
                      <span>None</span>
                    )}
                  </p>
                  <p className="w-44">
                    <span>Insurance: </span>
                    <span>{order.insurance} NGN</span>
                  </p>
                  <p className="w-42">
                    <span>VAT: </span>
                    <span>{order.VAT} NGN </span>
                  </p>
                  <p className="w-42">
                    <span>Total: </span>
                    <span>{order.total} NGN</span>
                  </p>
                </div>
                <p>Payment Information</p>
                <div className="flex flex-wrap gap-4">
                  <p className="w-42">
                    <span>Payment Status: </span>
                    <span></span>
                  </p>
                  <p className="w-42">
                    <span>Payment Reciept: </span>
                    <span>{order.receiptInfo}</span>
                  </p>
                </div>
              </div>
              {order.subReceiverName && (
                <div className=" bg-red-500 shadow-2xl text-white w-full italic p-8 rounded-lg mb-4">
                  <p className="text-lg font-medium">
                    {order.subReceiverName} with phone number{" "}
                    {order.subReceiverPhone} has been assigned to picked up the
                    order. Please give a confirmatory call to the receiver.
                  </p>
                </div>
              )}

              <div className=" bg-blue-500 text-white w-full p-8 rounded-lg mb-4">
                <p className="text-xl font-semibold mb-8">
                  Tracking and Delivery
                </p>
                <div className="flex flex-wrap gap-x-8 gap-y-2 mb-2">
                  <p className="mb-6">
                    <span className="font-bold">Delivery Status: </span>
                    <span>{order.deliveryStatus}</span>
                  </p>
                </div>
                <p className="font-bold mb-4">Tracking Details:</p>
                <div className="flex flex-col gap-4 w-full">
                  {order.trackingInfo.map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <p className="w-[50%]">
                        <span className="font-bold">Info:</span> {item.info}
                      </p>
                      <p>
                        <span className="font-bold">Time:</span> {item.time}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {order.receivedByName ? (
                <div className=" bg-blue-500 shadow-2xl text-white w-full p-8 rounded-lg mb-4">
                  <p className="text-lg font-medium">
                    {order.receivedByName} with phone number{" "}
                    {order.receivedByPhone} has picked up the order
                  </p>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="w-full rounded-lg p-8 bg-blue-200 flex flex-wrap justify-around gap-y-4">
            <p className="font-bold text-lg mb-6">Order Story</p>
            <div className="flex flex-col gap-4 w-full">
              {order.history.map((item, i) => (
                <div key={i} className="flex justify-between">
                  <p className="w-[50%]">
                    <span className="font-bold">Info:</span> {item.info}
                  </p>
                  <p>
                    <span className="font-bold">Time:</span> {item.time}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <Modal id="payment-modal" title="Enter Payment Details">
            <div className=" w-full">
              <div className="flex gap-2 w-full mb-4 items-center">
                <span className=" font-medium">Payment:</span>
                <Select
                  options={appBrain.paymentTypes}
                  value={paymentMode}
                  children={"Select one"}
                  handleChange={(e) => setPaymentMd(e.target.value)}
                />
              </div>

              {paymentMode && (
                <div className="w-full mb-4">
                  <p className="mb-3">Receipt Information</p>
                  <Textarea
                    placeholder="Enter Receipt Information here"
                    value={receipt}
                    handleChange={(e) => {
                      setReceipt(e.target.value);
                    }}
                    rows={5}
                  />
                </div>
              )}
            </div>
            <CustomButton
              handleClick={() => {
                if (!paymentMode) return;
                if (paymentMode && !receipt) return;

                openModal("payment-summary");
              }}
            >
              Set Payment
            </CustomButton>
          </Modal>
          <Modal id="payment-summary" title="Payment Summary">
            <div className=" flex flex-col gap-6">
              <p className="text-red-500">
                Please ensure that the details you entered are correct, this is
                not reversible
              </p>
              <div className=" flex flex-col md:flex-row gap-6">
                <p>Payment Mode: {paymentMode}</p>

                {paymentMode && <p>Receipt info: {receipt}</p>}
              </div>
              <CustomButton
                handleClick={() => {
                  setAction("pay");
                  openModal("pin-modal");
                }}
              >
                Proceed
              </CustomButton>
            </div>
          </Modal>
          <Modal id="trip-assign" title="Assign Trip">
            <div className="w-full mt-8 mb-8 flex flex-col gap-10">
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
            </div>
            <CustomButton
              handleClick={() => {
                tripId ? openModal("pin-modal") : alert("No trip selected");
                setAction("assignTrip");
              }}
            >
              Set Trip
            </CustomButton>
          </Modal>
          <Modal id="trip-unassign" title="Unassign Trip">
            <div className="p-10">
              <p className="text-red-600 mb-8">
                Are you sure you want to unassign trip for this order
              </p>
              <CustomButton
                handleClick={() => {
                  setAction("unassignTrip");
                  openModal("pin-modal");
                }}
              >
                Proceed
              </CustomButton>
            </div>
          </Modal>
          <Modal id="transship" title="Set Transfer Station">
            <div className="w-full mt-8 mb-8 flex flex-col gap-10">
              <div className="flex gap-4 items-center">
                <p className="text-lg min-w-fit">Select Station</p>

                <Select
                  options={stationsList}
                  value={transferStation}
                  handleChange={(e) => setTransferStation(e.target.value)}
                  children="Select Station"
                />
              </div>
            </div>
            <CustomButton
              handleClick={() => {
                transferStation
                  ? openModal("confirm-transship")
                  : alert("No Station selected");
              }}
            >
              Set Transfer station
            </CustomButton>
          </Modal>
          <Modal id="confirm-transship" title="Confirm Transfer Station">
            <div className="p-8 mb-8">
              <p className="text-xl font-bold">Confirm Transfer Station</p>
              <p>Transfer station: {transferStation}</p>
            </div>
            <CustomButton
              handleClick={() => {
                openModal("pin-modal");

                setAction("transship");
              }}
            >
              Proceed
            </CustomButton>
          </Modal>
          <Modal id="dispatched" title="Confirm action">
            <div className="p-8 mb-8">
              <p className="text-xl font-bold">Set order as dispatched.</p>
              <p className="text-red-600">Note: action is not reversible</p>
            </div>
            <CustomButton
              handleClick={() => {
                openModal("pin-modal");

                setAction("dispatched");
              }}
            >
              Proceed
            </CustomButton>
          </Modal>
          <Modal id="arrived" title="Confirm action">
            <div className="p-8 mb-8">
              <p className="text-xl font-bold">Set order as arrived.</p>
              <p className="text-red-600">Note: action is not reversible</p>
            </div>
            <CustomButton
              handleClick={() => {
                openModal("pin-modal");

                setAction("arrived");
              }}
            >
              Proceed
            </CustomButton>
          </Modal>
          <Modal id="delivered" title="Confirm action">
            <div className=" w-full p-8 rounded-lg mb-4">
              <p className="text-xl font-semibold">Order Received by</p>
              <p className=" mb-8">
                Please enter the name and phone number of the person who
                received the order
              </p>
              <div className="flex flex-col md:flex-row gap-x-8 gap-y-4 justify-around">
                <div className="flex gap-2 items-center">
                  <p className="font-bold mb-4">Name:</p>
                  <Input
                    value={receivedByName}
                    handleChange={(e) => {
                      setReceivedByName(e.target.value);
                      console.log(e.target.value);
                    }}
                  />
                </div>
                <div className="flex gap-2 items-center">
                  <p className="font-bold mb-4">Phone:</p>
                  <Input
                    value={receivedByPhone}
                    handleChange={(e) => {
                      setReceivedByPhone(e.target.value);
                    }}
                  />
                </div>
              </div>
              <Modal id="set-received-by" title="Confirm Receiver">
                <div className="text-gray-700 w-[300px] mx-auto md:w-[400px]">
                  <p className="text-center">
                    Order was picked up by {receivedByName} with phone number{" "}
                    {receivedByPhone}
                  </p>

                  <CustomButton
                    handleClick={() => {
                      openModal("pin-modal");

                      setAction("delivered");
                    }}
                  >
                    Proceed
                  </CustomButton>
                </div>
              </Modal>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => {
                    if (!receivedByName || !receivedByPhone) {
                      alert("please fill all required fields");
                      return;
                    }
                    openModal("set-received-by");
                  }}
                  className="py-2 px-4 bg-blue-600 text-white rounded-lg"
                >
                  Submit
                </button>
              </div>
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
  ) : (
    <NotFound />
  );
};

export default OrderPage;
