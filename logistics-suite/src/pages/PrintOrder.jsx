import React from "react";
import OrderSummary from "../components/orderSummary";

const PrintOrder = () => {
  return (
    <div>
      <div className="p-20">
        <OrderSummary />
        <div className="flex justify-between mt-20 mb-10">
          <div className="text-center">
            <hr className="w-full bg-black border-2" />
            <p>Staff signature</p>
          </div>
          <div className="text-center">
            <hr className="w-full bg-black border-2" />
            <p>Customer signature & Date</p>
          </div>
          <div className="text-center">
            <hr className="w-full bg-black border-2" />
            <p>Receivers Name & signature & Date</p>
          </div>
        </div>
        <p className="text-right text-sm font-normal">
          Printed on {new Date().toLocaleString()}
        </p>
      </div>
      <div className="p-20">
        <OrderSummary />
        <div className="flex justify-between mt-20 mb-10">
          <div className="text-center">
            <hr className="w-full bg-black border-2" />
            <p>Staff signature</p>
          </div>
          <div className="text-center">
            <hr className="w-full bg-black border-2" />
            <p>Customer signature & Date</p>
          </div>
          <div className="text-center">
            <hr className="w-full bg-black border-2" />
            <p>Receivers Name & signature & Date</p>
          </div>
        </div>
        <p className="text-right text-sm font-normal">
          Printed on {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default PrintOrder;
