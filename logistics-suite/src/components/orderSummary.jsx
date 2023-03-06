import React from "react";
import { useSelector } from "react-redux";

import { default as Logo } from "../components/assets/fll1.png";
import { useAppConfigContext } from "../contexts/AppConfig.context";
import { useUserContext } from "../contexts/CurrentUser.Context";
const OrderSummary = () => {
  const { currentUser } = useUserContext();
  const { stations } = useAppConfigContext();
  const customer = useSelector((state) => state.customer);
  const order = useSelector((state) => state.order);
  const receiver = order.receiver;
  const address = stations[order.originStation]?.address;

  return (
    <div className="">
      <div className="flex w-full gap-24 items-center  justify-center mb-16">
        <img className="h-24" src={Logo} alt="fll logo" />
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-3xl text-center text-blue-800">
            First Line Logistics Nigeria Limited
          </h1>
          <p className="text-center text-md  text-[#ff2600] font-medium">
            Head Office: km 57, Agasa junction opposite Dr. Ado Ibrahim Building
            Agasa Okene Kogi, Nigeria
          </p>
          {order.originStation !== "Head Office" && (
            <p className="text-center text-[#ff2600] font-medium">
              Branch Address: {`${address.streetAddress} ${address.state}`}
            </p>
          )}
          <p className="text-center text-[#ff2600]">
            (+234)8167900003 (+234)8133434400{" "}
            {order.originStation !== "Head Office" &&
              stations[order.originStation]?.phoneNumber1}
          </p>
        </div>
      </div>
      <h1 className="text-center font-bold text-2xl mb-12">Waybill Summary</h1>
      {/* Order info */}
      <div className="flex flex-col md:flex-row items-center">
        <div className="flex flex-col gap-3 w-full mb-8">
          <p>
            Order Number: <span>{order.id}</span>
          </p>
          <p>Tracking Number: {order.id}</p>
          <p>Pay on delivery: {order.payOnDelivery}</p>
          <p>
            Payment Type:{" "}
            {order.paymentMode
              ? order.paymentMode
              : "No payment Information Yet"}
          </p>
          <p>Payment Status: {order.paid ? "Paid" : "Awaiting Payment"}</p>
        </div>
        <div className="flex flex-col gap-3 w-full mb-8">
          {order.deliveryType && <p>Delivery type: {order.deliveryType}</p>}
          {order.deliveryService && (
            <p>Service type: {order.deliveryService}</p>
          )}
          <p>Origin Station: {order.originStation}</p>
          <p>
            Destination station:{" "}
            {order.destinationStation
              ? order.destinationStation
              : "Intra City delivery"}
          </p>
          <p>
            Trip Number:{" "}
            {order.trip?.id ? order.trip.id : "Awaiting Trip Assignment"}
          </p>
          <p>
            Driver details:{" "}
            {order.trip?.driver
              ? order.trip.diverName + " " + order.trip.driverPhone
              : "Awaiting Trip Assignment"}{" "}
          </p>
        </div>
      </div>
      {/* customer and receiver info */}
      <div className="flex flex-col md:flex-row">
        {/* customer data */}
        <div className="w-full border-solid border-2 border-gray-800 dark:border-white p-5">
          <h3 className="font-medium text-xl mb-5">Customer's Details</h3>
          <div className="flex flex-col gap-2">
            <div>
              <span className="font-medium">Phone Number: </span>
              <span>{customer.phoneNumber}</span>
            </div>
            <div>
              <span className="font-medium">Name: </span>
              <span>{customer.firstName + " " + customer.lastName}</span>
            </div>
            <div>
              <span className="font-medium">Email: </span>
              <span>{customer.email}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-medium">Address: </span>
              <div className="flex flex-col">
                <span>
                  {customer.address.state ? customer.address.state : ""}
                </span>
                <span>{customer.address.lga ? customer.address.lga : ""}</span>
                <span>
                  {customer.address.streetAddress
                    ? customer.address.streetAddress
                    : ""}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* receivers data */}
        <div className="w-full border-solid border-2 border-gray-800  dark:border-white p-5">
          <h3 className="font-medium text-xl mb-5">Receiver's Details</h3>
          <div className="flex flex-col gap-2">
            <div>
              <span className="font-medium">Phone Number: </span>
              <span>{receiver.phone}</span>
            </div>
            <div>
              <span className="font-medium">Name: </span>
              <span>{receiver.firstName + " " + receiver.lastName}</span>
            </div>
            <div>
              <span className="font-medium">Business Name: </span>
              <span>{receiver.businessName ? receiver.businessName : ""}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-medium">Address: </span>
              <div className="flex flex-col">
                <span>
                  {receiver.address.state ? receiver.address.state : ""}
                </span>
                <span>{receiver.address.lga ? receiver.address.lga : ""}</span>
                <span>
                  {receiver.address.streetAddress
                    ? receiver.address.streetAddress
                    : ""}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* items details */}
      <div className="my-8 flex flex-col gap-5 p-5 border-solid border-2 border-gray-800  dark:border-white">
        <h2 className="text-xl font-medium">Item Details</h2>
        <div className="flex flex-col md:flex-row w-full justify-between">
          <div className="flex gap-2">
            <span className="font-medium">Cartegory:</span>
            <span>{order.item.cartegory}</span>
          </div>

          <div className="flex gap-2">
            <span className="font-medium">Items Condition:</span>
            <span>{order.item.condition}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="font-medium">Items Description:</span>
          <span>{order.item.description}</span>
        </div>
        <div className="flex flex-col md:flex-row w-full justify-between">
          <div className="flex gap-2">
            <span className="font-medium">Value:</span>
            <span>{order.item.value}NGN</span>
          </div>
          <div className="flex gap-2">
            <span className="font-medium">weight:</span>
            <span>{order.item.weight}KG</span>
          </div>
          <div className="flex gap-2">
            <span className="font-medium">Quantity:</span>
            <span>{order.item.quantity}</span>
          </div>
        </div>
      </div>
      {/* additional Charges */}
      {Object.keys(order.additionalCharges).length !== 0 && (
        <div className="my-8 flex flex-col gap-5 p-5 border-solid border-2 border-gray-800  dark:border-white">
          <h2 className="text-xl font-medium">Additional Charges</h2>
          <div className="flex flex-col md:flex-row flex-wrap w-full justify-between">
            {Object.keys(order.additionalCharges).map((charge, i) =>
              order.additionalCharges[charge] ? (
                <div key={i} className="flex gap-2">
                  <span className="font-medium">{charge}:</span>
                  <span>{order.additionalCharges[charge]} NGN</span>
                </div>
              ) : (
                ""
              )
            )}
          </div>
        </div>
      )}
      {/* Totals */}
      <div className="my-8 flex flex-col gap-5 p-5 border-solid border-2 border-gray-800  dark:border-white">
        <h2 className="text-xl font-medium">Totals</h2>
        <div className="flex flex-col md:flex-row flex-wrap w-full justify-between">
          <div className="flex gap-2">
            <span className="font-medium">Subtotal:</span>
            <span>{order.subtotal} NGN</span>
          </div>
          <div className="flex gap-2">
            <span className="font-medium">Insurance:</span>
            <span>{order.insurance || 0} NGN</span>
          </div>
          <div className="flex gap-2">
            <span className="font-medium">VAT:</span>
            <span>{order.VAT} NGN</span>
          </div>
          <div className="flex gap-2">
            <span className="font-medium">Total:</span>
            <span>{order.total} NGN</span>
          </div>
        </div>
      </div>

      <p>
        <span className="font-medium">Processed by: </span>
        {currentUser.firstName} {currentUser.lastName}
      </p>
    </div>
  );
};

export default OrderSummary;
