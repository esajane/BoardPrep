import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { selectUser } from "../redux/slices/authSlice";

function PublicRoute({ children }: any) {
  const user = useAppSelector(selectUser);
  const location = useLocation();
  if (user.isAuth) {
    const previousLocation = location.state?.from || "/classes"; // change lang sa inyo route pag check
    return <Navigate to={previousLocation} replace />;
  }

  return children;
}

export default PublicRoute;
