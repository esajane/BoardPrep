import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { selectUser } from "../redux/slices/authSlice";

function PrivateRoute({ children }: any) {
  const user = useAppSelector(selectUser);
  if (!user.isAuth) {
    console.log(user);
    return <Navigate to="/home" replace />;
  }

  return children;
}

export default PrivateRoute;
