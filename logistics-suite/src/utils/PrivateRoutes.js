import { Navigate, Outlet } from "react-router-dom";

import { useUserContext } from "../contexts/CurrentUser.Context";
const PrivateRoutes = () => {
  const { currentUser } = useUserContext();

  return currentUser ? <Outlet /> : <Navigate to="/login" />;
};
export default PrivateRoutes;
