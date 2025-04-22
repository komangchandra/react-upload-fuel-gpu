import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn");

  return isLoggedIn ? <Navigate to="/home" /> : children;
};

export default PublicRoute;
