import React from "react";
import { appBrain, idGenerator } from "../../AppBrain";
import Select from "../select-input/select";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import "react-datepicker/dist/react-datepicker.css";
import Input from "../input/input";
import { HiSearch } from "react-icons/hi";
import {
  setCustomerId,
  setCustomerFirstName,
  setCustomerLastName,
  setCustomerPhone,
  setCustomerEmail,
  setCustomerState,
  setCustomerStreetAddress,
  getCustomerFromDB,
} from "../../redux/customer.slice";
import { useSelector, useDispatch } from "react-redux";
import { useNewWaybillContext } from "../../contexts/NewWaybillContext";

import { getCustomer } from "../../firebase/firebase";
import { useAppConfigContext } from "../../contexts/AppConfig.context";
import Textarea from "../textarea/textarea";

const CustomerForm = () => {
  const dispatch = useDispatch();
  const customer = useSelector((state) => state.customer);
  const { newCustomer, setNewCustomer } = useNewWaybillContext();
  const { statesList } = useAppConfigContext();

  return (
    <div id="customer" className="mb-20">
      <h1 className="font-bold text-xl text-center ">Customer Information</h1>
      <hr className="w-40 mx-auto mt-3 mb-10" />
      <div className=" flex flex-col gap-8  w-full  ">
        <div className="flex flex-col md:flex-row gap-10 min-w-fit">
          <p className=" font-medium  text-lg">New Customer ? </p>
          <Select
            options={appBrain.customerOptions}
            value={newCustomer}
            handleChange={(e) => {
              const value = e.target.value;
              value === "Yes" && dispatch(setCustomerId(idGenerator(12)));
              setNewCustomer(value);
            }}
            children={"Select One"}
          />
        </div>
        {newCustomer && (
          <div className="w-full">
            <p className="text-red-800 font-light text-xs mb-3">
              Enter customer information; (
              <i>
                Phone: *+2348012345678, *First name and *Last name, and other
                details
              </i>
              )
            </p>
            <div className=" mb-8 flex flex-col md:flex-row gap-8">
              <div className="w-full relative min-h-full">
                <PhoneInput
                  placeholder="Phone Number"
                  inputProps={{
                    required: true,
                    autoFocus: true,
                  }}
                  country={"ng"}
                  onlyCountries={["ng"]}
                  value={customer.phoneNumber}
                  prefix="+"
                  onChange={(phone) => {
                    phone = "+" + phone;

                    dispatch(setCustomerPhone(phone));
                  }}
                  containerClass={" !w-full"}
                  inputClass={"!w-full !h-11 !invalid:border-red-500"}
                />

                {newCustomer === "No" && (
                  <button
                    onClick={async () => {
                      const dbCustomer = await getCustomer(
                        customer.phoneNumber
                      );

                      dbCustomer && dispatch(getCustomerFromDB(dbCustomer));
                    }}
                    className="bg-blue-800 text-xl font-bold text-white absolute top-0 right-0 rounded-lg min-h-full w-10 flex justify-center items-center"
                  >
                    <HiSearch />
                  </button>
                )}
              </div>

              <Input
                type={"email"}
                required
                placeholder={"customer@example.com*"}
                value={customer.email}
                handleChange={(e) => dispatch(setCustomerEmail(e.target.value))}
                disabled={newCustomer === "No"}
              />
            </div>
            <div className=" flex flex-col md:flex-row gap-8">
              <Input
                type={"text"}
                required
                placeholder={"First Name*"}
                value={customer.firstName}
                handleChange={(e) =>
                  dispatch(setCustomerFirstName(e.target.value))
                }
                disabled={newCustomer === "No"}
              />
              <Input
                type={"text"}
                required
                placeholder={"Last Name*"}
                value={customer.lastName}
                handleChange={(e) =>
                  dispatch(setCustomerLastName(e.target.value))
                }
                disabled={newCustomer === "No"}
              />
            </div>

            <div>
              <p className="mt-8  font-light  mb-1">Customer Address</p>
              <div className="  flex flex-col   gap-3">
                <div className="mb-8 flex flex-col md:flex-row   gap-3">
                  <Select
                    name={"customerState"}
                    required
                    options={statesList ? statesList : ["loading"]}
                    value={customer.address.state}
                    handleChange={(e) =>
                      dispatch(setCustomerState(e.target.value))
                    }
                    children={"Select State"}
                  />
                </div>

                <Textarea
                  name={"customerStreetAddress"}
                  placeholder={"Address"}
                  required
                  value={customer.address.streetAddress}
                  handleChange={(e) =>
                    dispatch(setCustomerStreetAddress(e.target.value))
                  }
                  disabled={newCustomer === "No"}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      {customer.customerType === "E-commerce" && (
        <div className="my-8 flex justify-end">
          <p className="text-red-500 font-bold">
            Wallet Balance: {customer.walletBalance}NGN
          </p>
        </div>
      )}
    </div>
  );
};

export default CustomerForm;
