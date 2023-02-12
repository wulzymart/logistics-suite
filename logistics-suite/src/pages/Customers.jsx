/* eslint-disable react-hooks/exhaustive-deps */
import {
  collection,
  endBefore,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { HiSearch } from "react-icons/hi";
import PhoneInput from "react-phone-input-2";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Select from "../components/select-input/select";
import TableGrid from "../components/TableGrid";
import { useAppConfigContext } from "../contexts/AppConfig.context";
import { useUserContext } from "../contexts/CurrentUser.Context";
import { db } from "../firebase/firebase";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";

const Customers = () => {
  const { staffState } = useUserContext();

  const { statesList } = useAppConfigContext();

  const [state, setState] = useState(staffState);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [firstVisible, setFirstVisible] = useState("");
  const [lastVisible, setLastVisible] = useState("");

  const customersRef = collection(db, "customers");
  const [customers, setCustomers] = useState([]);
  const [searchResult, setSearchResult] = useState(null);
  const pageSize = 10;
  const searchByPhone = async () => {
    const queryPhone = query(
      customersRef,
      where("phoneNumber", "==", phoneNumber)
    );
    const querySnapshot = await getDocs(queryPhone);
    if (!querySnapshot.empty) {
      const tempData = [];
      querySnapshot.forEach((doc) => tempData.push(doc.data()));
      setSearchResult(tempData);
    } else alert("User not found");
  };

  const queryCustomers = query(
    customersRef,
    where("address.state", "==", state),
    orderBy("dateCreated", "asc"),
    limit(pageSize)
  );
  const nextCustomers = query(
    customersRef,
    where("address.state", "==", state),
    orderBy("dateCreated", "asc"),
    startAfter(lastVisible),
    limit(pageSize)
  );
  const previousCustomers = query(
    customersRef,
    where("address.state", "==", state),
    orderBy("dateCreated", "asc"),
    endBefore(firstVisible),
    limitToLast(pageSize)
  );
  function getName(params) {
    return `${params.row.firstName || ""} ${params.row.lastName || ""}`;
  }
  const columns = [
    {
      field: "id",
      headerName: " Id",
      width: 150,
      renderCell: (param) => {
        return <Link to={`/customers/${param.value}`}>{param.value}</Link>;
      },
    },
    {
      field: "customerName",
      headerName: "Customer's Name",
      valueGetter: getName,
      width: 150,
    },
    {
      field: "customerType",
      headerName: "Type",
      width: 150,
    },
    {
      field: "businessName",
      headerName: "Business Name",
      width: 150,
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      width: 150,
    },

    {
      field: "email",
      headerName: "Email",

      width: 150,
    },
  ];

  const getQuery = async (type) => {
    const querySnapshot = await getDocs(type);
    if (!querySnapshot.empty) {
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setFirstVisible(querySnapshot.docs[0]);
      const tempData = [];
      querySnapshot.forEach((doc) => {
        tempData.push(doc.data());
      });
      setCustomers(tempData);
    } else type === queryCustomers && setCustomers([]);
    type === nextCustomers && alert("No more customers in this list");
  };
  useEffect(() => {
    getQuery(queryCustomers);
  }, [state]);

  return staffState ? (
    <div>
      <Header title="View Customers" />
      <div className=" bg-blue-200 p-4 rounded-lg flex flex-col md:flex-row justify-end gap-4">
        <div className="md:w-1/4 flex relative">
          <Select
            options={statesList ? statesList : [""]}
            children="Select State"
            value={state}
            handleChange={(e) => setState(e.target.value)}
          />
          <button
            onClick={() => {
              setSearchResult(null);
              getQuery(queryCustomers);
            }}
            className="absolute right-0 top-[0.5px] bg-blue-800 text-xl font-bold text-white  rounded-lg h-10 w-10 flex justify-center items-center"
          >
            <HiSearch />
          </button>
        </div>

        <div className=" md:w-1/4 flex flex-col md:flex-row gap-8">
          <div className="w-full relative min-h-full">
            <PhoneInput
              specialLabel="customer Phone Number"
              placeholder="Phone Number"
              country={"ng"}
              onlyCountries={["ng"]}
              value={phoneNumber}
              prefix="+"
              onChange={(phone) => {
                phone = "+" + phone;
                setPhoneNumber(phone);
              }}
              containerClass={" !w-full"}
              inputClass={"!w-full !h-11"}
            />
            <button
              onClick={searchByPhone}
              className="bg-blue-800 text-xl font-bold text-white absolute top-0 right-0 rounded-lg min-h-full w-10 flex justify-center items-center"
            >
              <HiSearch />
            </button>
          </div>
        </div>
      </div>
      <div className=" w-full">
        <TableGrid
          autoHeight
          columns={columns}
          rows={searchResult ? searchResult : customers}
          hideFooter
        />
        {!searchResult && (
          <div className="bg-blue-200 p-4">
            <div className="flex gap-6 justify-end pr-8">
              <button
                className="flex items-center text-slate-800 "
                onClick={() => getQuery(previousCustomers)}
              >
                <GrFormPrevious />
              </button>
              <button
                className="flex items-center text-slate-800 "
                onClick={() => getQuery(nextCustomers)}
              >
                <GrFormNext />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : (
    <p>loading</p>
  );
};

export default Customers;
