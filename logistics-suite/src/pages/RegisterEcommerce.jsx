import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import CustomButton from "../components/button/button";
import Input from "../components/input/input";
import Select from "../components/select-input/select";
import TextArea from "../components/textarea/textarea";
import { useAppConfigContext } from "../contexts/AppConfig.context";
import { useUserContext } from "../contexts/CurrentUser.Context";
import {
  setCustomerFirstName,
  setCustomerLastName,
  setCustomerPhone,
  setCustomerEmail,
  setCustomerState,
  setCustomerLga,
  setCustomerStreetAddress,
  setCustomerBusinessName,
  setWalletBalance,
  setCustomerType,
  resetCustomer,
} from "../redux/customer.slice";
import { useSelector, useDispatch } from "react-redux";
import Modal from "../components/Modal";
import PinModal from "../components/PinModal";
import { useThemeContext } from "../contexts/themeContext";
import { db } from "../firebase/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";

const RegisterEcommerce = () => {
  const dispatch = useDispatch();
  const customer = useSelector((state) => state.customer);
  const { states, statesList, comparePin } = useAppConfigContext();
  const { currentUser } = useUserContext();
  const { openModal, closeModal } = useThemeContext();
  const [Pin, setPin] = useState();
  const addEcommerce = async () => {
    if (comparePin(Pin, currentUser.pin)) {
      const customersRef = collection(db, "customers");
      const q = query(
        customersRef,
        where("phoneNumber", "==", customer.phoneNumber)
      );
      const querySnapshot = await getDocs(q);
      const customerRef = doc(db, "customers", customer.id);
      if (querySnapshot.empty) {
        setDoc(customerRef, customer);
        closeModal("pin-modal");
        closeModal("newEcommerce-modal");
        dispatch(resetCustomer());
      } else alert("Customer with phone number exists");
    } else alert("incorrect Pin");
  };

  return (
    <div>
      <h1 className="text-center text-3xl font-bold mb-8">
        Create New Ecommerce Customer
      </h1>
      <p className="text-xl text-red-800 mb-8">
        Please fill in the appropriate information
      </p>
      <div className="w-full flex flex-col md:flex-row gap-8 mb-8">
        <div className=" flex flex-col gap-4 w-full">
          <p>First Name</p>
          <Input
            type="text"
            value={customer.firstName}
            handleChange={(e) => {
              dispatch(setCustomerFirstName(e.target.value));
              dispatch(setCustomerType("ecommerce"));
            }}
          />
        </div>
        <div className=" flex flex-col gap-4 w-full">
          <p>Last Name</p>
          <Input
            type="text"
            value={customer.lastName}
            handleChange={(e) => dispatch(setCustomerLastName(e.target.value))}
          />
        </div>
        <div className=" flex flex-col gap-4 w-full">
          <p>Business Name</p>
          <Input
            type="text"
            value={customer.businessName}
            handleChange={(e) =>
              dispatch(setCustomerBusinessName(e.target.value))
            }
          />
        </div>
      </div>
      <p className="mb-4">Business Address</p>
      <div className="w-full flex flex-col md:flex-row gap-8 mb-8 items-center">
        <div className=" flex flex-col gap-8 w-full">
          <div className=" flex  gap-4 w-full items-center">
            <p>State</p>
            <Select
              options={statesList}
              value={customer.address.state}
              handleChange={(e) => {
                dispatch(setCustomerState(e.target.value));
              }}
            >
              Select State
            </Select>
          </div>
          <div className=" flex  gap-4 w-full items-center">
            <p>LGA</p>
            <Select
              name={"customerLga"}
              value={customer.address.lga}
              options={
                customer.address.state
                  ? states[customer.address.state].lgas
                  : [""]
              }
              handleChange={(e) => dispatch(setCustomerLga(e.target.value))}
              children={"Select LGA"}
            />
          </div>
        </div>

        <div className=" flex flex-col gap-8 w-full">
          <p> Street Address</p>
          <TextArea
            value={customer.address.streetAddress}
            handleChange={(e) =>
              dispatch(setCustomerStreetAddress(e.target.value))
            }
          />
        </div>
      </div>
      <div className="w-full flex flex-col md:flex-row gap-8 mb-8">
        <div className=" flex flex-col gap-4 w-full">
          <p>Email</p>
          <Input
            type="email"
            value={customer.email}
            handleChange={(e) => dispatch(setCustomerEmail(e.target.value))}
          />
        </div>
        <div className=" flex flex-col gap-4 w-full">
          <p>Phone Number</p>
          <PhoneInput
            className="!w-full h-full "
            inputClass="!h-full !w-full !rounded-lg"
            prefix="+"
            placeholder="Phone Number"
            country={"ng"}
            onlyCountries={["ng"]}
            value={customer.phoneNumber}
            onChange={(phone) => {
              phone = "+" + phone;

              dispatch(setCustomerPhone(phone));
            }}
          />
        </div>
        <div className=" flex flex-col gap-4 w-full">
          <p>Opening Balance</p>
          <Input
            type="number"
            value={customer.walletBalance}
            handleChange={(e) => dispatch(setWalletBalance(e.target.value))}
          />
        </div>
      </div>
      <CustomButton handleClick={() => openModal("newEcommerce-modal")}>
        Acknowledge Payment and Save
      </CustomButton>
      <Modal id="newEcommerce-modal" title="Ecommerce Customer Summary">
        <p className="italic font-medium text-red-600 mb-6">
          Kindly Review customer information and enter payment details
        </p>
        <div className=" flex flex-col md:flex-row gap-12 mb-4">
          <div className=" flex flex-col md:flex-row gap-2 md:items-center">
            <span className=" font-medium">Customer Name:</span>
            <span>{customer.firstName + " " + customer.lastName}</span>
          </div>
          <div className=" flex flex-col md:flex-row gap-2 md:items-center">
            <span className=" font-medium">Business Name:</span>
            <span>{customer.businessName}</span>
          </div>
        </div>
        <div className=" flex flex-col md:flex-row gap-12 mb-4">
          <div className=" flex flex-col md:flex-row gap-2 md:items-center">
            <span className=" font-medium">Phone Number:</span>
            <span>{customer.phoneNumber}</span>
          </div>
          <div className=" flex flex-col md:flex-row gap-2 md:items-center">
            <span className=" font-medium">Email:</span>
            <span>{customer.email}</span>
          </div>
        </div>
        <div className=" flex flex-col md:flex-row gap-12 mb-4">
          <div className=" flex flex-col md:flex-row gap-2 md:items-center mb-4 ">
            <span className=" font-medium">Address:</span>
            <span>
              {customer.address.streetAddress +
                " " +
                customer.address.lga +
                " " +
                customer.address.state}
            </span>
          </div>
          <div className=" flex flex-col md:flex-row gap-2 md:items-center">
            <span className=" font-medium">Type:</span>
            <span>{customer.customerType}</span>
          </div>
        </div>

        <div className=" flex flex-col md:flex-row gap-2 md:items-center mb-4 ">
          <span className=" font-medium">Opening Balance:</span>
          <span>{customer.walletBalance} NGN</span>
        </div>
        <div className=" flex flex-col md:flex-row gap-2 md:items-center mb-4">
          <span className=" font-medium">Receipt Information:</span>
          <TextArea placeholder="Enter all receipt details here, including type of payment" />
        </div>
        <CustomButton
          handleClick={() => {
            openModal("pin-modal");
          }}
        >
          Save Customer
        </CustomButton>
      </Modal>
      <PinModal
        pin={Pin}
        handleChange={(e) => setPin(e.target.value)}
        handleSubmit={addEcommerce}
      />
    </div>
  );
};

export default RegisterEcommerce;
