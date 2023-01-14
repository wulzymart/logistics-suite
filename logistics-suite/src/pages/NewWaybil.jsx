import React from "react";
import CustomerForm from "../components/forms/CustomerForm";
import OrderForm from "../components/forms/OrderForm";
import CustomButton from "../components/button/button";

import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const NewWaybil = () => {
  // const dispatch = useDispatch();

  const navigate = useNavigate();
  return (
    <div className="dark:text-white dark:bg-black">
      <Header category="form" title="New Waybill" />
      <CustomerForm />
      <OrderForm />
      <div>
        <CustomButton
          children={"Proceed"}
          handleClick={() => {
            navigate("/new-waybill/order-summary");
          }}
        />
      </div>
    </div>
  );
};

export default NewWaybil;
