import React, { useState } from "react";
import CustomButton from "../components/button/button";

import OrderSummary from "../components/orderSummary";
import Modal from "../components/Modal";
import Select from "../components/select-input/select";
import { appBrain, idGenerator } from "../AppBrain";
import {
  setPayOnDelivery,
  setPaymentMode,
  setReceiptInfo,
  setPaymentStatus,
  resetOrder,
} from "../redux/order.slice";
import { setWalletBalance } from "../redux/customer.slice";
import { resetCustomer } from "../redux/customer.slice";
import { useSelector, useDispatch } from "react-redux";
import Textarea from "../components/textarea/textarea";
import { useThemeContext } from "../contexts/themeContext";

import { useUserContext } from "../contexts/CurrentUser.Context";
import PinModal from "../components/PinModal";
import { Link, useNavigate } from "react-router-dom";
import { useNewWaybillContext } from "../contexts/NewWaybillContext";
import { useAppConfigContext } from "../contexts/AppConfig.context";

import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

const OrderSummaryPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useUserContext();
  const { comparePin } = useAppConfigContext();
  const { openModal, closeModal } = useThemeContext();
  const { newCustomer, setNewCustomer } = useNewWaybillContext();
  const customer = useSelector((state) => state.customer);
  const order = useSelector((state) => state.order);
  const [paymentOnDelivery, setPaymentOnDelivery] = useState(
    order.payOnDelivery
  );
  const [paymentMode, setPaymentMd] = useState(order.paymentMode);
  const [paymentSet, setPaymentSet] = useState(false);
  const [saved, setSaved] = useState(false);
  const [receipt, setReceipt] = useState(order.receiptInfo);
  const [walletPay, setWalletPay] = useState(false);
  const paymentId = idGenerator(10);

  const [Pin, setPin] = useState("");
  const dispatch = useDispatch();

  const today = new Date();
  const createOrder = () => {
    const orderRef = doc(db, "orders", order.id);

    setDoc(orderRef, {
      ...order,
      dateCreated: serverTimestamp(),
      history: [
        {
          info: `Order created by ${currentUser.displayName}`,
          time: today.toLocaleString(),
        },
      ],
    });
    if (order.payOnDelivery === "No") {
      if (order.paymentMode === "Wallet") {
        setDoc(doc(db, "walletPayout", paymentId), {
          id: paymentId,
          customerId: customer.id,
          customerName: customer.firstName + " " + customer.lastName,
          businessName: customer.businessName,
          amount: order.total,
          purpose: "Order Payment",
          orderId: order.id,
          receiptInfo: receipt,
          dateMade: serverTimestamp(),
          processedBy: currentUser.displayName,
          station: currentUser.station,
        });

        createOrder(order);
      } else {
        setDoc(doc(db, "income", paymentId), {
          id: paymentId,
          customerId: customer.id,
          customerName: customer.firstName + " " + customer.lastName,
          businessName: customer.businessName,
          amount: order.total,
          purpose: "Order Payment",
          orderId: order.id,
          paymentMode,
          receiptInfo: receipt,
          dateMade: serverTimestamp(),
          processedBy: currentUser.displayName,
          station: currentUser.station,
        });
      }
    }

    setSaved(true);
  };
  const createCustomerAndOrder = async () => {
    const customersRef = collection(db, "customers");
    const q = query(
      customersRef,
      where("phoneNumber", "==", customer.phoneNumber)
    );
    const querySnapshot = await getDocs(q);
    const customerRef = doc(db, "customers", customer.id);

    if (querySnapshot.empty) {
      setDoc(customerRef, {
        ...customer,
        dateCreated: serverTimestamp(),
        history: [
          {
            info: `Customer created by ${currentUser.displayName}`,
            time: today.toLocaleString(),
          },
        ],
      });
      createOrder();
    } else {
      alert("Customer with phone number exists");
      setSaved(false);
      return;
    }
  };

  const setPaymentDetails = () => {
    dispatch(setPayOnDelivery(paymentOnDelivery));
    if (paymentOnDelivery === "No") dispatch(setPaymentMode(paymentMode));
    if (paymentMode) {
      dispatch(setPaymentStatus(true));
      if (paymentMode !== "Wallet") {
        dispatch(setReceiptInfo(receipt));
      } else {
        dispatch(setWalletBalance(customer.walletBalance - order.total));
      }
    }
    closeModal("payment-summary");
    closeModal("payment-modal");
    setPaymentSet(true);
  };

  const saveTransaction = () => {
    newCustomer === "Yes"
      ? createCustomerAndOrder(customer, order)
      : createOrder(order);
  };
  const handleSubmit = async () => {
    if (comparePin(Pin, currentUser.pin)) {
      saveTransaction();
      setPin("");
      closeModal("pin-modal");
    } else alert("Error: Wrong Pin");
  };

  return (
    <div className="p-20">
      <OrderSummary />
      {paymentSet ? (
        saved ? (
          <div className="w-full flex flex-col md:flex-row justify-center gap-8 ">
            <Link to="/print-waybill" target="blank">
              <CustomButton>Print Order</CustomButton>
            </Link>
            <CustomButton
              handleClick={() => {
                dispatch(resetOrder());
                dispatch(resetCustomer());
                setNewCustomer("");
                navigate("/");
              }}
            >
              Finish
            </CustomButton>
          </div>
        ) : (
          <CustomButton handleClick={() => openModal("pin-modal")}>
            Save Order
          </CustomButton>
        )
      ) : (
        <CustomButton
          handleClick={() => {
            console.log(order);
            openModal("payment-modal");
          }}
        >
          Enter Payment Information
        </CustomButton>
      )}

      <Modal id="payment-modal" title="Enter Payment Details">
        <div className=" flex flex-col md:flex-row gap-8 md:items-center">
          <span className=" font-medium">Pay on Delivery</span>
          <Select
            options={appBrain.cashOnDeliveryOptions}
            value={paymentOnDelivery}
            children={"Select one"}
            handleChange={(e) => {
              setPaymentOnDelivery(e.target.value);
              (!e.target.value || e.target.value === "Yes") && setPaymentMd("");
              (!e.target.value || e.target.value === "Yes") &&
                setWalletPay(false);
            }}
          />
        </div>
        <div className="w-full mt-8 mb-8 flex flex-col md:flex-row flex-wrap gap-10">
          {paymentOnDelivery === "No" && (
            <div className=" flex flex-col md:flex-row gap-8 w-full md:items-center">
              {customer.customerType === "ecommerce" && (
                <div className="flex gap-2">
                  <p>Pay from Wallet:</p>
                  <Select
                    options={["Yes", "No"]}
                    value={walletPay ? "Yes" : "No"}
                    handleChange={(e) => {
                      e.target.value === "Yes"
                        ? setWalletPay(true)
                        : setWalletPay(false);
                      e.target.value === "Yes"
                        ? setPaymentMd("Wallet")
                        : setPaymentMd("");
                    }}
                  />
                </div>
              )}
              {!walletPay && (
                <div className="flex gap-2">
                  <span className=" font-medium">Payment Mode</span>
                  <Select
                    options={appBrain.paymentTypes}
                    name={"paymentMode"}
                    value={paymentMode}
                    children={"Select one"}
                    handleChange={(e) => setPaymentMd(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}
          {paymentMode && paymentMode !== "Wallet" && (
            <div className="w-full">
              <p>Receipt Information</p>
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
            if (!paymentOnDelivery) return;
            if (paymentOnDelivery === "No" && !paymentMode) return;
            if (
              paymentOnDelivery === "No" &&
              paymentMode !== "Wallet" &&
              !receipt
            )
              return;
            if (
              paymentMode === "Wallet" &&
              customer.walletBalance < order.total
            ) {
              alert("Not Enough Funds in wallet");
              return;
            }
            openModal("payment-summary");
          }}
        >
          Set Details
        </CustomButton>
      </Modal>
      <Modal id="payment-summary" title="Payment Summary">
        <div className=" flex flex-col gap-6">
          <p className="text-red-500">
            Please ensure that the details you entered are correct, this is not
            reversible
          </p>
          <div className=" flex flex-col md:flex-row gap-6">
            <p>Pay on Delivery: {paymentOnDelivery}</p>
            {paymentOnDelivery === "No" && <p>Payment Mode: {paymentMode}</p>}
            {paymentMode && paymentMode !== "Wallet" && (
              <p>Receipt info: {receipt}</p>
            )}
          </div>
          <CustomButton handleClick={setPaymentDetails}>Proceed</CustomButton>
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
