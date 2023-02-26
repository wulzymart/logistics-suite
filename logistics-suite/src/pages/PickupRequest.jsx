import { doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CustomButton from "../components/button/button";
import Header from "../components/Header";
import PinModal from "../components/PinModal";
import { useAppConfigContext } from "../contexts/AppConfig.context";
import { useUserContext } from "../contexts/CurrentUser.Context";
import { useThemeContext } from "../contexts/themeContext";
import { db } from "../firebase/firebase";
import NotFound from "./NotFound";

const PickupRequest = () => {
  const { currentUser } = useUserContext();
  const { openModal, closeModal } = useThemeContext();
  const { comparePin } = useAppConfigContext();
  const { id } = useParams();
  const [request, setRequest] = useState();
  const [notFound, setNotFound] = useState(false);
  const [pin, setPin] = useState("");
  const handleSubmit = () => {
    comparePin(pin, currentUser.pin)
      ? setDoc(
          doc(db, "pickups", id),
          {
            attendedTo: true,
            handledBy: currentUser.displayName,
            handledAt: serverTimestamp(),
          },
          { merge: true }
        ).then(() => {
          setPin("");
          closeModal("pin-modal");
        })
      : alert("incorrent pin");
  };
  useEffect(() => {
    return onSnapshot(doc(db, "pickups", id), (snapshot) => {
      if (snapshot.exists()) {
        setRequest(snapshot.data());
      } else setNotFound(true);
    });
  }, [id]);
  return !notFound ? (
    request && (
      <div>
        <Header title="View Request" />
        <div className="bg-gray-100 p-10 rounded-md">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-gray-500 font-medium">Date Created:</div>
            <div>
              {new Date(request.dateCreated.seconds * 1000).toLocaleString()}
            </div>
            <div className="text-gray-500 font-medium">Attended To:</div>
            <div>{request.attendedTo ? "Yes" : "No"}</div>
            <div className="text-gray-500 font-medium">Name:</div>
            <div>
              {request.firstName} {request.lastName}
            </div>

            {request.businessName && (
              <div className="text-gray-500 font-medium">Business Name:</div>
            )}
            {request.businessName && <div>{request.businessName}</div>}
            <div className="text-gray-500 font-medium">Phone Number:</div>
            <div>{request.phoneNumber}</div>

            <div className="text-gray-500 font-medium">Email:</div>
            <div>{request.email}</div>
            <div className="text-gray-500 font-medium">Service Type:</div>
            <div>{request.serviceType}</div>
            <div className="text-gray-500 font-medium">Delivery Type:</div>
            <div>{request.deliveryType}</div>
            <div className="text-gray-500 font-medium">Origin State:</div>
            <div>{request.originState}</div>
            <div className="text-gray-500 font-medium">Origin Address:</div>
            <div>{request.originAddress}</div>
            <div className="text-gray-500 font-medium">Nearest Station:</div>
            <div>{request.nearestStation}</div>
            <div className="text-gray-500 font-medium">Destination State:</div>
            <div>{request.destinationState}</div>
            {request.destinationStation && (
              <div className="text-gray-500 font-medium">
                Destination Station:
              </div>
            )}
            {request.destinationStation && (
              <div>{request.destinationStation}</div>
            )}
            {request.destinationAddress && (
              <div className="text-gray-500 font-medium">
                Destination Address:
              </div>
            )}
            {request.destinationAddress && (
              <div>{request.destinationAddress}</div>
            )}

            <div className="text-gray-500 font-medium">Description:</div>
            <div>{request.description}</div>

            <div className="text-gray-500 font-medium">Weight:</div>
            <div>{request.weight} kg</div>

            <div className="text-gray-500 font-medium">Value:</div>
            <div>{request.value ? `$${request.value}` : "-"}</div>

            <div className="text-gray-500 font-medium">Quantity:</div>
            <div>{request.quantity || "-"}</div>
          </div>
        </div>
        <div className="flex justify-end my-4">
          {!request.attendedTo && (
            <CustomButton handleClick={() => openModal("pin-modal")}>
              Mark as Responded
            </CustomButton>
          )}
        </div>
        <PinModal
          pin={pin}
          handleChange={(e) => setPin(e.target.value)}
          handleSubmit={handleSubmit}
        />
      </div>
    )
  ) : (
    <NotFound />
  );
};

export default PickupRequest;
