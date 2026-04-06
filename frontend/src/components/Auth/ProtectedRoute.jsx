import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
    const {isAuthenticated,checkUserLoading} = useSelector((state) => state.user);
  
  if (checkUserLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Checking authentication...
      </div>
    );// You can replace this with a spinner or skeleton loader
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}