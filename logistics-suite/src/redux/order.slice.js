import { createSlice } from "@reduxjs/toolkit";
import { idGenerator } from "../AppBrain";
let date = new Date();

const initialState = {
  id: "",
  customerId: "",
  customerName: "",
  customerAddress: "",
  originStation: "",
  originStationId: "",
  destinationStation: "",
  destinationStationId: "",
  intraState: "No",
  intraCity: "No",
  deliveryType: "",
  deliveryStatus: "Order Received",
  trackingInfo: [
    {
      info: "Order Accepted at Origin Station",
      time: date.toLocaleString(),
    },
  ],
  deliveryService: "",
  receiver: {
    firstName: "",
    lastName: "",
    businessName: "",
    phoneNumber: "",
    address: {
      state: "",
      lga: "",
      streetAddress: "",
    },
  },
  item: {
    description: "",
    value: "",
    weight: "",
    quantity: "",
    cartegory: "",
    condition: "",
  },
  insurance: "",
  freightPrice: "",
  additionalCharges: {},
  totalAdditionalCharges: "",
  subtotal: "",
  VAT: "",
  total: "",
  payOnDelivery: "",
  paymentMode: "",
  receiptInfo: "",
  paid: false,
  processedBy: "",
  tripId: "",
};
const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    resetOrder: () => initialState,
    setOrderId(state, action) {
      state.id = action.payload;
    },
    setIntraCity(state, action) {
      state.intraCity = action.payload;
    },
    setIntraState(state, action) {
      state.intraState = action.payload;
    },
    setDeliveryType(state, action) {
      state.deliveryType = action.payload;
    },
    setDeliveryService(state, action) {
      state.deliveryService = action.payload;
    },
    setReceiverFirstName(state, action) {
      state.receiver.firstName = action.payload;
    },
    setReceiverLastName(state, action) {
      state.receiver.lastName = action.payload;
    },
    setReceiverBusinessName(state, action) {
      state.receiver.businessName = action.payload;
    },
    setReceiverPhone(state, action) {
      state.receiver.phoneNumber = action.payload;
    },
    setReceiverState(state, action) {
      state.receiver.address.state = action.payload;
    },
    setReceiverLga(state, action) {
      state.receiver.address.lga = action.payload;
    },
    setReceiverStreetAddress(state, action) {
      state.receiver.address.streetAddress = action.payload;
    },
    setItemShipment(state, action) {
      state.item.cartegory = action.payload;
    },
    setItemDescription(state, action) {
      state.item.description = action.payload;
    },
    setItemValue(state, action) {
      state.item.value = action.payload;
    },
    setItemWeight(state, action) {
      state.item.weight = action.payload;
    },
    setItemQuantity(state, action) {
      state.item.quantity = action.payload;
    },
    setItemCondition(state, action) {
      state.item.condition = action.payload;
    },
    setFreightPrice(state, action) {
      state.freightPrice = action.payload;
    },
    setSubtotal(state, action) {
      state.subtotal = action.payload;
    },
    setVAT(state, action) {
      state.VAT = action.payload;
    },
    setAdditionalCharges(state, action) {
      state.additionalCharges = action.payload;
    },
    setTotalAdditionalCharges(state, action) {
      state.totalAdditionalCharges = action.payload;
    },
    setInsurance(state, action) {
      state.insurance = action.payload;
    },
    setTotal(state, action) {
      state.total = action.payload;
    },
    setPayOnDelivery(state, action) {
      state.payOnDelivery = action.payload;
    },
    setPaymentMode(state, action) {
      state.paymentMode = action.payload;
    },
    setReceiptInfo(state, action) {
      state.receiptInfo = action.payload;
    },
    setPaymentStatus(state, action) {
      state.paid = action.payload;
    },
    setProcessedBy(state, action) {
      state.processedBy = action.payload;
    },
    setOriginStation(state, action) {
      state.originStation = action.payload;
    },
    setDestinationStation(state, action) {
      state.destinationStation = action.payload;
    },
    setOriginStationId(state, action) {
      state.originStationId = action.payload;
    },
    setDestinationStationId(state, action) {
      state.destinationStationId = action.payload;
    },

    setCustomerDetails(state, action) {
      state.customerId = action.payload.id;
      state.customerName =
        action.payload.firstName + " " + action.payload.lastName;
      state.customerAddress = action.payload.address;
    },
  },
});
export const {
  setIntraCity,
  setIntraState,
  setDeliveryType,
  setDeliveryService,
  setReceiverFirstName,
  setReceiverLastName,
  setReceiverBusinessName,
  setReceiverPhone,
  setReceiverState,
  setReceiverLga,
  setReceiverStreetAddress,
  setItemShipment,
  setItemDescription,
  setItemValue,
  setItemWeight,
  setItemQuantity,
  setItemCondition,
  setFreightPrice,
  setSubtotal,
  setVAT,
  setAdditionalCharges,
  setTotalAdditionalCharges,
  setInsurance,
  setTotal,
  setPayOnDelivery,
  setPaymentMode,
  setReceiptInfo,
  setPaymentStatus,
  setProcessedBy,
  setOriginStation,
  setDestinationStation,
  setOriginStationId,
  setDestinationStationId,
  setCustomerDetails,
  resetOrder,
  setOrderId,
} = orderSlice.actions;
export default orderSlice.reducer;
