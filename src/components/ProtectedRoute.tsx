import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // You can create a proper loading component
  }

  if (!currentUser) {
    return <Navigate to="/sign-in" />;
  }

  return <>{children}</>;
} 