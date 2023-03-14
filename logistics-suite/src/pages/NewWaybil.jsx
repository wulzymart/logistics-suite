import React from "react";
import CustomerForm from "../components/forms/CustomerForm";
import OrderForm from "../components/forms/OrderForm";
import CustomButton from "../components/button/button";

import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

import { useNewWaybillContext } from "../contexts/NewWaybillContext";
import { useSelector } from "react-redux";

const NewWaybil = () => {
  const { newCustomer } = useNewWaybillContext();
  const order = useSelector((state) => state.order);
  const customer = useSelector((state) => state.customer);

  const navigate = useNavigate();
  return (
    <div className="dark:text-white dark:bg-black">
      <Header category="form" title="New Waybill" />
      <CustomerForm />
      {customer.phoneNumber && customer.phoneNumber.length === 14 && (
        <OrderForm />
      )}
      {newCustomer && (
        <div>
          <CustomButton
            children={"Proceed"}
            handleClick={() => {
              order.intraCity === "No"
                ? customer.firstName &&
                  customer.lastName &&
                  customer.id &&
                  customer.phoneNumber &&
                  order.id &&
                  order.originStation &&
                  order.deliveryType &&
                  order.deliveryService &&
                  order.destinationStation &&
                  order.receiver.firstName &&
                  order.receiver.lastName &&
                  order.receiver.phoneNumber &&
                  order.receiver.phoneNumber.length === 14 &&
                  order.item.description &&
                  order.item.cartegory &&
                  order.item.weight &&
                  order.total
                  ? navigate("/new-waybill/order-summary", { replace: true })
                  : alert("Please ensure you fill the details correctly")
                : customer.lastName &&
                  customer.id &&
                  customer.phoneNumber &&
                  order.id &&
                  order.originStation &&
                  order.receiver.firstName &&
                  order.receiver.lastName &&
                  order.receiver.phoneNumber &&
                  order.receiver.phoneNumber.length === 14 &&
                  order.item.description &&
                  order.item.cartegory &&
                  order.item.weight &&
                  order.total
                ? navigate("/new-waybill/order-summary")
                : alert("Please ensure you fill the details correctly");
            }}
          />
        </div>
      )}
    </div>
  );
};

export default NewWaybil;
