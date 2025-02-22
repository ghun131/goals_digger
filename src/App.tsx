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

function App() {
  return (
    <Router>
      <div className="h-full bg-black">
        <Routes>
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/goals" element={<GoalSetting />} />
          <Route path="/deposit" element={<DepositBet />} />
          <Route path="/timer" element={<TimerPopup />} />
          <Route path="/lose-options" element={<LoseOptions />} />
          <Route path="/charity-selection" element={<CharitySelection />} />
          <Route path="/developer-donation" element={<DeveloperDonation />} />
          <Route path="/goal-success" element={<GoalSuccess />} />
          <Route path="/" element={<Navigate to="/sign-in" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
