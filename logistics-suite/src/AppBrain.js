import axios from "axios";

export function idGenerator(n) {
  let id = "";
  const key = "1234567890qwertyuiopasdfghjklzxcvbnm";
  for (let i = 0; i < n; i++) {
    id = id + key[Math.floor(Math.random() * key.length)];
    id = id.toUpperCase();
  }
  return id;
}
export const rootUrl =
  process.env.NODE_ENV === "production" ? "https://ls.webcouture.com.ng" : "";
export const themeColors = [
  {
    name: "blue-theme",
    color: "#1A97F5",
  },
  {
    name: "green-theme",
    color: "#03C9D7",
  },
  {
    name: "purple-theme",
    color: "#7352FF",
  },
  {
    name: "red-theme",
    color: "#FF5C8E",
  },
  {
    name: "indigo-theme",
    color: "#1E4DB7",
  },
  {
    color: "#FB9678",
    name: "orange-theme",
  },
];

export const appBrain = {
  customerOptions: ["Yes", "No"],
  customersSex: ["Male", " Female"],
  deliveryTypeOptions: [
    "Station to Delivery man",
    "Interstation",
    "Pickup to Station",
    "Pickup to Delivery man",
  ],
  interCityOptions: ["Yes", "No"],

  serviceTypeOptions: ["Regular", "Express Delivery"],
  shipmentCartegory: {
    Document: { price: 1500 },
    Cargo: { price: 200, weight: { min: 1, max: 8 } },
    Parcel: { price: (weight) => weight * 200, weight: { min: 1, max: 8 } },
  },

  itemCartegories: {
    "Other Document": { weight: 1 },
    Certificates: { weight: 1 },
    "Travel Document": { weight: 1 },
  },

  itemConditionOptions: ["Good", "Damaged", "Partially damaged", "Liquid"],
  additionalCharges: [
    "loading",
    "unloading",
    "packaging",
    "security",
    "freight adjustment",
    "Pick-up",
    "Delivery Man",
  ],
  cashOnDeliveryOptions: ["Yes", "No"],
  paymentTypes: ["Cash", "Card", "Transfer"],

  vat: 0.075,
  insurance: 0.005,

  // price 1500
  //1-8kg parcel 200/kg
  //cargo 9kg

  //to get office stations
  officeStations: ["Head Office", "Okene Branch", "Ibadan Branch"],
  jobDesignations: [
    "Human Resource Manager",
    "Branch Manager",
    "Field Staff",
    "Vehicle Attendant",
    "Driver",
  ],
  accessRights: ["Normal User", "Admin", "Super Admin"],
};
export const sendBooked = async (phoneNmber, orderNumber) => {
  await axios.post(
    "https://api.ng.termii.com/api/sms/send",
    {
      to: phoneNmber,
      from: "FLL NG LTD",
      sms: `Your order with tracking number ${orderNumber} has been booked and awaiting awaiting dispatch.
      Go to https://firstlinelogistics.ng/tracking to track your order`,
      type: "plain",
      api_key: "TLyU5njwth1Dl2UVtJWjzRAlPZDdNqz4ZDYZSyw8gMTMJZTDx7cNtvvnFcQpEl",
      channel: "generic",
    },
    { headers: { "Content-Type": "application/json" } }
  );
};
export const sendDispatchedSender = async (phoneNmber, orderNumber) => {
  await axios.post(
    "https://api.ng.termii.com/api/sms/send",
    {
      to: phoneNmber,
      from: "FLL NG LTD",
      sms: `Your order with tracking number ${orderNumber} has been dispatched you will be notified when it is delivered.
      Go to https://firstlinelogistics.ng/tracking to track your order`,
      type: "plain",
      api_key: "TLyU5njwth1Dl2UVtJWjzRAlPZDdNqz4ZDYZSyw8gMTMJZTDx7cNtvvnFcQpEl",
      channel: "generic",
    },
    { headers: { "Content-Type": "application/json" } }
  );
};
export const sendDispatchedReceiver = async (phoneNmber, orderNumber) => {
  await axios.post(
    "https://api.ng.termii.com/api/sms/send",
    {
      to: phoneNmber,
      from: "FLL NG LTD",
      sms: `Your order with tracking number ${orderNumber} has arrived the destination station, Please ensure a valid means of identification for pickup or delivery.
      Go to https://firstlinelogistics.ng/tracking to track your order`,
      type: "plain",
      api_key: "TLyU5njwth1Dl2UVtJWjzRAlPZDdNqz4ZDYZSyw8gMTMJZTDx7cNtvvnFcQpEl",
      channel: "generic",
    },
    { headers: { "Content-Type": "application/json" } }
  );
};
export const sendArrived = async (phoneNmber, orderNumber) => {
  await axios.post(
    "https://api.ng.termii.com/api/sms/send",
    {
      to: phoneNmber,
      from: "FLL NG LTD",
      sms: `Your order with tracking number ${orderNumber} has been dispatched you will be notified when it is arrives and alerted for pickup.
      Go to https://firstlinelogistics.ng/tracking to track your order`,
      type: "plain",
      api_key: "TLyU5njwth1Dl2UVtJWjzRAlPZDdNqz4ZDYZSyw8gMTMJZTDx7cNtvvnFcQpEl",
      channel: "generic",
    },
    { headers: { "Content-Type": "application/json" } }
  );
};
export const sendDelivered = async (sender, receiver, orderNumber) => {
  await axios.post(
    "https://api.ng.termii.com/api/sms/send",
    {
      to: [sender, receiver],
      from: "FLL NG LTD",
      sms: `Your order with tracking number ${orderNumber} has now been delivered to the receiver.
      Thank You for choosing First Line Logistics`,
      type: "plain",
      api_key: "TLyU5njwth1Dl2UVtJWjzRAlPZDdNqz4ZDYZSyw8gMTMJZTDx7cNtvvnFcQpEl",
      channel: "generic",
    },
    { headers: { "Content-Type": "application/json" } }
  );
};
