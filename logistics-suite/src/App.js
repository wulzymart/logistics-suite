import { BrowserRouter, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import Summary from "./pages/Summary";
import Login from "./pages/Login";

import NewWaybil from "./pages/NewWaybil";

import NewStaff from "./pages/NewStaff";

import PrivateRoutes from "./utils/PrivateRoutes";
import LoginRoute from "./utils/loginRoute";
import { useThemeContext } from "./contexts/themeContext";
import OrderSummaryPage from "./pages/OrderSummaryPage";
import PrintOrder from "./pages/PrintOrder";
import ManageStations from "./pages/ManageStations";
import CreateRoute from "./pages/CreateRoute";
import CreateTrip from "./pages/CreateTrip";
import AssignTrip from "./pages/AssignTrip";
import AddStation from "./pages/AddStation";
import RegisterEcommerce from "./pages/RegisterEcommerce";
import { NewWaybillProvider } from "./contexts/NewWaybillContext";
import { useAppConfigContext } from "./contexts/AppConfig.context";
import AddVehicle from "./pages/Add Vehicle";
import Profile from "./pages/Profile";
import { useUserContext } from "./contexts/CurrentUser.Context";
import OrderPage from "./pages/OrderPage";
import CustomerPage from "./pages/CustomerPage";
import Inbound from "./pages/Inbound";
import Outbound from "./pages/Outbound";
import { TableProvider } from "./contexts/TablesContext";
import Trips from "./pages/Trips";
import Trip from "./pages/Trip";

function App() {
  const { currentMode } = useThemeContext();
  const { states } = useAppConfigContext();
  const { currentUser } = useUserContext();
  return (
    <div>
      {states ? (
        <div className={`${currentMode === "Dark" ? "dark" : ""} `}>
          <BrowserRouter>
            <NewWaybillProvider>
              <Routes>
                <Route element={<PrivateRoutes />}>
                  <Route path="/print-waybill" element={<PrintOrder />} />
                </Route>
                <Route element={<Layout />}>
                  <Route path="/" element={<PrivateRoutes />}>
                    <Route
                      index
                      element={
                        currentUser !== "loading" ? <Summary /> : "loading"
                      }
                    />
                    <Route path="profile">
                      <Route
                        index
                        element={
                          currentUser !== "loading" ? <Profile /> : "loading"
                        }
                      />
                    </Route>
                    <Route path="new-waybill">
                      <Route index element={<NewWaybil />} />
                      <Route
                        path="order-summary"
                        element={<OrderSummaryPage />}
                      />
                    </Route>
                    <Route path="create-trip" element={<CreateTrip />} />
                    <Route path="inbound" element={<Inbound />} />
                    <Route path="outbound" element={<Outbound />} />
                    <Route path="assign-trip" element={<AssignTrip />} />
                    <Route path="orders/:id" element={<OrderPage />} />
                    <Route path="customer" element={<CustomerPage />} />
                    <Route path="trips" element={<Trips />} />
                    <Route path="/trips/:trip" element={<Trip />} />
                    <Route path="admin">
                      <Route path="staff-registration" element={<NewStaff />} />
                      <Route path="stations" element={<ManageStations />} />
                      <Route path="add-stations" element={<AddStation />} />
                      <Route path="add-vehicle" element={<AddVehicle />} />
                      <Route path="create-route" element={<CreateRoute />} />
                      <Route
                        path="new-ecommerce-customer"
                        element={<RegisterEcommerce />}
                      />
                    </Route>
                  </Route>
                </Route>

                <Route element={<LoginRoute />}>
                  <Route path="/login" element={<Login />} />
                </Route>
              </Routes>
            </NewWaybillProvider>
          </BrowserRouter>
        </div>
      ) : (
        <div className="w-full h-screen flex items-center justify-center">
          <p>loading</p>
        </div>
      )}
    </div>
  );
}

export default App;
