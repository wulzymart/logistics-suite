import React, { useState } from "react";
import Input from "../input/input";
import { useSelector, useDispatch } from "react-redux";
import {
  setStaffEmail,
  setStaffGender,
  setStaffFirstName,
  setStaffLastName,
  setStaffPhoneNumber,
  setStaffPassword,
  setStaffQualification,
  setStaffRole,
  setStaffGrossSalary,
  setStaffPension,
  setStaffTax,
  setStaffNetSalary,
  setStaffAdminRight,
  setStaffMonthlyAllowance,
  setStaffState,
  setStaffLga,
  setStaffAddress,
  setStaffDOB,
  setStaffStation,
  setGuarantor1Name,
  setGuarantor1Phone,
  setGuarantor2Name,
  setGuarantor2Phone,
  setNOKName,
  setNOKPhone,
  setStaffStationId,
  resetStaff,
} from "../../redux/staff.slice";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Select from "../select-input/select";
import { appBrain, rootUrl } from "../../AppBrain";
import ReactDatePicker from "react-datepicker";

import CustomButton from "../button/button";
import axios from "axios";
import { useAppConfigContext } from "../../contexts/AppConfig.context";
import PinModal from "../PinModal";
import { useThemeContext } from "../../contexts/themeContext";
import { useUserContext } from "../../contexts/CurrentUser.Context";

