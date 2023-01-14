import React, { useState } from "react";
import CustomButton from "../components/button/button";

import OrderSummary from "../components/orderSummary";
import Modal from "../components/Modal";
import Select from "../components/select-input/select";
import { appBrain } from "../AppBrain";
import {
  setPayOnDelivery,
  setPaymentMode,
  setReceiptInfo,
  setPaymentStatus,
  resetOrder,
} from "../redux/order.slice";
import { resetCustomer } from "../redux/customer.slice";
import { useSelector, useDispatch } from "react-redux";
import Textarea from "../components/textarea/textarea";
import { useThemeContext } from "../contexts/themeContext";

import { useUserContext } from "../contexts/CurrentUser.Context";
import PinModal from "../components/PinModal";
import { Link, useNavigate } from "react-router-dom";
import { useNewWaybillContext } from "../contexts/NewWaybillContext";
import { useAppConfigContext } from "../contexts/AppConfig.context";
import { createCustomerAndOrder, createOrder } from "../firebase/firebase";

const OrderSummaryPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useUserContext();
  const {comparePin}= useAppConfigContext()
  const { openModal, closeModal } = useThemeContext();
  const { newCustomer } = useNewWaybillContext();

  const dispatch = useDispatch();
  const order = useSelector((state) => state.order);
  const customer = useSelector((state) => state.customer);
  const handleSubmit = async () => {
    if (comparePin(Pin, currentUser.pin)) {
      if (order.payOnDelivery === "No") {
        if (order.paymentMode === "Wallet") {
          // remove money from customer wallet and save
          console.log("money removed form wallet");
          console.log("order saved to database");
          dispatch(setPaymentStatus(true));
          closeModal("pin-modal");
          closeModal("payment-modal");
        } else {
          // Save order
          newCustomer === "Yes"
            ? createCustomerAndOrder(customer, order)
            : createOrder(order);
          dispatch(setPaymentStatus(true));
          closeModal("pin-modal");
          closeModal("payment-modal");
        }
      } else {
        // Save order to database

        closeModal("pin-modal");
        closeModal("payment-modal");
      }
    } else alert("Error: Wrong Pin");
  };

  const [Pin, setPin] = useState("");
  return (
    <div className="relative p-20">
      <OrderSummary />
      <div className="mt-8"></div>
      {order.payOnDelivery === "Yes" ? (
        <div className="w-full flex flex-col md:flex-row justify-center gap-8 ">
          <Link to="/print-waybill" target="blank">
            <CustomButton>Print Order</CustomButton>
          </Link>
          <CustomButton
            handleClick={() => {
              dispatch(resetOrder());
              dispatch(resetCustomer());
              navigate("/");
            }}
          >
            Finished
          </CustomButton>
        </div>
      ) : order.payOnDelivery === "No" ? (
        !order.paid ? (
          <CustomButton handleClick={() => openModal("payment-modal")}>
            Enter Payment Information
          </CustomButton>
        ) : (
          <div className="w-full flex flex-col md:flex-row justify-center gap-8">
            <Link to="/print-waybill" target="blank">
              <CustomButton>Print Order</CustomButton>
            </Link>
            <CustomButton
              handleClick={() => {
                dispatch(resetOrder());
                dispatch(resetCustomer());
                navigate("/");
              }}
            >
              Finished
            </CustomButton>
          </div>
        )
      ) : (
        <CustomButton handleClick={() => openModal("payment-modal")}>
          Enter Payment Information
        </CustomButton>
      )}

      <Modal id="payment-modal" title="Payment">
        <div className=" flex flex-col md:flex-row gap-8 md:items-center">
          <span className=" font-medium">Pay on Delivery</span>
          <Select
            options={appBrain.cashOnDeliveryOptions}
            name={"payOnDelivery"}
            value={order.payOnDelivery}
            children={"Select one"}
            handleChange={(e) => {
              dispatch(setPayOnDelivery(e.target.value));
              e.target.value === "Yes" && dispatch(setPaymentMode(""));
            }}
          />
        </div>
        <div className="w-full mt-8 flex flex-col md:flex-row flex-wrap gap-10">
          {order.payOnDelivery === "No" && (
            <div className=" flex flex-col md:flex-row gap-8 w-full md:items-center">
              <span className=" font-medium">Select payment type</span>
              <Select
                options={appBrain.paymentTypes}
                name={"paymentMode"}
                value={order.paymentMode}
                children={"Select one"}
                handleChange={(e) => dispatch(setPaymentMode(e.target.value))}
              />
            </div>
          )}
          {order.paymentMode && order.paymentMode !== "Wallet" ? (
            <div className="w-full">
              <p>Receipt Information</p>
              <Textarea
                name={"itemDescription"}
                placeholder="Enter Receipt Information here"
                value={order.receiptInfo}
                handleChange={(e) => dispatch(setReceiptInfo(e.target.value))}
                rows={5}
              />
              <div className="text-center">
                <CustomButton
                  handleClick={() => {
                    openModal("pin-modal");
                  }}
                >
                  Save Order
                </CustomButton>
              </div>
            </div>
          ) : (
            order.paymentMode === "Wallet" && (
              <div className="text-center w-full">
                <CustomButton
                  handleClick={() => {
                    openModal("pin-modal");
                  }}
                >
                  Make Payment
                </CustomButton>
              </div>
            )
          )}
          {order.payOnDelivery === "Yes" && (
            <div className="text-center w-full">
              <CustomButton
                handleClick={() => {
                  openModal("pin-modal");
                }}
              >
                Save Order
              </CustomButton>
            </div>
          )}
        </div>
      </Modal>
      <PinModal
        pin={Pin}
        handleChange={(e) => setPin(e.target.value)}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default OrderSummaryPage;
