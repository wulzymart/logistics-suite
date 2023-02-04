/* eslint-disable array-callback-return */
import { doc, getDoc } from "firebase/firestore";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { db } from "../firebase/firebase";

const OrderPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState();
  const [customer, setCustomer] = useState();
  const [Receiver, setReceiver] = useState();
  const [item, setItem] = useState();
  useEffect(() => {
    const orderRef = doc(db, "orders", id);
    const getOrder = async () => {
      const snapshot = await getDoc(orderRef);
      if (snapshot.exists()) {
        setOrder(snapshot.data());
        setReceiver(snapshot.data().receiver);
        setItem(snapshot.data().item);
        const customerRef = doc(db, "customers", snapshot.data().customerId);
        const customerSnapshot = await getDoc(customerRef);
        setCustomer(customerSnapshot.data());
      }
    };
    getOrder();
  }, []);
  return (
    <div>
      {order ? (
        <div className="flex flex-col gap-4 w-full">
          <Header title="Order Information" />
          <div className="w-full rounded-lg p-8 bg-blue-200 flex flex-wrap justify-around gap-y-4">
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
            <div className="flex flex-col  h-fulf w-1/3 bg-slate-100 border border-solid border-slate-300 p-8 rounded-lg ">
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
                        customer.address.lga +
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
                      Receiver.address.lga +
                      " " +
                      Receiver.address.state}
                  </span>
                </p>
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
                  <p className="w-42">
                    <span>Attendant's Name: </span>
                    <span>{order.attendant?.name}</span>
                  </p>
                  <p className="w-42">
                    <span>Attendant's Phone: </span>
                    <span>{order.attendant?.phone}</span>
                  </p>
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
              <div className=" bg-blue-500 text-white w-full p-8 rounded-lg mb-4">
                <p className="text-xl font-semibold mb-8">
                  Tracking and Delivery
                </p>
                <div className="flex flex-wrap gap-x-8 gap-y-2 mb-2">
                  <p className="w-42">
                    <span>Delivery Status: </span>
                    <span>Not Delivered</span>
                  </p>
                  <p className="w-42">
                    <span>Tracking Details: </span>
                    <span></span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>loading</p>
      )}
    </div>
  );
};

export default OrderPage;
