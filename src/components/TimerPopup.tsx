import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RefreshIcon from "../assets/icons/RefreshIcon";

// Mock goal data
const mockGoal = {
  goal: "Learn to play guitar in 3 months",
  deadline: "2024-06-15",
  time: "18:00",
  epochTimestamp: 1740198120000,
  amount: "500000",
};

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
}

export default function TimerPopup() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
  });
  const [isOpen, setIsOpen] = useState(true);

  const calculateTimeLeft = () => {
    const difference = mockGoal.epochTimestamp - new Date().getTime();

    if (difference > 0) {
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
      });
    } else {
      // Goal deadline has passed
      setTimeLeft({ days: 0, hours: 0, minutes: 0 });
    }
  };

  useEffect(() => {
    // Calculate immediately and then update every minute
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleGoalAchieved = () => {
    navigate('/goal-success', {
      state: {
        goal: mockGoal.goal,
        amount: mockGoal.amount
      }
    });
  };

  const handleGiveUp = () => {
    navigate('/lose-options', {
      state: {
        goal: mockGoal.goal,
        amount: mockGoal.amount
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-900 rounded-3xl p-6 sm:p-8 max-w-[440px] w-full relative">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          ✕
        </button>

        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-2xl font-bold text-white">Time Remaining</h2>
          <button
            onClick={calculateTimeLeft}
            title="Refresh timer"
          >
            <RefreshIcon />
          </button>
        </div>

        <p className="text-gray-400 mb-6">{mockGoal.goal}</p>

        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className="text-center p-3 bg-zinc-800 rounded-lg">
            <div className="text-2xl font-bold text-white">
              {timeLeft.days}
            </div>
            <div className="text-sm text-gray-400">Days</div>
          </div>
          <div className="text-center p-3 bg-zinc-800 rounded-lg">
            <div className="text-2xl font-bold text-white">
              {timeLeft.hours}
            </div>
            <div className="text-sm text-gray-400">Hours</div>
          </div>
          <div className="text-center p-3 bg-zinc-800 rounded-lg">
            <div className="text-2xl font-bold text-white">
              {timeLeft.minutes}
            </div>
            <div className="text-sm text-gray-400">Minutes</div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-400">
          Due by: {new Date(mockGoal.epochTimestamp).toLocaleString()}
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={handleGoalAchieved}
            className="bg-green-500 hover:bg-green-600 text-white flex-1 py-3 px-4 rounded-lg font-medium transition-colors"
          >
            Goal Achieved
          </button>
          <button
            onClick={handleGiveUp}
            className="bg-zinc-800 hover:bg-zinc-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            I give up
          </button>
        </div>
      </div>
    </div>
  );
}
