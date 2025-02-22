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
  const [showConfirmation, setShowConfirmation] = useState(false);

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
    setShowConfirmation(true);
  };

  const handleConfirmAchievement = () => {
    navigate("/goal-success", {
      state: {
        goal: mockGoal.goal,
        amount: mockGoal.amount,
      },
    });
  };

  const handleGiveUp = () => {
    navigate("/lose-options", {
      state: {
        goal: mockGoal.goal,
        amount: mockGoal.amount,
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-900 rounded-3xl p-6 sm:p-8 max-w-[440px] w-full relative">
        <div className="flex items-center justify-between gap-2 mb-6">
          <h2 className="text-2xl font-bold text-white">Time Remaining</h2>
          <div>
            <button
              onClick={calculateTimeLeft}
              className="!p-0 !mx-1"
              title="Refresh timer"
            >
              <RefreshIcon />
            </button>
          </div>
        </div>

        <p className="text-gray-400 mb-6">{mockGoal.goal}</p>

        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className="text-center p-3 bg-zinc-800 rounded-lg">
            <div className="text-2xl font-bold text-white">{timeLeft.days}</div>
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

        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-zinc-900 rounded-xl p-6 max-w-sm w-full">
              <h3 className="text-xl font-semibold text-white mb-2">
                Confirm Achievement
              </h3>
              <p className="text-gray-400 mb-6">
                Being honest with yourself is the first step to personal growth.
                Have you truly achieved your goal?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleConfirmAchievement}
                  className="bg-green-500 hover:bg-green-600 text-white flex-1 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Yes, I have
                </button>
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Not yet
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
