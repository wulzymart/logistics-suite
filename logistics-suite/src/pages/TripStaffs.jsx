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
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Select from "../components/select-input/select";
import TableGrid from "../components/TableGrid";
import { useAppConfigContext } from "../contexts/AppConfig.context";
import { useUserContext } from "../contexts/CurrentUser.Context";
import { db } from "../firebase/firebase";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import Input from "../components/input/input";

const TripStaffs = () => {
  const { stationName } = useUserContext();
  const [interstationStaff, setInterstationStaff] = useState([]);

  const { stationsList } = useAppConfigContext();

  const [station, setStation] = useState(stationName);

  const [id, setId] = useState("");
  const [firstVisible, setFirstVisible] = useState("");
  const [lastVisible, setLastVisible] = useState("");
  const [firstVisibleInt, setFirstVisibleInt] = useState("");
  const [lastVisibleInt, setLastVisibleInt] = useState("");

  const staffsRef = collection(db, "tripStaff");
  const [staffs, setStaffs] = useState([]);
  const [searchResult, setSearchResult] = useState(null);
  const [intSearchResult, setIntSearchResult] = useState(null);
  const pageSize = 10;
  const searchById = async () => {
    const queryId = query(
      staffsRef,
      where("id", "==", id),
      where("coverage", "==", "Local Station")
    );

    const querySnapshot = await getDocs(queryId);
    if (!querySnapshot.empty) {
      const tempData = [];
      querySnapshot.forEach((doc) => tempData.push(doc.data()));
      setSearchResult(tempData);
    } else alert("User not found");
  };
  const searchIntById = async () => {
    const queryId = query(
      staffsRef,
      where("id", "==", id),
      where("coverage", "==", "Interstation")
    );
    const querySnapshot = await getDocs(queryId);
    if (!querySnapshot.empty) {
      const tempData = [];
      querySnapshot.forEach((doc) => tempData.push(doc.data()));
      setIntSearchResult(tempData);
    } else alert("User not found");
  };
  const queryStaffs = query(
    staffsRef,
    where("station", "==", station),
    orderBy("dateCreated", "asc"),
    limit(pageSize)
  );
  const nextStaffs = query(
    staffsRef,
    where("station", "==", station),
    orderBy("dateCreated", "asc"),
    startAfter(lastVisible),
    limit(pageSize)
  );
  const previousStaffs = query(
    staffsRef,
    where("station", "==", station),
    orderBy("dateCreated", "asc"),
    endBefore(firstVisible),
    limitToLast(pageSize)
  );
  const queryIntStaffs = query(
    staffsRef,
    where("coverage", "==", "Interstation"),
    orderBy("dateCreated", "asc"),
    limit(pageSize)
  );
  const nextIntStaffs = query(
    staffsRef,
    where("coverage", "==", "Interstation"),
    orderBy("dateCreated", "asc"),
    startAfter(lastVisibleInt),
    limit(pageSize)
  );
  const previousIntStaffs = query(
    staffsRef,
    where("coverage", "==", "Interstation"),
    orderBy("dateCreated", "asc"),
    endBefore(firstVisibleInt),
    limitToLast(pageSize)
  );

  const columns = [
    {
      field: "id",
      headerName: " Id",
      width: 150,
      renderCell: (param) => {
        return (
          <Link to={`/super-admin/trip-staff/${param.value}`}>
            {param.value}
          </Link>
        );
      },
    },
    {
      field: "displayName",
      headerName: "Name",
      width: 150,
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      width: 150,
    },

    {
      field: "role",
      headerName: "Role",
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
      setStaffs(tempData);
    } else {
      type === queryStaffs && setStaffs([]);
      type === nextStaffs && alert("No more staff in this list");
    }
  };
  const getIntQuery = async (type) => {
    const querySnapshot = await getDocs(type);
    if (!querySnapshot.empty) {
      setLastVisibleInt(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setFirstVisibleInt(querySnapshot.docs[0]);
      const tempData = [];
      querySnapshot.forEach((doc) => {
        tempData.push(doc.data());
      });
      setInterstationStaff(tempData);
    } else {
      type === queryIntStaffs && setInterstationStaff([]);
      type === nextIntStaffs && alert("No more staff in this list");
    }
  };
  useEffect(() => {
    getQuery(queryStaffs);
  }, [station]);
  useEffect(() => {
    getIntQuery(queryIntStaffs);
  }, []);

  return stationName ? (
    <div className="flex flex-col gap-24">
      <div>
        <Header title="View Interstation Trip Staff" />
        <div className=" bg-blue-200 p-4 rounded-lg flex flex-col md:flex-row justify-end gap-4">
          <div className=" md:w-1/4 flex flex-col md:flex-row gap-8">
            <div className="w-full relative min-h-full">
              <Input
                type="text"
                value={id}
                handleChange={(e) => setId(e.target.value)}
                placeholder="Staff ID"
              />
              <button
                onClick={searchIntById}
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
            rows={intSearchResult ? intSearchResult : interstationStaff}
            hideFooter
            setSelectedId={() => {}}
          />

          {!intSearchResult && (
            <div className="bg-blue-200 p-4">
              <div className="flex gap-6 justify-end pr-8">
                <button
                  className="flex items-center text-slate-800 "
                  onClick={() => getIntQuery(previousIntStaffs)}
                >
                  <GrFormPrevious />
                </button>
                <button
                  className="flex items-center text-slate-800 "
                  onClick={() => getIntQuery(nextIntStaffs)}
                >
                  <GrFormNext />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div>
        <Header title="View Local Station Trip Staff" />
        <div className=" bg-blue-200 p-4 rounded-lg flex flex-col md:flex-row justify-end gap-4">
          <div className="md:w-1/4 flex relative">
            <Select
              options={stationsList ? stationsList : [""]}
              children="Select Station"
              value={station}
              handleChange={(e) => setStation(e.target.value)}
            />
            <button
              onClick={() => {
                setSearchResult(null);
                getQuery(queryStaffs);
              }}
              className="absolute right-0 top-[0.5px] bg-blue-800 text-xl font-bold text-white  rounded-lg h-10 w-10 flex justify-center items-center"
            >
              <HiSearch />
            </button>
          </div>

          <div className=" md:w-1/4 flex flex-col md:flex-row gap-8">
            <div className="w-full relative min-h-full">
              <Input
                type="text"
                value={id}
                handleChange={(e) => setId(e.target.value)}
                placeholder="Staff ID"
              />
              <button
                onClick={searchById}
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
            rows={searchResult ? searchResult : staffs}
            hideFooter
            setSelectedId={() => {}}
          />
          {!searchResult && (
            <div className="bg-blue-200 p-4">
              <div className="flex gap-6 justify-end pr-8">
                <button
                  className="flex items-center text-slate-800 "
                  onClick={() => getQuery(previousStaffs)}
                >
                  <GrFormPrevious />
                </button>
                <button
                  className="flex items-center text-slate-800 "
                  onClick={() => getQuery(nextStaffs)}
                >
                  <GrFormNext />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <p>loading</p>
  );
};

export default TripStaffs;
