import { TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { doc, serverTimestamp, setDoc, Timestamp } from "firebase/firestore";
import React, { useState } from "react";
import { idGenerator } from "../AppBrain";
import CustomButton from "../components/button/button";
import Header from "../components/Header";
import Input from "../components/input/input";
import Modal from "../components/Modal";
import { useThemeContext } from "../contexts/themeContext";
import { db } from "../firebase/firebase";

const JobAdverts = () => {
  const [title, setTitle] = useState("");
  const [minQualification, setMinQualification] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [closingDate, setClosingDate] = useState(new Date());
  const { openModal, closeModal } = useThemeContext();
  const handleSubmit = () => {
    const id = idGenerator(6);
    setDoc(doc(db, "jobs", id), {
      id,
      title,
      minQualification,
      location,
      description,
      closingDate: Timestamp.fromDate(closingDate),
      dateCreated: serverTimestamp(),
    }).then(() => {
      setTitle("");
      setMinQualification("");
      setLocation("");
      setDescription("");
      setClosingDate(new Date());
      closeModal("confirm");
    });
  };
  return (
    <div>
      <Header title="Job Adverts" />

      <div className="mb-4">
        <label
          htmlFor="jobTitle"
          className="block text-gray-700 font-bold mb-2"
        >
          Job Title
        </label>
        <Input
          type="text"
          id="jobTitle"
          required
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Enter job title"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="location"
          className="block text-gray-700 font-bold mb-2"
        >
          Location
        </label>
        <Input
          type="text"
          id="location"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          placeholder="Enter location"
        />
      </div>
      <div className="flex gap-4 my-6 items-center">
        <p className="block text-gray-700 font-bold ">Application Deadline</p>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            renderInput={(props) => (
              <TextField
                {...props}
                inputProps={{ ...props.inputProps, readOnly: true }}
              />
            )}
            label="End"
            value={closingDate}
            onChange={(newValue) => {
              setClosingDate(newValue.$d);
            }}
          />
        </LocalizationProvider>
      </div>
      <div className="mb-4">
        <label
          htmlFor="minQualification"
          className="block text-gray-700 font-bold mb-2"
        >
          Minimum Qualification
        </label>
        <Input
          type="text"
          id="minQualification"
          value={minQualification}
          onChange={(event) => setMinQualification(event.target.value)}
          placeholder="Enter minimum qualification"
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="description"
          className="block text-gray-700 font-bold mb-2"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          required
          placeholder="Enter job description"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 invalid:border-red-400 leading-tight focus:outline-none focus:shadow-outline"
          rows={5}
        />
      </div>
      <div className="flex items-center justify-center">
        <button
          onClick={() => {
            title && description && closingDate
              ? openModal("confirm")
              : alert("You must enter both title and description");
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit
        </button>
      </div>
      <Modal id="confirm" title="Confirm Job Placement">
        <div className="flex flex-col p-10 ">
          <p className="text-center mb-1">Are you sure you wnat to submit</p>
          <p className="text-center mb-6">Advert will appear on website</p>
          <CustomButton handleClick={handleSubmit}>OK</CustomButton>
        </div>
      </Modal>
    </div>
  );
};

export default JobAdverts;
