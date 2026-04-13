import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({allowedRoles}) {
    const {isAuthenticated,checkUserLoading,user} = useSelector((state) => state.user);
    console.log("User in ProtectedRoute: ", user);
  
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
  if(allowedRoles && !allowedRoles.includes(user?.roleUser)){
    return <Navigate to="/access-denied" replace />;
  }

  return <Outlet />;
}