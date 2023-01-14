import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAEiXebPZuMHBmC1bA0_B5BqfnsN6aiAkk",
  authDomain: "logistic-suite.firebaseapp.com",
  projectId: "logistic-suite",
  storageBucket: "logistic-suite.appspot.com",
  messagingSenderId: "120266016160",
  appId: "1:120266016160:web:8ed82486f53135b13690c5",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const createOrder = (data) => {
  const orderRef = doc(db, "orders", data.id);

  setDoc(orderRef, data);
};
export const createCustomerAndOrder = async (customer, order) => {
  const customersRef = collection(db, "customers");
  const q = query(
    customersRef,
    where("phoneNumber", "==", customer.phoneNumber)
  );
  const querySnapshot = await getDocs(q);
  const customerRef = doc(db, "customers", customer.id);

  if (querySnapshot.empty) {
    setDoc(customerRef, customer);
    createOrder(order);
  } else alert("Customer with phone number exists");
};
export const getCustomer = async (phone) => {
  let customer;
  const customersRef = collection(db, "customers");
  const q = query(customersRef, where("phoneNumber", "==", phone));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    alert("No customer with this phone Number, Create a new Customer instead");
  } else {
    querySnapshot.forEach((doc) => {
      customer = doc.data();
    });
    return customer;
  }
};
export const createStation = (data) => {
  const stationRef = doc(db, "stations", data.id);
  setDoc(stationRef, data);
};
export const createRoute = (data) => {
  const routeRef = doc(db, "routes", data.id);
  setDoc(routeRef, data);
};
export const createTrip = (data) => {
  const tripRef = doc(db, "trips", data.id);
  setDoc(tripRef, data);
};
