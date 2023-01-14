import { Outlet, Navigate } from "react-router-dom";
import { useUserContext } from "../contexts/CurrentUser.Context";

const LoginRoute = () => {
  const { currentUser } = useUserContext();

  return currentUser ? <Navigate to="/" /> : <Outlet />;
};
export default LoginRoute;