const StaffReg = () => {
  const { states, statesList, stations, comparePin, stationsList } =
    useAppConfigContext();
  const { currentUser } = useUserContext();
  const { openModal } = useThemeContext();
  const [pin, setPin] = useState("");
  console.log(states);

  const [passwordMatch, setPasswordMatch] = useState(true);
  const dispatch = useDispatch();
  const staff = useSelector((state) => state.staff);
  const [displayedDate, setDisplayedDate] = useState(new Date());
  return (
    <div className="w-full">
      <div className="w-full mb-10">
        <p className="font-medium mb-5">Name</p>
        <div className="flex flex-wrap gap-x-[4%] gap-y-8 ">
          <div className="w-full md:w-[48%] ">
            <Input
              placeholder={"First Name"}
              name={"first"}
              type="text"
              required
              value={staff.firstName}
              handleChange={(e) => dispatch(setStaffFirstName(e.target.value))}
            />
          </div>
          <div className="w-full md:w-[48%]">
            <Input
              placeholder={"Last Name"}
              name={"lastName"}
              type="text"
              required
              value={staff.lastName}
              handleChange={(e) => dispatch(setStaffLastName(e.target.value))}
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
              value={staff.gender}
              handleChange={(e) => dispatch(setStaffGender(e.target.value))}
            />
          </div>
          <div className="w-full md:w-[30%] ">
            <p className="font-medium mb-5">Date of Birth</p>
            <ReactDatePicker
              selected={displayedDate}
              onChange={(date) => {
                setDisplayedDate(date);
                dispatch(setStaffDOB(new Date(date).toISOString()));
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
              value={staff.qualification}
              handleChange={(e) =>
                dispatch(setStaffQualification(e.target.value))
              }
            />
          </div>
        </div>
      </div>
      <div className="w-full mb-10">
        <div className="flex flex-wrap gap-x-[4%] gap-y-8">
          <div className="w-full md:w-[48%]">
            <p className="font-medium mb-5">Email</p>
            <Input
              placeholder={"email"}
              name={"email"}
              type={"email"}
              required
              value={staff.email}
              handleChange={(e) => dispatch(setStaffEmail(e.target.value))}
            />
          </div>
          <div className="w-full md:w-[48%] ">
            <p className="font-medium mb-5">Phone</p>
            <PhoneInput
              specialLabel="Staff Phone Number"
              placeholder="Phone Number"
              country={"ng"}
              onlyCountries={["ng"]}
              prefix="+"
              value={staff.phoneNumber}
              onChange={(phone) => {
                phone = "+" + phone;
                dispatch(setStaffPhoneNumber(phone));
              }}
              containerClass={"!w-full !h-11 "}
              inputClass={"!w-full !min-h-full"}
              required
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
              value={staff.nextOfKin.name}
              handleChange={(e) => dispatch(setNOKName(e.target.value))}
            />
          </div>
          <div className="w-full md:w-[48%]">
            <p className="font-medium mb-5">Phone</p>
            <PhoneInput
              specialLabel="Phone Number"
              placeholder="Phone Number"
              country={"ng"}
              prefix="+"
              onlyCountries={["ng"]}
              value={staff.nextOfKin.phoneNumber}
              onChange={(phone) => dispatch(setNOKPhone(phone))}
              containerClass={"!w-full !h-11 "}
              inputClass={"!w-full !min-h-full"}
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
              value={staff.guarantor1.name}
              handleChange={(e) => dispatch(setGuarantor1Name(e.target.value))}
            />
          </div>
          <div className="w-full md:w-[48%]">
            <p className="font-medium mb-5">Phone</p>
            <PhoneInput
              specialLabel="Phone Number"
              placeholder="Phone Number"
              country={"ng"}
              prefix="+"
              onlyCountries={["ng"]}
              value={staff.guarantor1.phoneNumber}
              onChange={(phone) => dispatch(setGuarantor1Phone(phone))}
              containerClass={"!w-full !h-11 "}
              inputClass={"!w-full !min-h-full"}
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
              value={staff.guarantor2.name}
              handleChange={(e) => dispatch(setGuarantor2Name(e.target.value))}
            />
          </div>
          <div className="w-full md:w-[48%]">
            <p className="font-medium mb-5">Phone</p>
            <PhoneInput
              specialLabel="Phone Number"
              placeholder="Phone Number"
              country={"ng"}
              onlyCountries={["ng"]}
              prefix="+"
              value={staff.guarantor2.phoneNumber}
              onChange={(phone) => dispatch(setGuarantor2Phone(phone))}
              containerClass={"!w-full !h-11 "}
              inputClass={"!w-full !min-h-full"}
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
              name={"staffState"}
              options={statesList}
              value={staff.address.state}
              handleChange={(e) => dispatch(setStaffState(e.target.value))}
              children={"Select State"}
            />
          </div>
          <div className="w-full md:w-[48%]">
            <p className="font-medium mb-5">LGA</p>
            <Select
              name={"staffLga"}
              value={staff.address.lga}
              options={
                staff.address.state ? states[staff.address.state].lgas : []
              }
              handleChange={(e) => dispatch(setStaffLga(e.target.value))}
              children={"Select LGA"}
            />
          </div>
        </div>
        <div className="w-full mt-5">
          <p className="font-medium mb-5">Street Address</p>
          <Input
            type={"text"}
            name={"staffStreetAddress"}
            placeholder={"Street Address"}
            value={staff.address.streetAddress}
            handleChange={(e) => dispatch(setStaffAddress(e.target.value))}
          />
        </div>
      </div>
      <div className="w-full mb-10">
        <p className="font-medium mb-5">Job Information</p>
        <div className="flex flex-wrap gap-x-[4%] gap-y-8">
          <div className="w-full md:w-[48%]">
            <p className="font-medium mb-5">Station</p>
            <Select
              name={"staffStation"}
              options={stationsList}
              value={staff.station}
              handleChange={(e) => {
                dispatch(setStaffStation(e.target.value));
                dispatch(setStaffStationId(stations[e.target.value].id));
              }}
              children={"Select Station"}
            />
          </div>
          <div className="w-full md:w-[48%] ">
            <p className="font-medium mb-5">Designation</p>
            <Select
              name={"staffRole"}
              value={staff.role}
              options={appBrain.jobDesignations}
              handleChange={(e) => dispatch(setStaffRole(e.target.value))}
              children={"Select Designation"}
            />
          </div>
        </div>
        <div className="w-full mt-5">
          <p className="font-medium mb-5">Access Right</p>
          <Select
            name={"staffAdminRight"}
            value={staff.adminRight}
            options={appBrain.accessRights}
            handleChange={(e) => dispatch(setStaffAdminRight(e.target.value))}
            children={"Select One"}
          />
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
              value={staff.grossSalary}
              handleChange={(e) =>
                dispatch(setStaffGrossSalary(e.target.value))
              }
            />
          </div>
          <div className="w-full md:w-[48%] lg:w-[23%] ">
            <p className="font-medium mb-5">Tax (NGN)</p>
            <Input
              type={"number"}
              name={"staffTax"}
              placeholder={"Tax"}
              value={staff.tax}
              handleChange={(e) => dispatch(setStaffTax(e.target.value))}
            />
          </div>
          <div className="w-full md:w-[48%] lg:w-[23%] ">
            <p className="font-medium mb-5">Pension (NGN)</p>
            <Input
              type={"number"}
              name={"staffPension"}
              placeholder={"Pension"}
              value={staff.pension}
              handleChange={(e) => dispatch(setStaffPension(e.target.value))}
            />
          </div>
          <div className="w-full md:w-[48%] lg:w-[23%] ">
            <p className="font-medium mb-5">Net Salary (NGN)</p>
            <Input
              type={"number"}
              name={"staffNetSalary"}
              placeholder={"Net Salary"}
              value={staff.netSalary}
              handleChange={(e) => dispatch(setStaffNetSalary(e.target.value))}
              disabled
            />
          </div>
        </div>
        <div className="w-full mt-5">
          <p className="font-medium mb-5">Monthly Expense Allowance</p>
          <Input
            type={"number"}
            name={"staffMonthlyAllowance"}
            placeholder={"Monthly Allowance"}
            value={staff.monthlyAllowance}
            handleChange={(e) =>
              dispatch(setStaffMonthlyAllowance(e.target.value))
            }
          />
        </div>
      </div>
      <div className="w-full mb-10">
        <p className="font-medium mb-5">Set Password</p>
        <div className="flex flex-wrap gap-x-[4%] gap-y-8">
          <div className="w-full md:w-[48%]">
            <p className="font-medium mb-5">Password</p>
            <Input
              id="password"
              placeholder="password"
              name="password"
              type="password"
              style={{ border: { color: passwordMatch === false && "red" } }}
              required
            />
          </div>
          <div className="w-full md:w-[48%]">
            <p className="font-medium mb-5">Confirm Password</p>
            <Input
              id="confirmPassword"
              placeholder={"Confirm Password"}
              name="password"
              type="password"
              required
              style={{ border: { color: passwordMatch === false && "red" } }}
              handleChange={(e) => {
                const matched =
                  document.getElementById("confirmPassword").value ===
                  document.getElementById("password").value;

                if (matched) {
                  dispatch(setStaffPassword(e.target.value));
                  setPasswordMatch(matched);
                } else {
                  dispatch(setStaffPassword(""));
                  setPasswordMatch(matched);
                }
              }}
            />
          </div>
        </div>
        {!passwordMatch ? (
          <p className="font-light text-red-800">
            Passwords not matching
            <em>
              (!This will not be sisplayed if passwords are correctly matched)
            </em>
          </p>
        ) : (
          ""
        )}
      </div>
      <CustomButton
        handleClick={() =>
          !staff.password || !staff.email
            ? alert(
                "Proper Password or Email not inputed, Please Check and try again"
              )
            : openModal("pin-modal")
        }
      >
        Register
      </CustomButton>
      <PinModal
        pin={pin}
        handleChange={(e) => setPin(e.target.value)}
        handleSubmit={() => {
          comparePin(pin, currentUser.pin)
            ? axios
                .post(`https://kind-waders-hare.cyclic.app/api`, staff)
                .then((response) => {
                  if (response.data === true) {
                    alert(" User Created");
                    dispatch(resetStaff());
                  } else alert("error, contact app admin", response.data);
                })
            : alert("Incorrect Pin");
          setPin("");
        }}
      />
    </div>
  );
};

export default StaffReg;
