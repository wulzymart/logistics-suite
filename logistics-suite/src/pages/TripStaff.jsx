/* eslint-disable react-hooks/exhaustive-deps */
import { doc, getDoc } from "firebase/firestore";

import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import CustomButton from "../components/button/button";
import EditTripStaff from "../components/forms/EditTripStaff";
import Header from "../components/Header";
import { useUserContext } from "../contexts/CurrentUser.Context";
import { useThemeContext } from "../contexts/themeContext";
import { db } from "../firebase/firebase";

const TripStaff = () => {
  const { id } = useParams();

  const { openModal } = useThemeContext();
  const { currentUser } = useUserContext();
  const [data, setData] = useState();

  const tripStaffRef = doc(db, "tripStaff", id);
  const getUser = async () => {
    await getDoc(tripStaffRef)
      .then((doc) => setData(doc.data()))
      .catch((err) => alert(err));
  };

  useEffect(() => {
    getUser();
  }, []);

  return data ? (
    <div>
      <Header title="Trip Staff Details" />
      <div className="flex flex-wrap">
        <div className="w-full md:w-1/2 p-2">
          <div className="p-2 bg-white dark:bg-slate-500 dark:text-white rounded-lg shadow">
            <h2 className="text-lg font-medium">Personal Information</h2>
            <div className="p-2">
              <p className="text-[15px] font-medium">
                First Name: {data.firstName}
              </p>
              <p className="text-[15px] font-medium">
                Last Name: {data.lastName}
              </p>
              <p className="text-[15px] font-medium">
                Qualification(s): {data.qualification}
              </p>

              <p className="text-[15px] font-medium">Gender: {data.gender}</p>
              {data.dateofBirth && (
                <p className="text-[15px] font-medium">
                  Date of Birth:{" "}
                  {
                    new Date(data.dateofBirth)
                      .toLocaleString("en-US")
                      .split(",")[0]
                  }
                </p>
              )}
              {data.dateofBirth && (
                <p className="text-[15px] font-medium">
                  Age:{" "}
                  {new Date().getYear() - new Date(data.dateofBirth).getYear()}
                </p>
              )}
            </div>
          </div>
          <div className="p-2 bg-white dark:bg-slate-500 dark:text-white rounded-lg shadow mt-2">
            <h2 className="text-lg font-medium">Contact Information</h2>
            <div className="p-2">
              <p className="text-[15px] font-medium">
                Phone Number: {data.phoneNumber}
              </p>
              <p className="text-[15px] font-medium">
                Address: {data.address.streetAddress}, {data.address.state}
              </p>
              <p className="text-[15px] font-medium">
                Next of Kin: {data.nextOfKin.name}
              </p>
              <p className="text-[15px] font-medium">
                Next of Kin Phone Number: {data.nextOfKin.phoneNumber}
              </p>
            </div>
          </div>
          <div className="p-2 bg-white dark:bg-slate-500 dark:text-white rounded-lg shadow mt-2">
            <h2 className="text-lg font-medium">Bank Information</h2>
            <div className="p-2">
              <p className="text-[15px] font-medium">
                Bank Name: {data.bank?.bankName}
              </p>
              <p className="text-[15px] font-medium">
                Account Number: {data.bank?.accountNo}
              </p>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 p-2">
          <div className="p-2 bg-white dark:bg-slate-500 dark:text-white rounded-lg shadow ">
            <h2 className="text-lg font-medium">Coverage Information</h2>
            <div className="p-2">
              <p className="text-[15px] font-medium">
                Coverage: {data.coverage}
              </p>
              {data.coverage === "Local Station" ? (
                <p className="text-[15px] font-medium">
                  Station: {data.station}
                </p>
              ) : (
                ""
              )}
              <p className="text-[15px] font-medium">Role: {data.role}</p>
            </div>
          </div>

          <div className="p-2 bg-white dark:bg-slate-500 dark:text-white rounded-lg shadow mt-2">
            <h2 className="text-lg font-medium">Guarantor Information</h2>
            <div className="p-2">
              <p className="text-[15px] font-medium">
                Guarantor 1: {data.guarantor1.name}
              </p>
              <p className="text-[15px] font-medium">
                Guarantor 1 Phone Number: {data.guarantor1.phoneNumber}
              </p>
              <p className="text-[15px] font-medium">
                Guarantor 2: {data.guarantor2.name}
              </p>
              <p className="text-[15px] font-medium">
                Guarantor 2 Phone Number: {data.guarantor2.phoneNumber}
              </p>
            </div>
          </div>
          <div className="p-2 bg-white dark:bg-slate-500 dark:text-white rounded-lg shadow mt-2">
            <h2 className="text-lg font-medium">Salary Information</h2>
            <div className="p-2">
              <p className="text-[15px] font-medium">
                Gross Salary: {data.grossSalary} NGN
              </p>
              <p className="text-[15px] font-medium">Tax: {data.tax} NGN</p>
              <p className="text-[15px] font-medium">
                Pension: {data.pension} NGN
              </p>
              <p className="text-[15px] font-medium">
                Net Salary: {data.netSalary} NGN
              </p>
            </div>
          </div>
        </div>
        <div className="mt-10 w-full flex justify-center">
          <CustomButton
            handleClick={() => {
              currentUser.adminRight === "Super Admin"
                ? openModal("edit-staff")
                : alert("You dont have the right to this operation");
            }}
          >
            Edit
          </CustomButton>
        </div>
      </div>
      {data && <EditTripStaff data={data} />}
    </div>
  ) : (
    <p>loading...</p>
  );
};

export default TripStaff;
