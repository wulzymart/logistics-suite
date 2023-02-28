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
import Trips from "./pages/Trips";
import Trip from "./pages/Trip";
import Customers from "./pages/Customers";
import Staffs from "./pages/Staffs";
import Staff from "./pages/Staff";
import AddExpense from "./pages/AddExpense";
import Expenses from "./pages/Expenses";
import ManageExpenses from "./pages/ManageExpenses";

import Inflow from "./pages/Inflow";
import Outflow from "./pages/Outflow";
import ManagePricelist from "./pages/ManagePricelist";
import AssignLocalTrip from "./pages/AssignLocalTrip";
import NotFound from "./pages/NotFound";
import AdminRoutes from "./utils/AdminRoutes";
import SuperAdminRoutes from "./utils/SuperAdminRoutes";
import PickupRequests from "./pages/PickupRequests";
import PickupRequest from "./pages/PickupRequest";
import Station from "./pages/Station";
import StationSummary from "./pages/StationSummary";
import ManageReviews from "./pages/ManageReviews";
import JobAdverts from "./pages/JobAdverts";

function App() {
  const { currentMode } = useThemeContext();
  const { states } = useAppConfigContext();
  const { isLoading } = useUserContext();
  if (!isLoading) {
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
                      <Route index element={<Summary />} />
                      <Route path="profile" element={<Profile />} />

                      <Route path="new-waybill">
                        <Route index element={<NewWaybil />} />
                        <Route
                          path="order-summary"
                          element={<OrderSummaryPage />}
                        />
                      </Route>
                      <Route
                        path="pickup-requests"
                        element={<PickupRequests />}
                      />
                      <Route
                        path="pickup-requests/:id"
                        element={<PickupRequest />}
                      />
                      <Route path="create-trip" element={<CreateTrip />} />
                      <Route path="new-expense" element={<AddExpense />} />

                      <Route path="inbound" element={<Inbound />} />
                      <Route path="outbound" element={<Outbound />} />
                      <Route path="assign-trip" element={<AssignTrip />} />
                      <Route
                        path="assign-local-trip"
                        element={<AssignLocalTrip />}
                      />
                      <Route path="orders/:id" element={<OrderPage />} />
                      <Route path="/customers" element={<Customers />} />
                      <Route path="/customers/:id" element={<CustomerPage />} />
                      <Route path="trips" element={<Trips />} />
                      <Route path="/trips/:trip" element={<Trip />} />
                      <Route element={<AdminRoutes />}>
                        <Route path="admin">
                          <Route
                            path="station-summary"
                            element={<StationSummary />}
                          />
                          <Route path="expenses" element={<Expenses />} />
                          <Route
                            path="create-route"
                            element={<CreateRoute />}
                          />
                        </Route>
                      </Route>
                      <Route element={<SuperAdminRoutes />}>
                        <Route path="super-admin">
                          <Route
                            path="staff-registration"
                            element={<NewStaff />}
                          />
                          <Route path="staff" element={<Staffs />} />
                          <Route path="staff/:id" element={<Staff />} />
                          <Route
                            path="new-ecommerce-customer"
                            element={<RegisterEcommerce />}
                          />
                          <Route path="stations" element={<ManageStations />} />
                          <Route path="stations/:id" element={<Station />} />
                          <Route
                            path="manage-expenses"
                            element={<ManageExpenses />}
                          />
                          <Route path="money-in" element={<Inflow />} />
                          <Route path="money-out" element={<Outflow />} />

                          <Route path="add-stations" element={<AddStation />} />
                          <Route path="add-vehicle" element={<AddVehicle />} />
                          <Route path="jobs" element={<JobAdverts />} />
                          <Route
                            path="manage-pricing"
                            element={<ManagePricelist />}
                          />
                          <Route
                            path="create-route"
                            element={<CreateRoute />}
                          />
                          <Route path="reviews" element={<ManageReviews />} />
                        </Route>
                      </Route>
                    </Route>
                    <Route path="*" element={<NotFound />} />
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
  } else return <p>loading</p>;
}

export default App;
