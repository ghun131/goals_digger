import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireStatuses?: string[];
}

export default function ProtectedRoute({
  children,
  requireStatuses,
}: ProtectedRouteProps) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  const [goalStatus, setGoalStatus] = useState<string | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    const checkGoalStatus = async () => {
      if (!location.state?.goalId) {
        setCheckingStatus(false);
        return;
      }

      try {
        const goalDoc = await getDoc(doc(db, "goals", location.state.goalId));
        if (goalDoc.exists()) {
          setGoalStatus(goalDoc.data().status);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setCheckingStatus(false);
      }
    };

    checkGoalStatus();
  }, [location.state?.goalId]);

  if (loading || checkingStatus) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/sign-in" />;
  }

  if (requireStatuses?.includes(goalStatus || "")) {
    return <Navigate to="/goals" />;
  }

  return <>{children}</>;
}
