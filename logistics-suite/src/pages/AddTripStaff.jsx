import React, { useState } from "react";
import Header from "../components/Header";
import Input from "../components/input/input";
import { useAppConfigContext } from "../contexts/AppConfig.context";
import { useUserContext } from "../contexts/CurrentUser.Context";
import { useThemeContext } from "../contexts/themeContext";
import PhoneInput from "react-phone-input-2";
import Select from "../components/select-input/select";
import ReactDatePicker from "react-datepicker";
import { idGenerator } from "../AppBrain";
import CustomButton from "../components/button/button";
import PinModal from "../components/PinModal";
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

const AddTripStaff = () => {
  const { statesList, comparePin, stationsList } = useAppConfigContext();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("");
  const [gender, setGender] = useState("");
  const [qualification, setQualification] = useState("");
  const [grossSalary, setGrossSalary] = useState(0);
  const [tax, setTax] = useState(0);
  const [pension, setPension] = useState(0);
  const [netSalary, setNetSalary] = useState(0);
  const [station, setStation] = useState("");
  const [dateofBirth, setDateOfBirth] = useState("");
  const [address, setAdd] = useState({
    state: "",
    streetAddress: "",
  });
  const setAddress = (e) => {
    const { name, value } = e.target;
    setAdd({ ...address, [name]: value });
  };
  const [nextOfKin, setNextOfKin] = useState({
    name: "",
    phoneNumber: "",
  });
  const setNOK = (e) => {
    const { name, value } = e.target;
    setNextOfKin({ ...nextOfKin, [name]: value });
  };
  const [guarantor1, setGuarantor1] = useState({
    name: "",
    phoneNumber: "",
  });
  const setG1 = (e) => {
    const { name, value } = e.target;
    setGuarantor1({ ...nextOfKin, [name]: value });
  };
  const [guarantor2, setGuarantor2] = useState({
    name: "",
    phoneNumber: "",
  });
  const setG2 = (e) => {
    const { name, value } = e.target;
    setGuarantor2({ ...nextOfKin, [name]: value });
  };
  const [bank, setBankDetails] = useState({ bankName: "", accountNo: "" });
  const setBank = (e) => {
    const { name, value } = e.target;
    setBankDetails({ ...bank, [name]: value });
  };

  const [coverage, setCoverage] = useState("");
  const resetStaff = () => {
    setFirstName("");
    setLastName("");
    setPhoneNumber("");
    setRole("");
    setGender("");
    setQualification("");
    setGrossSalary("");
    setTax("");
    setPension("");
    setNetSalary("");
    setStation("");
    setDateOfBirth("");
    setCoverage("");
    setBankDetails({ bankName: "", accountNo: "" });
    setAdd({
      state: "",
      streetAddress: "",
    });
    setNextOfKin({
      name: "",
      phoneNumber: "",
    });
    setGuarantor1({
      name: "",
      phoneNumber: "",
    });
    setGuarantor2({
      name: "",
      phoneNumber: "",
    });
  };

  const { currentUser } = useUserContext();
  const { openModal, closeModal } = useThemeContext();
  const [pin, setPin] = useState("");

  const [displayedDate, setDisplayedDate] = useState(new Date());
  return (
    <div>
      <Header title="New  Trip Staff Registration" category="Form" />

      <p className="font-light text-3xl text-red-800 italic mb-14">
        Please ensure that confirm staff information before filling and before
        submission of form
      </p>
      <div className="w-full">
        <div className="w-full mb-10">
          <p className="font-medium mb-5">Name</p>
          <div className="flex flex-wrap gap-x-[4%] gap-y-8 ">
            <div className="w-full md:w-[48%] ">
              <Input
                placeholder={"First Name"}
                type="text"
                required
                value={firstName}
                handleChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="w-full md:w-[48%]">
              <Input
                placeholder={"Last Name"}
                name={"lastName"}
                type="text"
                required
                value={lastName}
                handleChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="w-full mb-10">
          <div className="flex flex-wrap gap-x-[5%] gap-y-8">
            <div className="w-full md:w-[30%]">
              <p className="font-medium mb-5">Gender</p>
              <Select
                options={["Male", "Female"]}
                value={gender}
                handleChange={(e) => setGender(e.target.value)}
                children="Select one"
              />
            </div>
            <div className="w-full md:w-[30%] ">
              <p className="font-medium mb-5">Date of Birth</p>
              <ReactDatePicker
                selected={displayedDate}
                onChange={(date) => {
                  setDisplayedDate(date);
                  setDateOfBirth(new Date(date).toISOString());
                }}
                dateFormat="dd/MM/yyyy"
                className="w-full rounded-lg"
              />
            </div>
            <div className="w-full md:w-[30%]">
              <p className="font-medium mb-5">Qualification</p>
              <Input
                placeholder={"e.g 'B.Sc (example)'"}
                name={"Qualification"}
                type="text"
                value={qualification}
                handleChange={(e) => setQualification(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="w-full mb-10">
          <div className="flex flex-wrap gap-x-[4%] gap-y-8">
            <div className="w-full md:w-[48%] ">
              <p className="font-medium mb-5">Phone</p>
              <PhoneInput
                specialLabel="Staff Phone Number"
                placeholder="Phone Number"
                country={"ng"}
                onlyCountries={["ng"]}
                prefix="+"
                value={phoneNumber}
                onChange={(phone) => {
                  phone = "+" + phone;
                  setPhoneNumber(phone);
                }}
                containerClass={"!w-full !h-11 "}
                inputClass={"!w-full !min-h-full !invalid:border-red-500"}
                inputProps={{
                  required: true,
                  maxLength: 18,
                }}
              />
            </div>
          </div>
        </div>
        <div className="w-full mb-10">
          <p className="font-medium mb-5">Bank Details</p>
          <div className="flex flex-wrap gap-x-[4%] gap-y-8 ">
            <div className="w-full md:w-[48%] ">
              <Input
                placeholder={"Bank Name"}
                type="text"
                required
                name="bankName"
                value={bank.bankName}
                handleChange={(e) => setBank(e)}
              />
            </div>
            <div className="w-full md:w-[48%]">
              <Input
                placeholder={"Account No"}
                name={"accountNo"}
                type="text"
                required
                value={bank.accountNo}
                handleChange={(e) => setBank(e)}
              />
            </div>
          </div>
        </div>
        <div className="w-full mb-10">
          <p className="font-medium mb-5">Next of Kin</p>
          <div className="flex flex-wrap gap-x-[4%] gap-y-8">
            <div className="w-full md:w-[48%] ">
              <p className="font-medium mb-5">Name</p>
              <Input
                placeholder={"Full Name"}
                name={"name"}
                type="text"
                value={nextOfKin.name}
                handleChange={(e) => setNOK(e)}
              />
            </div>
            <div className="w-full md:w-[48%]">
              <p className="font-medium mb-5">Phone</p>
              <Input
                placeholder="Phone Number"
                name="phoneNumber"
                value={nextOfKin.phoneNumber}
                handleChange={(e) => setNOK(e)}
              />
            </div>
          </div>
        </div>
        <div className="w-full mb-10">
          <p className="font-medium mb-5">Guarantor 1</p>
          <div className="flex flex-wrap gap-x-[4%] gap-y-8">
            <div className="w-full md:w-[48%] ">
              <p className="font-medium mb-5">Name</p>
              <Input
                placeholder={"Full Name"}
                name={"name"}
                type="text"
                value={guarantor1.name}
                handleChange={(e) => setG1(e)}
              />
            </div>
            <div className="w-full md:w-[48%]">
              <p className="font-medium mb-5">Phone</p>
              <Input
                placeholder="Phone Number"
                name="phoneNumber"
                value={guarantor1.phoneNumber}
                handleChange={(e) => setG1(e)}
              />
            </div>
          </div>
        </div>
        <div className="w-full mb-10">
          <p className="font-medium mb-5">Guarantor 2</p>
          <div className="flex flex-wrap gap-x-[4%] gap-y-8">
            <div className="w-full md:w-[48%] ">
              <p className="font-medium mb-5">Name</p>
              <Input
                placeholder={"Full Name"}
                name={"name"}
                type="text"
                value={guarantor2.name}
                handleChange={(e) => setG2(e)}
              />
            </div>
            <div className="w-full md:w-[48%]">
              <p className="font-medium mb-5">Phone</p>
              <Input
                placeholder="Phone Number"
                name="phoneNumber"
                value={guarantor2.phoneNumber}
                handleChange={(e) => setG2(e)}
              />
            </div>
          </div>
        </div>
        <div className="w-full mb-10">
          <p className="font-medium mb-5">Address</p>
          <div className="flex flex-wrap gap-x-[4%] gap-y-8">
            <div className="w-full md:w-[48%]">
              <p className="font-medium mb-5">State</p>
              <Select
                name="state"
                options={statesList}
                value={address.state}
                required
                handleChange={(e) => setAddress(e)}
                children={"Select State"}
              />
            </div>
          </div>
          <div className="w-full mt-5">
            <p className="font-medium mb-5">Street Address</p>
            <Input
              type={"text"}
              name={"streetAddress"}
              required
              placeholder={"Street Address"}
              value={address.streetAddress}
              handleChange={(e) => setAddress(e)}
            />
          </div>
        </div>
        <div className="w-full mb-10">
          <p className="font-medium mb-5">Job Information</p>
          <div className="flex flex-wrap gap-x-[4%] gap-y-8">
            <div className="w-full md:w-[48%]">
              <p className="font-medium mb-5">Service Coverage</p>
              <Select
                options={["Local Station", "Interstation"]}
                value={coverage}
                required
                handleChange={(e) => {
                  setCoverage(e.target.value);
                  (e.target.value === "Interstation" ||
                    e.target.value === "") &&
                    setStation("");
                }}
                children={"Select Coverage"}
              />
            </div>
            {coverage === "Local Station" ? (
              <div className="w-full md:w-[48%]">
                <p className="font-medium mb-5">Station</p>
                <Select
                  name={"staffStation"}
                  options={stationsList}
                  value={station}
                  required
                  handleChange={(e) => {
                    setStation(e.target.value);
                  }}
                  children={"Select Station"}
                />
              </div>
            ) : (
              ""
            )}
            <div className="w-full md:w-[48%] ">
              <p className="font-medium mb-5">Designation</p>
              <Select
                name={"staffRole"}
                value={role}
                required
                options={["Driver", "Vehicle Attendant"]}
                handleChange={(e) => setRole(e.target.value)}
                children={"Select Designation"}
              />
            </div>
          </div>
        </div>
        <div className="w-full mb-10">
          <p className="font-medium mb-5">Salary Information</p>
          <div className="flex flex-wrap gap-x-[4%] lg:gap-x-[2.6%] gap-y-8">
            <div className="w-full md:w-[48%] lg:w-[23%]">
              <p className="font-medium mb-5">Gross Salary (NGN)</p>
              <Input
                type={"number"}
                name={"staffGrossSalary"}
                placeholder={"Gross Salary"}
                value={grossSalary}
                handleChange={(e) => {
                  setGrossSalary(+e.target.value);
                  setNetSalary(e.target.value - tax - pension);
                }}
              />
            </div>
            <div className="w-full md:w-[48%] lg:w-[23%] ">
              <p className="font-medium mb-5">Tax (NGN)</p>
              <Input
                type={"number"}
                name={"staffTax"}
                placeholder={"Tax"}
                value={tax}
                handleChange={(e) => {
                  setTax(+e.target.value);
                  setNetSalary(grossSalary - e.target.value - pension);
                }}
              />
            </div>
            <div className="w-full md:w-[48%] lg:w-[23%] ">
              <p className="font-medium mb-5">Pension (NGN)</p>
              <Input
                type={"number"}
                name={"staffPension"}
                placeholder={"Pension"}
                value={pension}
                handleChange={(e) => {
                  setPension(+e.target.value);
                  setNetSalary(grossSalary - tax - e.target.value);
                }}
              />
            </div>
            <div className="w-full md:w-[48%] lg:w-[23%] ">
              <p className="font-medium mb-5">Net Salary (NGN)</p>
              <Input
                type={"number"}
                name={"staffNetSalary"}
                placeholder={"Net Salary"}
                value={netSalary}
                handleChange={(e) => setNetSalary(e.target.value)}
                disabled
              />
            </div>
          </div>
        </div>

        <CustomButton
          handleClick={() =>
            !phoneNumber ||
            !role ||
            !firstName ||
            !lastName ||
            !coverage ||
            !address.state ||
            !address.streetAddress ||
            (coverage === "Local Station" && !station)
              ? alert("Please ensure all required fields are selected")
              : openModal("pin-modal")
          }
        >
          Register
        </CustomButton>
        <PinModal
          pin={pin}
          handleChange={(e) => setPin(e.target.value)}
          handleSubmit={async () => {
            const id = idGenerator(10);
            const tripStaffsRef = collection(db, "tripStaff");
            if (comparePin(pin, currentUser.pin)) {
              const querySnaphot = await getDocs(
                query(tripStaffsRef, where("phoneNumber", "==", phoneNumber))
              );
              if (querySnaphot.empty) {
                setDoc(doc(tripStaffsRef, id), {
                  id,
                  firstName,
                  lastName,
                  displayName: firstName + " " + lastName,
                  phoneNumber,
                  dateCreated: serverTimestamp(),
                  role,
                  gender,
                  qualification,
                  grossSalary,
                  tax,
                  pension,
                  netSalary,
                  station,
                  dateofBirth,
                  address,
                  nextOfKin,
                  guarantor1,
                  guarantor2,
                  coverage,
                  bank,
                }).then(() => {
                  alert("Trip Staff Created");
                  resetStaff();
                });
              } else alert("staff with phone number exists");
            } else alert("Incorrect Pin");
            setPin("");
            closeModal("pin-modal");
          }}
        />
      </div>
    </div>
  );
};

export default AddTripStaff;
