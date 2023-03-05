/* eslint-disable react-hooks/exhaustive-deps */
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";
import TableGrid from "../components/TableGrid";
import { db } from "../firebase/firebase";

const Trip = () => {
  const { trip } = useParams();

  const [data, setData] = useState();
  const [orders, setOrders] = useState([]);
  const columns = [
    {
      field: "id",
      headerName: "Tracking Id",
      width: 150,
      renderCell: (param) => {
        return <Link to={`/orders/${param.value}`}>{param.value}</Link>;
      },
    },
    {
      field: "customerName",
      headerName: "Customer's Name",
      width: 150,
    },
    {
      field: "originStation",
      headerName: "Destination Station",
      width: 150,
    },
    {
      field: "transferStation",
      headerName: "Transfer Station",

      width: 150,
    },
    {
      field: "destinationStation",
      headerName: "Destination Station",
      width: 150,
    },

    {
      field: "paymentStatus",
      headerName: "Payment Status",

      width: 150,
    },
  ];
  useEffect(() => {
    const ordersRef = collection(db, "orders");
    const orderQuery = query(ordersRef, where("tripId", "==", trip));
    const getQuery = async () => {
      const tempData = [];
      await getDocs(orderQuery).then((docs) =>
        docs.forEach((doc) => tempData.push(doc.data()))
      );
      setOrders(tempData);
    };
    getQuery();
  }, []);
  useEffect(() => {
    const gettrip = async () => {
      const tripData = await getDoc(doc(db, "trips", trip));
      setData(tripData.data());
    };
    gettrip();
    gettrip();
  }, []);

  return data ? (
    <div>
      <Header title="Trip Information" />
      <div className="px-4 py-4">
        <div className="flex flex-wrap">
          <div className="w-full md:w-1/2 px-4 py-2">
            <div className="flex justify-between py-2">
              <div className="text-sm font-medium">ID:</div>
              <div className="text-sm">{data.id}</div>
            </div>
            <div className="flex justify-between py-2">
              <div className="text-sm font-medium">Name:</div>
              <div className="text-sm">{data.name}</div>
            </div>
            <div className="flex justify-between py-2">
              <div className="text-sm font-medium">Date Created:</div>
              <div className="text-sm">
                {data.dateCreated.toDate().toLocaleString("en-US")}
              </div>
            </div>
            <div className="flex justify-between py-2">
              <div className="text-sm font-medium">Origin Station:</div>
              <div className="text-sm">{data.originStation}</div>
            </div>
            <div className="flex justify-between py-2">
              <div className="text-sm font-medium">Destination Station:</div>
              <div className="text-sm">{data.destinationStation}</div>
            </div>
            <div className="flex justify-between py-2">
              <div className="text-sm font-medium">Trip Type:</div>
              <div className="text-sm">{data.tripType}</div>
            </div>
            <div className="flex justify-between py-2">
              <div className="text-sm font-medium">Service Type:</div>
              <div className="text-sm">{data.serviceType}</div>
            </div>
          </div>
          <div className="w-full md:w-1/2 px-4 py-2">
            <div className="flex justify-between py-2">
              <div className="text-sm font-medium">Vehicle:</div>
              <div className="text-sm">{data.vehicle}</div>
            </div>
            <div className="flex justify-between py-2">
              <div className="text-sm font-medium">Route:</div>
              <div className="text-sm">{data.route}</div>
            </div>
            <div className="flex justify-between py-2">
              <div className="text-sm font-medium">Attendant Name:</div>
              <div className="text-sm">{data.attendantName || ""}</div>
            </div>
            <div className="flex justify-between py-2">
              <div className="text-sm font-medium">Attendant Phone:</div>
              <div className="text-sm">{data.attendantPhone || ""}</div>
            </div>

            <div className="flex justify-between py-2">
              <div className="text-sm font-medium">Driver Name:</div>
              <div className="text-sm">{data.driverName}</div>
            </div>
            <div className="flex justify-between py-2">
              <div className="text-sm font-medium">Driver Phone:</div>
              <div className="text-sm">{data.driverPhone}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 w-full ">
        <TableGrid
          autoHeight
          columns={columns}
          rows={orders}
          setSelectedId={() => {}}
        />
      </div>
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default Trip;
