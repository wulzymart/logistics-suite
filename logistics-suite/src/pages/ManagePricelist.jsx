/* eslint-disable array-callback-return */

import axios from "axios";
import React, { useEffect, useState } from "react";
import CustomButton from "../components/button/button";
import Header from "../components/Header";
import Input from "../components/input/input";
import PinModal from "../components/PinModal";
import { useAppConfigContext } from "../contexts/AppConfig.context";
import { useUserContext } from "../contexts/CurrentUser.Context";
import { useThemeContext } from "../contexts/themeContext";

const ManagePricelist = () => {
  const { pricing, pricingList, comparePin } = useAppConfigContext();
  const { currentUser } = useUserContext();
  const { openModal, closeModal } = useThemeContext();
  let [pricing_, setPricing] = useState(pricing);

  const [editMode, setEditMode] = useState(false);
  const [addMode, setAddMode] = useState(false);
  const [cartegory, setCategory] = useState("");
  const [ppw, setPpw] = useState("");
  const [price, setPrice] = useState("");
  const [weight, setWeight] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [pin, setPin] = useState("");
  const handleSubmit = () => {
    comparePin(pin, currentUser.pin)
      ? axios({
          method: "post",
          url: `https://kind-waders-hare.cyclic.app/pricing`,
          data: {
            pricing_,
          },
          headers: {
            " content-type": "application/json",
          },
        }).then((response) => {
          if (response.data === true) {
            alert("Cartegories settings updated");
          } else alert("error, contact app admin", response.data);
        })
      : alert("Incorrect Pin");
    setPin("");
    closeModal("pin-modal");
  };
  useEffect(() => {}, [pricing_]);
  return (
    pricingList && (
      <div>
        <Header title="Manage Pricelist" />
        <div className="flex flex-col md:flex-row justify-between">
          <p className="text-lg italic text-red-600">
            Warning! Improper settings may break the application. proceed with
            caution. Get a snapshot before proceeding
          </p>
          <CustomButton
            handleClick={() => {
              setEditMode(!editMode);
            }}
          >
            {editMode ? "Set" : "Edit"}
          </CustomButton>
        </div>
        <div className="flex flex-col gap-8">
          {Object.keys(pricing_).map((item, i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row gap-6 items-center"
            >
              <p>{item}:</p>
              {pricing_[item] &&
                Object.keys(pricing_[item]).map((pricingItem, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-2 text-center justify-center"
                  >
                    <span>{pricingItem}</span>
                    <Input
                      type="number"
                      disabled={!editMode}
                      value={pricing_[item][pricingItem]}
                      handleChange={(e) => {
                        pricing_[item][pricingItem] = e.target.value;
                        setPricing({
                          ...pricing_,
                        });
                      }}
                    />
                  </div>
                ))}
              <button
                className="bg-gray-300 p-3 rounded-xl shadow-sm"
                disabled={!editMode}
                onClick={() => {
                  const newp = {};
                  Object.keys(pricing_).map((priItem) => {
                    if (pricing_[priItem] !== pricing_[item]) {
                      Object.assign(newp, { [priItem]: pricing_[priItem] });
                    }
                  });

                  setPricing(newp);
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
        <div className="mt-10 mb-8 flex flex-col md:flex-row gap-8 items-center justify-between">
          <p className="text-lg font-bold ">Add New Cartegory</p>
          <CustomButton
            handleClick={() => {
              setAddMode(!addMode);
            }}
          >
            {addMode ? "Set" : "Add Cartegory"}
          </CustomButton>
        </div>
        <div className="flex flex-col md:flex-row gap-6 items-center mb-10">
          <div className="flex flex-col gap-2 text-center justify-center">
            <span>Category</span>
            <Input
              type="text"
              disabled={!addMode}
              value={cartegory}
              handleChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2 text-center justify-center">
            <span>Price/Kg</span>
            <Input
              type="number"
              disabled={!addMode ? !addMode : price}
              value={ppw}
              handleChange={(e) => setPpw(+e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2 text-center justify-center">
            <span>Price</span>
            <Input
              type="number"
              disabled={!addMode ? !addMode : ppw}
              value={price}
              handleChange={(e) => setPrice(+e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2 text-center justify-center">
            <span>Weight(kg)</span>
            <Input
              type="number"
              disabled={!addMode}
              value={weight}
              handleChange={(e) => setWeight(+e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2 text-center justify-center">
            <span>Min. weight</span>
            <Input
              type="number"
              disabled={!addMode}
              value={min}
              handleChange={(e) => setMin(+e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2 text-center justify-center">
            <span>Max. Weight</span>
            <Input
              type="number"
              disabled={!addMode}
              value={max}
              handleChange={(e) => setMax(+e.target.value)}
            />
          </div>
          <button
            className="bg-gray-300 p-3 rounded-xl shadow-sm"
            disabled={!addMode}
            onClick={() => {
              const newp = pricing_;
              Object.assign(newp, {
                [cartegory]: { ppw, price, weight, min, max },
              });

              setPricing(newp);
              setCategory("");
              setPpw("");
              setPrice("");
              setWeight("");
              setMin("");
              setMax("");
            }}
          >
            Add
          </button>
        </div>
        <CustomButton
          handleClick={() => {
            openModal("pin-modal");
          }}
        >
          Save Pricing
        </CustomButton>
        <PinModal
          pin={pin}
          handleChange={(e) => setPin(e.target.value)}
          handleSubmit={handleSubmit}
        />
      </div>
    )
  );
};

export default ManagePricelist;
