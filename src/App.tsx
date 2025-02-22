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
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="h-screen w-screen bg-black">
          <Routes>
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/goals" element={<GoalSetting />} />
            <Route path="/deposit" element={<DepositBet />} />
            <Route
              path="/waiting-confirmation"
              element={<WaitingConfirmation />}
            />

            <Route path="/timer" element={<TimerPopup />} />
            <Route path="/lose-options" element={<LoseOptions />} />
            <Route path="/charity-selection" element={<CharitySelection />} />
            <Route path="/developer-donation" element={<DeveloperDonation />} />
            <Route path="/goal-success" element={<GoalSuccess />} />

            <Route path="/" element={<Navigate to="/sign-in" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
