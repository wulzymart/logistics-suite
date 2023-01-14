import { doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import CustomButton from "../components/button/button";
import Header from "../components/Header";
import Input from "../components/input/input";
import Modal from "../components/Modal";
import { useUserContext } from "../contexts/CurrentUser.Context";
import { useThemeContext } from "../contexts/themeContext";
import { useAppConfigContext } from "../contexts/AppConfig.context";
import { db } from "../firebase/firebase";
import {
  getAuth,
  reauthenticateWithCredential,
  updatePassword,
  EmailAuthProvider,
} from "firebase/auth";

const auth = getAuth();
const user = auth.currentUser;

const Profile = () => {
  const { getHashedPin, comparePin } = useAppConfigContext();
  const { currentUser } = useUserContext();
  const { openModal, closeModal } = useThemeContext();
  const [bankName, setBankName] = useState(currentUser.bank?.bankName);
  const [accountNo, setAccountNo] = useState(currentUser.bank?.accountNo);
  const [disable, setDisable] = useState(currentUser.bank);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const handleEdit = () => {
    setDisable(false);
  };
  const handleSave = () => {
    currentUser.bank = { bankName, accountNo };
    const userRef = doc(db, "users", currentUser.id);
    setDoc(userRef, currentUser);
    setDisable(true);
  };
  const changePassword = () => {
    const credential = EmailAuthProvider.credential(
      currentUser.email,
      oldPassword
    );
    reauthenticateWithCredential(user, credential)
      .then(() => {
        if (newPassword === confirmPassword) {
          updatePassword(user, newPassword)
            .then(() => {
              alert("Password Update successful");
              closeModal("change-password");
            })
            .catch((error) => {
              alert("PassWord Update Not successful", error.message);
            });
        }
      })
      .catch((error) => {
        // An error ocurred
        // ...
      });
  };
  const changePin = () => {
    if (newPin === confirmPin) {
      if (currentUser.pin) {
        if (comparePin(oldPin, currentUser.pin)) {
          currentUser.pin = getHashedPin(newPin);
          const userRef = doc(db, "users", currentUser.id);
          setDoc(userRef, currentUser);
          closeModal("change-Pin");
          setOldPin("");
          setNewPin("");
          setConfirmPin("");
        } else alert("Incorrect Pin: Ensure you input the correct old Pin");
      } else {
        currentUser.pin = getHashedPin(newPin);
        const userRef = doc(db, "users", currentUser.id);
        setDoc(userRef, currentUser);
        closeModal("change-Pin");
        setNewPin("");
        setConfirmPin("");
      }
    } else alert("Error: Ensure New Pin and confirm pin are matching");
  };
  return currentUser ? (
    <div>
      <div className="bg-blue-200 p-4">
        <Header title="Staff Profile" className="bg-blue-200" />
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="flex-1 bg-slate-200  p-10">
          <h4 className="text-xl font-semibold mb-8">Biodata</h4>
          <div className="flex flex-col gap-4">
            <p className="flex">
              <span className="text-xl font-medium mr-2">Name:</span>
              <span>{currentUser.displayName}</span>
            </p>
            <p className="flex">
              <span className="text-xl font-medium mr-2">Qualification:</span>
              <span>{currentUser.qualification}</span>
            </p>
            <p className="flex">
              <span className="text-xl font-medium mr-2">Phone:</span>
              <span>{currentUser.phoneNumber}</span>
            </p>
            <p className="flex">
              <span className="text-xl font-medium mr-2">Email:</span>
              <span>{currentUser.email}</span>
            </p>
            <p className="flex">
              <span className="text-xl font-medium mr-2">Address:</span>
              <span>
                {currentUser.address?.streetAddress}, {currentUser.address?.lga}
                , {currentUser.address?.state}
              </span>
            </p>
          </div>
        </div>
        <div className="flex-1 bg-slate-300 p-10">
          <h4 className="text-xl font-semibold mb-8">Station Information</h4>
          <div className="flex flex-col gap-4">
            <p className="flex">
              <span className="text-xl font-medium mr-2">Station Name:</span>
              <span>{currentUser.station}</span>
            </p>
            <p className="flex">
              <span className="text-xl font-medium mr-2">ID:</span>
              <span>{currentUser.id}</span>
            </p>
            <p className="flex">
              <span className="text-xl font-medium mr-2">Role:</span>
              <span>{currentUser.role}</span>
            </p>
            <p className="flex">
              <span className="text-xl font-medium mr-2">Rank:</span>
              <span>{currentUser.rank}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="p-10 bg-blue-300">
        <p className="text-lg font-semibold mb-4">Bank details</p>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <p>Bank Name</p>
            <Input
              type="text"
              value={bankName}
              handleChange={(e) => setBankName(e.target.value)}
              disabled={disable}
            />
          </div>
          <div className="flex-1">
            <p>Account No</p>
            <Input
              type="text"
              value={accountNo}
              handleChange={(e) => setAccountNo(e.target.value)}
              disabled={disable}
            />
          </div>
          {disable ? (
            <button
              className="flex-3 bg-gray-300 py-2 px-4 rounded-lg mt-4"
              onClick={handleEdit}
            >
              Edit
            </button>
          ) : (
            <button
              className="flex-3 bg-gray-300 py-2 px-4 rounded-lg mt-4"
              onClick={handleSave}
            >
              Save
            </button>
          )}
        </div>
      </div>
      <div className="p-10 bg-blue-300">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 text-center">
            <p className="">Password</p>

            <button
              className="bg-gray-300 py-2 px-4 rounded-lg mt-4"
              onClick={() => openModal("change-password")}
            >
              Change Password
            </button>
          </div>
          <div className="flex-1 text-center">
            <p className="">Pin</p>
            <button
              className="bg-gray-300 py-2 px-4 rounded-lg mt-4"
              onClick={() => openModal("change-Pin")}
            >
              {currentUser.pin ? "Change Pin" : "Enter Pin"}
            </button>
          </div>
        </div>
      </div>
      <Modal title="Change Password" id="change-password">
        <div className=" flex gap-4 mb-8">
          <p>Old Password:</p>
          <Input
            type="password"
            value={oldPassword}
            handleChange={(e) => setOldPassword(e.target.value)}
          />
        </div>
        <div className=" flex gap-4 mb-8">
          <p>New Password:</p>
          <Input
            type="password"
            value={newPassword}
            handleChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className=" flex gap-4 mb-8">
          <p>Confirm Password:</p>
          <Input
            type="password"
            value={confirmPassword}
            handleChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <CustomButton handleClick={() => changePassword()}>Submit</CustomButton>
      </Modal>
      <Modal title="Change Pin" id="change-Pin">
        {currentUser.pin && (
          <div className=" flex gap-4 mb-8">
            <p>Old Pin:</p>
            <Input
              type="password"
              value={oldPin}
              handleChange={(e) => setOldPin(e.target.value)}
            />
          </div>
        )}
        <div className=" flex gap-4 mb-8">
          <p>New Pin:</p>
          <Input
            type="password"
            value={newPin}
            handleChange={(e) => setNewPin(e.target.value)}
          />
        </div>
        <div className=" flex gap-4 mb-8">
          <p>Confirm Pin:</p>
          <Input
            type="password"
            value={confirmPin}
            handleChange={(e) => setConfirmPin(e.target.value)}
          />
        </div>
        <CustomButton handleClick={() => changePin()}>Submit</CustomButton>
      </Modal>
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default Profile;
