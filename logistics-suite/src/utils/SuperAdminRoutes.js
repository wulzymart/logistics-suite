import { Outlet } from "react-router-dom";
import AccessDenied from "../components/AccessDenied";

import { useUserContext } from "../contexts/CurrentUser.Context";
const SuperAdminRoutes = () => {
  const { currentUser } = useUserContext();
  const authorized = ["Super Admin"];

  return authorized.includes(currentUser?.adminRight) ? (
    <Outlet />
  ) : (
    <AccessDenied />
  );
};
export default SuperAdminRoutes;
