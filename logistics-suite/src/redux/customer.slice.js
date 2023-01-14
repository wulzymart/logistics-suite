import { createSlice } from "@reduxjs/toolkit";
import { idGenerator } from "../AppBrain";

const initialState = {
  id: idGenerator(12),
  customerType: "individual",
  firstName: "",
  lastName: "",
  businessName: "",
  sex: "",
  dateOfBirth: new Date().toUTCString(),
  phoneNumber: "",
  email: "",
  address: {
    state: "",
    lga: "",
    streetAddress: "",
  },

  dateRegistered: new Date().toUTCString(),
};
export const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    resetCustomer: () => initialState,

    setCustomerType(state, action) {
      state.customerType = action.payload;
    },
    setCustomerBusinessName(state, action) {
      state.businessName = action.payload;
    },
    setCustomerFirstName(state, action) {
      state.firstName = action.payload;
    },
    setCustomerLastName(state, action) {
      state.lastName = action.payload;
    },
    setCustomerEmail(state, action) {
      state.email = action.payload;
    },
    setCustomerPhone(state, action) {
      state.phoneNumber = action.payload;
    },
    setCustomerSex(state, action) {
      state.sex = action.payload;
    },
    setCustomerDOB(state, action) {
      state.dateOfBirth = action.payload;
    },
    setCustomerState(state, action) {
      state.address.state = action.payload;
    },
    setCustomerLga(state, action) {
      state.address.lga = action.payload;
    },
    setCustomerStreetAddress(state, action) {
      state.address.streetAddress = action.payload;
    },
    getCustomerFromDB: (state, action) => action.payload,
    setWalletBalance(state, action) {
      state.walletBalance = action.payload;
    },
  },
});
export const {
  setCustomerFirstName,
  setCustomerLastName,
  setCustomerEmail,
  setCustomerSex,
  setCustomerDOB,
  setCustomerState,
  setCustomerLga,
  setCustomerStreetAddress,
  getCustomerFromDB,
  setCustomerPhone,
  resetCustomer,
  setCustomerType,
  setCustomerBusinessName,
  setWalletBalance,
} = customerSlice.actions;
export default customerSlice.reducer;
