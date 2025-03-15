
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user is authenticated based on session storage
    const adminAuthenticated = sessionStorage.getItem("adminAuthenticated") === "true";
    setIsAuthenticated(adminAuthenticated);
  }, []);

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return <div className="container py-12 flex items-center justify-center">Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  // Render children if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
