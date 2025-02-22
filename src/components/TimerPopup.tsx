import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import RefreshIcon from "../assets/icons/RefreshIcon";

interface LocationState {
  goal: string;
  deadline: string;
  time: string;
  epochTimestamp: number;
  goalId: string;
  amount: number;
  transactionId: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
}

export default function TimerPopup() {
  const navigate = useNavigate();
  const location = useLocation();
  const goalData = location.state as LocationState;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [goalDetails, setGoalDetails] = useState<LocationState | null>(null);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    const fetchGoalDetails = async () => {
      try {
        const goalDoc = await getDoc(doc(db, "goals", goalData.goalId));
        if (goalDoc.exists()) {
          const data = goalDoc.data();
          setGoalDetails({
            goal: data.goal,
            deadline: data.deadline,
            time: data.time,
            epochTimestamp: data.epochTimestamp,
            goalId: goalData.goalId,
            amount: data.amount,
            transactionId: data.transactionId,
          });
        }
      } catch (err) {
        console.error("Error fetching goal:", err);
        setError("Failed to load goal details");
      } finally {
        setLoading(false);
      }
    };

    fetchGoalDetails();
  }, [goalData.goalId]);

  const calculateTimeLeft = () => {
    if (!goalDetails) return;

    const difference = goalDetails.epochTimestamp - new Date().getTime();

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
    if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0) {
      handleGiveUp();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft.days, timeLeft.hours, timeLeft.minutes]);

  useEffect(() => {
    if (goalDetails) {
      // Calculate immediately and then update every minute
      calculateTimeLeft();
      const timer = setInterval(calculateTimeLeft, 60000);

      return () => clearInterval(timer);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goalDetails]);

  const handleGoalAchieved = () => {
    setShowConfirmation(true);
  };

  const handleConfirmAchievement = async () => {
    try {
      setIsConfirming(true);

      // Update goal status to success
      await updateDoc(doc(db, "goals", goalDetails!.goalId), {
        status: "success",
        updatedAt: new Date().getTime(),
      });

      // Navigate to success page
      navigate("/goal-success", {
        state: {
          goal: goalDetails?.goal,
          amount: goalDetails?.amount,
          goalId: goalDetails?.goalId,
        },
      });
    } catch (err) {
      console.error("Error updating goal status:", err);
      setError("Failed to update goal status");
      setIsConfirming(false);
    }
  };

  const handleGiveUp = () => {
    navigate("/lose-options", {
      state: {
        goal: goalDetails?.goal,
        amount: goalDetails?.amount,
        goalId: goalDetails?.goalId,
      },
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!goalDetails) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="text-white">No goal found</div>
      </div>
    );
  }

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

        <p className="text-gray-400 mb-6">{goalDetails.goal}</p>

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
          Due by: {new Date(goalDetails.epochTimestamp).toLocaleString()}
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
                Being HONEST with yourself is the first step to personal growth.
                Have you truly achieved your goal?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleConfirmAchievement}
                  disabled={isConfirming}
                  className="bg-green-500 hover:bg-green-600 text-white flex-1 py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                >
                  {isConfirming ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Confirming...
                    </>
                  ) : (
                    "Yes, I have"
                  )}
                </button>
                <button
                  onClick={() => setShowConfirmation(false)}
                  disabled={isConfirming}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
