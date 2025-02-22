import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import "./App.css";
import CharitySelection from "./components/CharitySelection";
import DepositBet from "./components/DepositBet";
import DeveloperDonation from "./components/DeveloperDonation";
import GoalSetting from "./components/GoalSetting";
import GoalSuccess from "./components/GoalSuccess";
import LoseOptions from "./components/LoseOptions";
import PrivateRoute from "./components/routes/PrivateRoute";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import TimerPopup from "./components/TimerPopup";
import WaitingConfirmation from "./components/WaitingConfirmation";
import { db } from "./config/firebase";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

export interface Goal {
  id: string;
  goal: string;
  status: string;
  userId: string;
  amount: number;
  // ... other goal properties
}

function AppContent() {
  const { currentUser } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGoals = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);
        const goalsRef = collection(db, "goals");
        const goalsQuery = query(
          goalsRef,
          where("userId", "==", currentUser.uid),
          where("status", "in", [
            "pending",
            "in_progress",
            "donating",
            "success",
          ])
        );

        const querySnapshot = await getDocs(goalsQuery);
        const fetchedGoals = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Goal[];

        setGoals(fetchedGoals);
        console.log("Fetched goals:", fetchedGoals); // For debugging
        setLoading(false);
      } catch (error) {
        console.error("Error fetching goals:", error);
        setLoading(false);
      }
    };

    fetchGoals();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-black">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const currentGoal = goals.find((goal) => goal.status === "in_progress");

  return (
    <div className="h-screen w-screen bg-black">
      <Routes>
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />

        {/* Protected Routes */}
        <Route
          path="/goals"
          element={
            currentGoal?.status === "in_progress" ? (
              <Navigate to="/timer" replace />
            ) : currentGoal?.status === "pending" ? (
              <Navigate to="/deposit" replace />
            ) : currentGoal?.status === "donating" ? (
              <Navigate to="/charity-selection" replace />
            ) : (
              <PrivateRoute>
                <GoalSetting />
              </PrivateRoute>
            )
          }
        />
        <Route
          path="/deposit"
          element={
            <PrivateRoute>
              <DepositBet />
            </PrivateRoute>
          }
        />
        <Route
          path="/waiting-confirmation"
          element={
            <PrivateRoute>
              <WaitingConfirmation />
            </PrivateRoute>
          }
        />
        <Route
          path="/timer"
          element={
            <PrivateRoute>
              <TimerPopup />
            </PrivateRoute>
          }
        />
        <Route
          path="/lose-options"
          element={
            <PrivateRoute>
              <LoseOptions />
            </PrivateRoute>
          }
        />
        <Route
          path="/charity-selection"
          element={
            <PrivateRoute>
              <CharitySelection />
            </PrivateRoute>
          }
        />
        <Route
          path="/developer-donation"
          element={
            <PrivateRoute>
              <DeveloperDonation />
            </PrivateRoute>
          }
        />
        <Route
          path="/goal-success"
          element={
            <PrivateRoute>
              <GoalSuccess />
            </PrivateRoute>
          }
        />
        <Route
          path="/"
          element={
            currentGoal?.status === "in_progress" ? (
              <Navigate to="/timer" replace />
            ) : (
              <Navigate to="/sign-in" replace />
            )
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
