import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import CustomButton from "../components/button/button";
import Header from "../components/Header";
import { db } from "../firebase/firebase";
import { useUserContext } from "../contexts/CurrentUser.Context";

const CustomerPage = () => {
  const [customer, setCustomer] = useState();
  const { currentUser } = useUserContext();

  useEffect(() => {
    const customerRef = doc(db, "customers", "NF1UMS6Y17HX");
    const getCustomer = async () => {
      const snapshot = await getDoc(customerRef);
      if (snapshot.exists()) {
        setCustomer(snapshot.data());
      }
    };
    getCustomer();
  }, []);
  return (
    <div>
      {customer ? (
        <div className="flex flex-col gap-4 w-full">
          <Header title="Customer Information" />
          <div className="w-full rounded-lg p-8 bg-blue-200 flex flex-wrap justify-around gap-y-4">
            <div className="min-w-52 flex flex-col gap-4">
              <p className="flex flex-col  gap-2 mb-2">
                <span className="font-bold">Customer Name:</span>
                <span>{customer.firstName + " " + customer.lastName}</span>
              </p>
            </div>
            <div className="min-w-52 flex flex-col gap-4">
              <p className="flex flex-col  gap-2 mb-2">
                <span className="font-bold">Business Name:</span>
                <span>{customer.businessName}</span>
              </p>
            </div>
            <div className="min-w-52 flex flex-col gap-4">
              <p className="flex flex-col   gap-2 mb-2">
                <span className="font-bold">Date Created:</span>
                <span>
                  {customer.dateRegistered
                    .toDate()
                    .toDateString()
                    .split(" ")[1] +
                    " " +
                    customer.dateRegistered
                      .toDate()
                      .toDateString()
                      .split(" ")[2] +
                    " " +
                    customer.dateRegistered
                      .toDate()
                      .toDateString()
                      .split(" ")[3]}
                </span>
              </p>
            </div>
            <div className="min-w-52 flex flex-col gap-4">
              <p className="flex gap-2 flex-col  mb-2">
                <span className="font-bold">Customer Type:</span>
                <span>{customer.customerType}</span>
              </p>
            </div>
            <div className="min-w-52 flex flex-col gap-4">
              {customer.customerType === "ecommerce" && (
                <p className="flex flex-col  gap-2 mb-2">
                  <span className="font-bold">Wallet Balance:</span>
                  <span>{customer.walletBalance} NGN</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row  gap-4 ">
            <div className="flex flex-col bg-blue-400  w-full p-8 rounded-lg mb-4 gap-y-2">
              <p className="">
                <span>Gender: </span>
                <span>{customer.sex}</span>
              </p>
              <p className="">
                <span>Date of Birth: </span>
                <span>
                  {customer.dateOfBirth.toDate().toDateString().split(" ")[1] +
                    " " +
                    customer.dateOfBirth.toDate().toDateString().split(" ")[2] +
                    " " +
                    customer.dateOfBirth.toDate().toDateString().split(" ")[3]}
                </span>
              </p>
            </div>
            <div className="flex flex-col bg-blue-400  w-full p-8 rounded-lg mb-4 gap-y-2">
              <p className="">
                <span>Phone Number: </span>
                <span>{customer.phoneNumber}</span>
              </p>
              <p className="">
                <span>Email: </span>
                <span>{customer.email}</span>
              </p>
            </div>
            <div className="flex flex-col bg-blue-400  w-full p-8 rounded-lg mb-4 gap-y-2">
              <p className="">Address:</p>
              <p className="">
                {customer.address.streetAddress +
                  " " +
                  customer.address.lga +
                  " " +
                  customer.address.state}
              </p>
            </div>
          </div>
          <div className="flex gap-4 flex-col md:flex-row">
            {customer.customerType === "ecommerce" ? (
              <div className="flex gap-4 flex-col md:flex-row">
                <CustomButton>Refill Wallet</CustomButton>
                {currentUser.adminRight === "Super Admin" && (
                  <CustomButton>Edit Details</CustomButton>
                )}
              </div>
            ) : currentUser.adminRight === "Super Admin" ? (
              <div className="flex gap-4 flex-col md:flex-row">
                <CustomButton>Edit Details</CustomButton>
                <CustomButton>Upgrade Customer</CustomButton>
              </div>
            ) : (
              <CustomButton>Edit Details</CustomButton>
            )}
          </div>
        </div>
      ) : (
        <p>loading</p>
      )}
    </div>
  );
};

export default CustomerPage;
