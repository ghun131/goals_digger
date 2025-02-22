import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
};
