export let states = {};
export const loadStates = (data) => (states = data);

export function idGenerator(n) {
  let id = "";
  const key = "1234567890qwertyuiopasdfghjklzxcvbnm";
  for (let i = 0; i < n; i++) {
    id = id + key[Math.floor(Math.random() * key.length)];
    id = id.toUpperCase();
  }
  return id;
}

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

export const users = {};
export let customers = {};
export const setCustomers = (id, object) => {
  customers = { ...customers, [id]: object };
};
export let orders = {};
export const setOrders = (id, object) => {
  orders = { ...orders, [id]: object };
};
export const routes = {};
export const stations = {};
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
  paymentTypes: ["Cash", "Card", "Transfer", "Wallet"],

  vat: 0.075,
  insurance: 0.005,

  // price 1500
  //1-8kg parcel 200/kg
  //cargo 9kg

  //to get office stations
  officeStations: ["Head Office", "Okene Branch", "Ibadan Branch"],
  stateList: Object.keys(states).map((key) => key),
  jobDesignations: [
    "Human Resource Manager",
    "Branch Manager",
    "Field Staff",
    "Vehicle Attendant",
    "Driver",
  ],
  accessRights: ["Normal User", "Admin", "Super Admin"],
};
