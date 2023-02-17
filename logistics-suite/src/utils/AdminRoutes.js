import { Outlet } from "react-router-dom";
import AccessDenied from "../components/AccessDenied";

import { useUserContext } from "../contexts/CurrentUser.Context";
const AdminRoutes = () => {
  const { currentUser } = useUserContext();
  const authorized = ["Admin", "Super Admin"];

  return authorized.includes(currentUser?.adminRight) ? (
    <Outlet />
  ) : (
    <AccessDenied />
  );
};
export default AdminRoutes;
