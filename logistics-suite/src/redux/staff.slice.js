import { createSlice } from "@reduxjs/toolkit";
import { idGenerator } from "../AppBrain";
const initialState = {
  id: idGenerator(10),
  firstName: "",
  lastName: "",
  phoneNumber: "",
  gender: "",
  email: "",
  password: "",
  qualification: "",
  role: "",
  grossSalary: 0,
  tax: 0,
  pension: 0,
  netSalary: 0,
  rank: "",
  monthlyAllowance: "",
  station: "",
  stationId: "",
  address: {
    state: "",
    lga: "",
    streetAddress: "",
  },
  adminRight: "",
  dateofBirth: "",
  nextOfKin: { name: "", phoneNumber: "" },
  guarantor1: { name: "", phoneNumber: "" },
  guarantor2: { name: "", phoneNumber: "" },

  expenses: [], // new document
};
const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    resetStaff: () => initialState,
    setStaffEmail(state, action) {
      state.email = action.payload;
    },
    setStaffFirstName(state, action) {
      state.firstName = action.payload;
    },
    setStaffLastName(state, action) {
      state.lastName = action.payload;
    },
    setStaffPhoneNumber(state, action) {
      state.phoneNumber = action.payload;
    },
    setStaffPassword(state, action) {
      state.password = action.payload;
    },
    setStaffAdminRight(state, action) {
      state.adminRight = action.payload;
    },
    setStaffQualification(state, action) {
      state.qualification = action.payload;
    },
    setStaffRole(state, action) {
      state.role = action.payload;
    },
    setStaffGender(state, action) {
      state.gender = action.payload;
    },
    setStaffGrossSalary(state, action) {
      state.grossSalary = action.payload;
      state.netSalary =
        (action.payload * 1000 - state.tax * 1000 - state.pension * 1000) /
        1000;
    },
    setStaffPension(state, action) {
      state.pension = action.payload;
      state.netSalary =
        (state.grossSalary * 1000 - action.payload * 1000 - state.tax * 1000) /
        1000;
    },
    setStaffTax(state, action) {
      state.tax = action.payload;
      state.netSalary =
        (state.grossSalary * 1000 -
          action.payload * 1000 -
          state.pension * 1000) /
        1000;
    },

    setStaffRank(state, action) {
      state.rank = action.payload;
    },
    setStaffMonthlyAllowance(state, action) {
      state.monthlyAllowance = action.payload;
    },

    setStaffState(state, action) {
      state.address.state = action.payload;
    },
    setStaffLga(state, action) {
      state.address.lga = action.payload;
    },
    setStaffAddress(state, action) {
      state.address.streetAddress = action.payload;
    },
    setStaffStation(state, action) {
      state.station = action.payload;
    },
    setStaffDOB(state, action) {
      state.dateofBirth = action.payload;
    },
    setGuarantor1Name(state, action) {
      state.guarantor1.name = action.payload;
    },
    setGuarantor1Phone(state, action) {
      state.guarantor1.phoneNumber = action.payload;
    },
    setGuarantor2Name(state, action) {
      state.guarantor2.name = action.payload;
    },
    setGuarantor2Phone(state, action) {
      state.guarantor2.phoneNumber = action.payload;
    },
    setNOKName(state, action) {
      state.nextOfKin.name = action.payload;
    },
    setNOKPhone(state, action) {
      state.nextOfKin.phoneNumber = action.payload;
    },
    setStaffStationId(state, action) {
      state.stationId = action.payload;
    },
  },
});
export const {
  setStaffEmail,
  setStaffFirstName,
  setStaffLastName,
  setStaffPhoneNumber,
  setStaffPassword,
  setStaffQualification,
  setStaffRole,
  setStaffGrossSalary,
  setStaffRank,
  setStaffMonthlyAllowance,
  setStaffDOB,
  setStaffState,
  setStaffLga,
  setStaffAddress,
  setStaffStation,
  setStaffAdminRight,
  setStaffPension,
  setStaffTax,
  setStaffNetSalary,
  setGuarantor1Name,
  setGuarantor1Phone,
  setGuarantor2Name,
  setGuarantor2Phone,
  setNOKName,
  setNOKPhone,
  setStaffStationId,
  setStaffGender,
  resetStaff,
} = staffSlice.actions;
export default staffSlice.reducer;
