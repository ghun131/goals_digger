import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import GoalSetting from "./components/GoalSetting";
import DepositBet from "./components/DepositBet";
import LoseOptions from "./components/LoseOptions";
import CharitySelection from "./components/CharitySelection";
import TimerPopup from "./components/TimerPopup";
import DeveloperDonation from "./components/DeveloperDonation";
import GoalSuccess from "./components/GoalSuccess";
import "./App.css";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

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
              <ProtectedRoute>
                <GoalSetting />
              </ProtectedRoute>
            } />
            <Route path="/deposit" element={
              <ProtectedRoute>
                <DepositBet />
              </ProtectedRoute>
            } />
            <Route path="/timer" element={
              <ProtectedRoute>
                <TimerPopup />
              </ProtectedRoute>
            } />
            <Route path="/lose-options" element={
              <ProtectedRoute>
                <LoseOptions />
              </ProtectedRoute>
            } />
            <Route path="/charity-selection" element={
              <ProtectedRoute>
                <CharitySelection />
              </ProtectedRoute>
            } />
            <Route path="/developer-donation" element={
              <ProtectedRoute>
                <DeveloperDonation />
              </ProtectedRoute>
            } />
            <Route path="/goal-success" element={
              <ProtectedRoute>
                <GoalSuccess />
              </ProtectedRoute>
            } />
            
            <Route path="/" element={<Navigate to="/sign-in" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
