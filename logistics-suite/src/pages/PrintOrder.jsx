import React from "react";
import OrderSummary from "../components/orderSummary";

const PrintOrder = () => {
  return (
    <div className="p-20">
      <OrderSummary />
      <div className="flex justify-between mt-20 p-20">
        <div className="text-center">
          <hr className="w-40 bg-black border-2" />
          <p>Staff signature</p>
        </div>
        <div className="text-center">
          <hr className="w-40 bg-black border-2" />
          <p>Customer signature</p>
        </div>
      </div>
    </div>
  );
};

export default PrintOrder;
