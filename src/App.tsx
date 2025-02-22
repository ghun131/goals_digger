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
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import TimerPopup from "./components/TimerPopup";
import WaitingConfirmation from "./components/WaitingConfirmation";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

// Add PrivateRoute component

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="h-screen w-screen bg-black">
          <Routes>
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/sign-in" element={<SignIn />} />
            
            {/* Protected Routes */}
            <Route path="/goals" element={
              <PrivateRoute>
                <GoalSetting />
              </PrivateRoute>
            } />
            <Route path="/deposit" element={
              <PrivateRoute>
                <DepositBet />
              </PrivateRoute>
            } />
            <Route path="/waiting-confirmation" element={
              <PrivateRoute>
                <WaitingConfirmation />
              </PrivateRoute>
            } />
            <Route path="/timer" element={
              <PrivateRoute>
                <TimerPopup />
              </PrivateRoute>
            } />
            <Route path="/lose-options" element={
              <PrivateRoute>
                <LoseOptions />
              </PrivateRoute>
            } />
            <Route path="/charity-selection" element={
              <PrivateRoute>
                <CharitySelection />
              </PrivateRoute>
            } />
            <Route path="/developer-donation" element={
              <PrivateRoute>
                <DeveloperDonation />
              </PrivateRoute>
            } />
            <Route path="/goal-success" element={
              <PrivateRoute>
                <GoalSuccess />
              </PrivateRoute>
            } />

            <Route path="/" element={<Navigate to="/sign-in" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
