import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  customerType: "Individual",
  firstName: "",
  lastName: "",
  businessName: "",
  phoneNumber: "",
  email: "",
  address: {
    state: "",
    streetAddress: "",
  },
};
export const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    resetCustomer: () => initialState,
    setCustomerId(state, action) {
      state.id = action.payload;
    },

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
    // setCustomerSex(state, action) {
    //   state.sex = action.payload;
    // },
    // setCustomerDOB(state, action) {
    //   state.dateOfBirth = new Date(action.payload).toISOString();
    //   state.birthMonth = new Intl.DateTimeFormat("en-US", {
    //     month: "long",
    //   }).format(new Date(action.payload));
    //   state.birthDate = new Date(action.payload).getDate();
    // },
    setCustomerState(state, action) {
      state.address.state = action.payload;
    },

    setCustomerStreetAddress(state, action) {
      state.address.streetAddress = action.payload;
    },
    getCustomerFromDB: (state, action) => action.payload,
    setWalletBalance(state, action) {
      state.walletBalance = +action.payload;
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
  setCustomerId,
} = customerSlice.actions;
export default customerSlice.reducer;
